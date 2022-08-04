import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import fastifyCookie from '@fastify/cookie';
import fastifyHttpProxy from '@fastify/http-proxy';
import fastifyStatic from '@fastify/static';
import { createHistoryRouter } from 'atomic-router';
import { RouterProvider } from 'atomic-router-react';
import { allSettled, createEvent, fork, sample, serialize } from 'effector';
import { Provider } from 'effector-react/scope';
import type { FastifyReply, FastifyRequest } from 'fastify';
import fastify, { FastifyInstance } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import type { Server } from 'http';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { ServerStyleSheet } from 'styled-components';
import through from 'through';

import { notFoundRoute, routesMap } from '@box/pages';

import { $redirectTo, createServerHistory } from '@box/entities/navigation';
import { OpenGraphTags } from '@box/entities/opengraph';
import { readyToLoadSession } from '@box/entities/session';

import { $cookiesFromResponse, setCookiesForRequests } from '@box/shared/api/request';
import { env } from '@box/shared/config';
import { logger } from '@box/shared/lib/logger';
import { measurement } from '@box/shared/lib/measure';

import { Application } from './application';

let assets: any; // eslint-disable-line @typescript-eslint/no-explicit-any
function syncLoadAssets() {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
}
syncLoadAssets();

const serverStarted = createEvent<{
  req: FastifyRequest<RouteGenericInterface, Server>;
  res: FastifyReply<Server>;
}>();
const requestHandled = serverStarted.map(({ req }) => req);
const cookiesReceived = requestHandled.filterMap((r) => r.headers.cookie);

sample({ clock: cookiesReceived, target: setCookiesForRequests });
sample({ clock: serverStarted, target: readyToLoadSession });

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

const PUBLIC_URL = process.env.PUBLIC_URL;

function createFastify(): FastifyInstance {
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
      ...options,
    });
  }

  if (env.USE_SSL) {
    return fastify({
      https: {
        cert: fs.readFileSync(path.resolve(env.TLS_CERT_FILE)),
        key: fs.readFileSync(path.resolve(env.TLS_KEY_FILE)),
      },
      logger,
    });
  }

  return fastify({
    logger,
  });
}

export const fastifyInstance = createFastify();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
fastifyInstance.register(fastifyHttpProxy, {
  upstream: env.BACKEND_URL,
  prefix: '/api/internal',
  logLevel: 'debug',
  replyOptions: {
    onError(reply, error) {
      reply.log.error('[proxy error]', error);
    },
  },
  undici: false,
});

fastifyInstance.register(fastifyStatic, {
  root: path.resolve(env.RAZZLE_PUBLIC_DIR),
  wildcard: false,
});

fastifyInstance.register(fastifyCookie);

fastifyInstance.get('/*', async function (req, res) {
  const log = this.log;
  log.info('[REQUEST] %s %s', req.method, req.url);
  const pageContructionTime = measurement('page construction', log.info.bind(log));
  const scope = fork();

  const authorization = measurement('authorization', log.info.bind(log));
  await allSettled(serverStarted, {
    scope,
    params: { req, res },
  });
  authorization.measure();

  const routingLogic = measurement('routing logic', log.info.bind(log));
  const router = createHistoryRouter({
    routes: routesMap,
    notFoundRoute,
  });
  await allSettled(router.setHistory, {
    scope,
    params: createServerHistory(),
  });
  routingLogic.measure();

  const serializeTime = measurement('serialize scope', log.info.bind(log));
  const storesValues = serialize(scope);
  serializeTime.measure();

  const sheet = new ServerStyleSheet();
  const helmetContext: FilledContext = {} as FilledContext;

  const basePath = PUBLIC_URL ?? `${req.protocol}://${req.hostname}`;

  const collectStylesTime = measurement('sheet collects styles', log.info.bind(log));
  const jsx = sheet.collectStyles(
    <HelmetProvider context={helmetContext}>
      <RouterProvider router={router}>
        <Provider value={scope}>
          <OpenGraphTags basePath={basePath} />
          <Application />
        </Provider>
      </RouterProvider>
    </HelmetProvider>,
  );
  collectStylesTime.measure();

  if (isRedirected(res)) {
    cleanUp();
    pageContructionTime.measure(
      log.info,
      `REDIRECT from ${req.url} to ${res.getHeader('Location')}`,
    );
    res.send();
    return;
  }

  res.header('Content-Type', 'text/html');

  let sent = false;

  const renderTime = measurement('react dom server render to stream', log.info.bind(log));

  const stream = sheet.interleaveWithNodeStream(ReactDOMServer.renderToNodeStream(jsx)).pipe(
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
        renderTime.measure();
        pageContructionTime.measure();
      },
    ),
  );

  res.send(stream);
  cleanUp();

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
      ${props.assetsCss ? `<link rel='stylesheet' href='${props.assetsCss}'>` : ''}
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
    ${
      process.env.STATUSPAGE_ID
        ? `<script src='https://${process.env.STATUSPAGE_ID}.statuspage.io/embed/script.js'></script>`
        : ''
    }
  </body>
</html>
  `;
}

function isRedirected(response: FastifyReply<Server>): boolean {
  return response.statusCode >= 300 && response.statusCode < 400;
}
