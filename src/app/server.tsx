import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as fs from 'fs';
import * as path from 'path';
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
} from '@box/shared/api/request';
import { $redirectTo, initializeServerHistory } from '@box/entities/navigation';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { HatchParams, getHatch } from 'framework';
import type { Http2Server } from 'http2';
import { ROUTES } from '@box/pages/routes';
import { RouteGenericInterface } from 'fastify/types/route';
import { ServerStyleSheet } from 'styled-components';
import { StaticRouter } from 'react-router-dom';
import {
  allSettled,
  createEvent,
  fork,
  forward,
  sample,
  serialize,
} from 'effector';
import { env } from '@box/shared/config';
import { logger } from '@box/shared/lib/logger';
import { matchRoutes } from 'react-router-config';
import { performance } from 'perf_hooks';
import { readyToLoadSession, sessionLoaded } from '@box/entities/session';
import { resetIdCounter } from 'react-tabs';
import { splitMap } from 'patronum/split-map';

import { Application } from './application';

dotenv.config();

initializeServerHistory();

const serverStarted = createEvent<{
  req: FastifyRequest<RouteGenericInterface, Http2Server>;
  res: FastifyReply<Http2Server>;
}>();

const requestHandled = serverStarted.map(({ req }) => req);

const cookiesReceived = requestHandled.filterMap((r) => r.headers.cookie);

const { routeResolved, __: routeNotResolved } = splitMap({
  source: requestHandled,
  cases: {
    routeResolved({ url, query }) {
      const routes = matchRoutes(ROUTES, url.split('?')[0]);

      if (routes.length > 0)
        return {
          route: routes[0].route,
          match: routes[0].match,
          url,
          query,
        };

      return undefined;
    },
  },
});

routeResolved.watch((match) => {
  logger.trace(match, `Route resolved`);
});

routeNotResolved.watch((req) => {
  logger.fatal(
    { url: req.url, query: req.query },
    `Not found route for this path`,
  );
});

forward({
  from: cookiesReceived,
  to: setCookiesForRequest,
});

forward({
  from: serverStarted,
  to: readyToLoadSession,
});

for (const { component, path, exact } of ROUTES) {
  if (!component) {
    logger.trace({ component, path, exact }, `No component for path "${path}"`);
    continue;
  }

  const hatch = getHatch(component);
  if (!hatch) {
    logger.trace({ component, path, exact }, `No hatch for path "${path}"`);
    continue;
  }

  const { routeMatched, __: notMatched } = splitMap({
    source: sample(routeResolved, sessionLoaded),
    cases: {
      routeMatched({ route, match, query }) {
        if (route.path === path)
          return {
            // route.path is a string with path params, like "/user/:userId"
            // :userId is a path param
            // match.params is an object contains parsed params values
            // "/user/123" will be transformed to { userId: 123 } in match.params
            params: match.params,
            query,
          } as HatchParams;

        return undefined;
      },
    },
  });

  routeMatched.watch((match) => {
    logger.trace(match, `Route matched for "${path}"`);
  });

  forward({
    from: routeMatched,
    to: hatch.enter,
  });

  // guard({
  //   source: notMatched,
  //   filter: hatch.$opened.map(Boolean),
  //   target: hatch.exit,
  // });
}

sample({
  source: serverStarted,
  clock: $cookiesFromResponse,
  fn: ({ res }, cookies) => ({ res, cookies }),
}).watch(({ res, cookies }) => res.header('Set-Cookie', cookies));

sample({
  source: serverStarted,
  clock: $redirectTo,
  fn: ({ res }, redirectUri) => ({ res, redirectUri }),
}).watch(({ res, redirectUri }) => res.redirect(redirectUri));

let assets: any; // eslint-disable-line @typescript-eslint/no-explicit-any

function syncLoadAssets() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  assets = require(env.RAZZLE_ASSETS_MANIFEST);
}

syncLoadAssets();

function createFastify() {
  if (env.IS_DEV_ENV) {
    const CRT = path.resolve(__dirname, '..', 'tls', 'cardbox.crt');
    const KEY = path.resolve(__dirname, '..', 'tls', 'cardbox.key');

    logger.info(
      {
        Cert: CRT,
        Key: KEY,
      },
      'Creating local HTTPS server with certificate and key',
    );

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
      if ((error as any).code === 'ENOENT') {
        logger.error(
          `\n\n---------\n` +
            `ERROR! No local certificates found in ./tls directory.\n` +
            `Maybe you trying to start application without generating certificates first of all?\n` +
            'You can fix this via running `$ ./scripts/create-certs.sh`, but before read Development section in README.md',
        );
        process.exit(-1);
      }
      throw error;
    }

    return fastify({
      logger,
      http2: true,
      ...options,
    });
  }

  if (env.USE_SSL) {
    return fastify({
      https: {
        cert: fs.readFileSync(path.resolve(env.TLS_CERT_FILE)),
        key: fs.readFileSync(path.resolve(env.TLS_KEY_FILE)),
        allowHTTP1: true,
      },
      http2: true,
      logger,
    });
  }

  return fastify({
    logger,
    http2: true,
  });
}

export const fastifyInstance = createFastify();

fastifyInstance.register(fastifyHttpProxy, {
  upstream: env.BACKEND_URL,
  http2: env.BACKEND_URL.includes('https'),
  prefix: '/api/internal',
  logLevel: 'debug',
  replyOptions: {
    onError(reply, error) {
      reply.log.error('[proxy error]', error);
    },
  },
});

fastifyInstance.register(fastifyStatic, {
  root: env.RAZZLE_PUBLIC_DIR,
  wildcard: false,
});

fastifyInstance.register(fastifyCookie);

fastifyInstance.get('/*', async function (req, res) {
  this.log.info('[REQUEST] %s %s', req.method, req.url);
  res.header('Content-Type', 'text/html');
  const timeStart = performance.now();
  const scope = fork();

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

function htmlStart(props: StartProps) {
  return `<!doctype html>
  <html ${props.helmet.htmlAttributes.toString()} lang='en'>
    <head>
      ${props.helmet.base.toString()}
      ${props.helmet.meta.toString()}
      ${props.helmet.title.toString()}
      ${props.helmet.link.toString()}
      ${props.helmet.style.toString()}
      <script src='https://unpkg.com/react-render-tracker'></script>
      ${
        props.assetsCss
          ? `<link rel='stylesheet' href='${props.assetsCss}'>`
          : ''
      }
      ${
        env.IS_PROD_ENV
          ? `<script src='${props.assetsJs}' defer></script>`
          : `<script src='${props.assetsJs}' defer crossorigin></script>`
      }
    </head>
    <body ${props.helmet.bodyAttributes.toString()}>
      <div id='root'>`;
}

function htmlEnd(props: EndProps) {
  return `</div>
    <script>
      window['INITIAL_STATE'] = ${JSON.stringify(props.storesValues)}
    </script>
    ${props.helmet.script.toString()}
    ${props.helmet.noscript.toString()}
  </body>
</html>
  `;
}

function isRedirected(response: FastifyReply<Http2Server>): boolean {
  return response.statusCode >= 300 && response.statusCode < 400;
}
