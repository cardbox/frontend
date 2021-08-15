import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as fs from 'fs';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyHttpProxy from 'fastify-http-proxy';
import fastifyStatic from 'fastify-static';
import through from 'through';
import {
  $cookiesForRequest,
  $cookiesFromResponse,
  setCookiesForRequest,
} from '@box/api/request';
import { $lastPushed } from '@box/entities/navigation';
import { Event, forward, root, sample } from 'effector-root';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import type { Http2Server } from 'http2';
import { MatchedRoute, matchRoutes } from 'react-router-config';
import { ROUTES } from '@box/pages/routes';
import { RouteGenericInterface } from 'fastify/types/route';
import { ServerStyleSheet } from 'styled-components';
import { StartParams, getStart } from '@box/lib/page-routing';
import { StaticRouter } from 'react-router-dom';
import { allSettled, fork, serialize } from 'effector/fork';
import { performance } from 'perf_hooks';
import { readyToLoadSession, sessionLoaded } from '@box/entities/session';
import { resetIdCounter } from 'react-tabs';

import { Application } from './application';

dotenv.config();

const FIVE_MINUTES = 300;
const ONE_HOUR = 3600;

const serverStarted = root.createEvent<{
  req: FastifyRequest<RouteGenericInterface, Http2Server>;
  res: FastifyReply<Http2Server>;
}>();

const requestHandled = serverStarted.map(({ req }) => req);

const cookiesReceived = requestHandled.filterMap((r) => r.headers.cookie);

const routesMatched = requestHandled.map((request) => ({
  routes: matchRoutes(ROUTES, request.url).filter(lookupStartEvent),
  query: request.query as Record<string, string>,
}));

forward({
  from: cookiesReceived,
  to: setCookiesForRequest,
});

forward({
  from: serverStarted,
  to: readyToLoadSession,
});

for (const { component } of ROUTES) {
  const startPageEvent = getStart(component);

  if (startPageEvent) {
    const matchedRoute = sample(routesMatched, sessionLoaded).filterMap(
      ({ routes, query }) => {
        const route = routes.find(routeWithEvent(startPageEvent));
        if (route) return { route, query };
        return undefined;
      },
    );

    forward({
      from: matchedRoute.map(({ route, query }) => ({
        params: route.match.params,
        query,
      })),
      to: startPageEvent,
    });
  }
}

sample({
  source: serverStarted,
  clock: $cookiesFromResponse,
  fn: ({ res }, cookies) => ({ res, cookies }),
}).watch(({ res, cookies }) => res.header('Set-Cookie', cookies));

sample({
  source: serverStarted,
  clock: $lastPushed,
  fn: ({ res }, redirectUri) => ({ res, redirectUri }),
}).watch(({ res, redirectUri }) => res.redirect(redirectUri));

let assets: any; // eslint-disable-line @typescript-eslint/no-explicit-any

function syncLoadAssets() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
}

syncLoadAssets();

export const fastifyInstance = (() => {
  if (process.env.NODE_ENV === 'development') {
    const CRT = path.resolve(__dirname, '..', 'tls', 'cardbox.crt');
    const KEY = path.resolve(__dirname, '..', 'tls', 'cardbox.key');

    console.info('Create local HTTPS server with certificate and key:');
    console.info(`Cert: ${CRT}`);
    console.info(`Key: ${KEY}`);

    let options;

    try {
      options = {
        https: {
          cert: fs.readFileSync(CRT),
          key: fs.readFileSync(KEY),
          allowHTTP1: true,
        },
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error(
          `\n\n---------\n` +
            `ERROR! No local certificates found in ./tls directory.\n` +
            `Maybe you trying to start application without generating certificates first of all?\n` +
            'You can fix this via running `$ ./scripts/create-certs.sh`, but before read Development section in README.md',
        );
        process.exit(-1);
      }
      throw error;
    }
  }

  if (process.env.USE_SSL === 'true') {
    return fastify({
      https: {
        cert: fs.readFileSync(path.resolve(process.env.TLS_CERT_FILE!)),
        key: fs.readFileSync(path.resolve(process.env.TLS_KEY_FILE!)),
        allowHTTP1: true,
      },
      http2: true,
      logger: true,
    });
  }

  return fastify({
    logger: true,
    http2: true,
  });
})();

fastifyInstance.register(fastifyHttpProxy, {
  upstream: process.env.BACKEND_URL ?? 'http://localhost:9110',
  http2: true,
  prefix: '/api/internal',
  rewritePrefix: '/',
  logLevel: 'debug',
  replyOptions: {
    onError(reply, error) {
      reply.log.error('[proxy error]', error);
    },
  },
});

fastifyInstance.register(fastifyStatic, {
  root: process.env.RAZZLE_PUBLIC_DIR!,
  wildcard: false,
});

fastifyInstance.register(fastifyCookie);

fastifyInstance.get('/*', async function (req, res) {
  this.log.info('[REQUEST] %s %s', req.method, req.url);
  res.header('Content-Type', 'text/html');
  const timeStart = performance.now();
  const scope = fork(root);

  try {
    await allSettled(serverStarted, {
      scope,
      params: { req, res },
    });
  } catch (error) {
    this.log.error(error);
  }

  const storesValues = serialize(scope, {
    ignore: [$cookiesForRequest, $cookiesFromResponse],
    onlyChanges: true,
  });

  const routerContext = {};
  const sheet = new ServerStyleSheet();
  const helmetContext: FilledContext = {} as FilledContext;

  const jsx = sheet.collectStyles(
    <HelmetProvider context={helmetContext}>
      <StaticRouter context={routerContext} location={req.url}>
        <Application root={scope} />
      </StaticRouter>
    </HelmetProvider>,
  );

  if (isRedirected(res)) {
    cleanUp();
    this.log.info(
      '[REDIRECT] from %s to %s at %sms',
      req.url,
      res.getHeader('Location'),
      (performance.now() - timeStart).toFixed(2),
    );
    res.send();
    return;
  }

  let sent = false;

  resetIdCounter();
  const stream = sheet
    .interleaveWithNodeStream(ReactDOMServer.renderToNodeStream(jsx))
    .pipe(
      through(
        function write(data) {
          if (!sent) {
            this.queue(
              htmlStart({
                helmet: helmetContext.helmet,
                assetsCss: assets.client.css,
                assetsJs: assets.client.js,
              }),
            );
            sent = true;
          }
          this.queue(data);
        },
        function end() {
          this.queue(htmlEnd({ storesValues, helmet: helmetContext.helmet }));
          this.queue(null);
        },
      ),
    );

  // if (request.user) {
  //   response.setHeader('Cache-Control', 's-maxage=0, private');
  // } else {
  //   response.setHeader(
  //     'Cache-Control',
  //     `s-maxage=${ONE_HOUR}, stale-while-revalidate=${FIVE_MINUTES}, must-revalidate`,
  //   );
  // }

  res.send(stream);
  cleanUp();

  this.log.info(
    '[PERF] sent page at %sms',
    (performance.now() - timeStart).toFixed(2),
  );

  function cleanUp() {
    sheet.seal();
  }
});

interface StartProps {
  assetsCss?: string;
  assetsJs: string;
  helmet: FilledContext['helmet'];
}

interface EndProps {
  storesValues: Record<string, unknown>;
  helmet: FilledContext['helmet'];
}

function htmlStart(p: StartProps) {
  return `<!doctype html>
    <html ${p.helmet.htmlAttributes.toString()} lang='en'>
    <head>
        ${p.helmet.base.toString()}
        ${p.helmet.meta.toString()}
        ${p.helmet.title.toString()}
        ${p.helmet.link.toString()}
        ${p.helmet.style.toString()}
        ${p.assetsCss ? `<link rel="stylesheet" href="${p.assetsCss}">` : ''}
          ${
            process.env.NODE_ENV === 'production'
              ? `<script src="${p.assetsJs}" defer></script>`
              : `<script src="${p.assetsJs}" defer crossorigin></script>`
          }
    </head>
    <body ${p.helmet.bodyAttributes.toString()}>
        <div id="root">`;
}

function htmlEnd(p: EndProps) {
  return `</div>
        <script>
          window['INITIAL_STATE'] = ${JSON.stringify(p.storesValues)}
        </script>
        ${p.helmet.script.toString()}
        ${p.helmet.noscript.toString()}
    </body>
</html>
  `;
}

function lookupStartEvent<P>(
  match: MatchedRoute<P>,
): Event<StartParams> | undefined {
  if (match.route.component) {
    return getStart(match.route.component);
  }
  return undefined;
}

function routeWithEvent(event: Event<StartParams>) {
  return function <P>(route: MatchedRoute<P>) {
    return lookupStartEvent(route) === event;
  };
}

function isRedirected(response: FastifyReply<Http2Server>): boolean {
  return response.statusCode >= 300 && response.statusCode < 400;
}
