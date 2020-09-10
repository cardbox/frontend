import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import cookieParser from 'cookie-parser';
import express from 'express';
import {
  $cookiesForRequest,
  $cookiesFromResponse,
  setCookiesForRequest,
} from 'api/request';
import { $lastPushed } from 'features/navigation';
import { Event, forward, root, sample } from 'effector-root';
import { MatchedRoute, matchRoutes } from 'react-router-config';
import { ServerStyleSheet } from 'styled-components';
import { StartParams, getStart } from 'lib/page-routing';
import { StaticRouter } from 'react-router-dom';
import { allSettled, fork, serialize } from 'effector/fork';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { performance } from 'perf_hooks';
import { readyToLoadSession, sessionLoaded } from 'features/session';

import { Application } from './application';
import { ROUTES } from './pages/routes';

const serverStarted = root.createEvent<{
  req: express.Request;
  res: express.Response;
}>();

const requestHandled = serverStarted.map(({ req }) => req);

const cookiesReceived = requestHandled.filterMap((r) => r.headers.cookie);

const routesMatched = requestHandled.map((request) => ({
  routes: matchRoutes(ROUTES, request.path).filter(lookupStartEvent),
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
}).watch(({ res, cookies }) => res.setHeader('Set-Cookie', cookies));

sample({
  source: serverStarted,
  clock: $lastPushed,
  fn: ({ res }, redirectUri) => ({ res, redirectUri }),
}).watch(({ res, redirectUri }) => res.redirect(redirectUri));

let assets: any; // eslint-disable-line @typescript-eslint/no-explicit-any

const syncLoadAssets = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

export const server = express()
  .disable('x-powered-by')
  .use(
    '/api',
    createProxyMiddleware({
      target: process.env.SERVER_BACKEND_URL ?? 'http://localhost:9008',
      pathRewrite: {
        '^/api': '',
      },
      secure: false,
    }),
  )
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .use(cookieParser())
  .get('/*', async (request: express.Request, response: express.Response) => {
    console.info('[REQUEST] %s %s', request.method, request.url);
    const timeStart = performance.now();
    const scope = fork(root);

    try {
      await allSettled(serverStarted, {
        scope,
        params: { req: request, res: response },
      });
    } catch (error) {
      console.error(error);
    }

    const context = {};
    const sheet = new ServerStyleSheet();

    const jsx = sheet.collectStyles(
      <StaticRouter context={context} location={request.url}>
        <Application root={scope} />
      </StaticRouter>,
    );

    if (isRedirected(response)) {
      cleanUp();
      console.info(
        '[REDIRECT] from %s to %s at %sms',
        request.url,
        response.get('Location'),
        (performance.now() - timeStart).toFixed(2),
      );
      return;
    }

    const stream = sheet.interleaveWithNodeStream(
      ReactDOMServer.renderToNodeStream(jsx),
    );
    const storesValues = serialize(scope, {
      ignore: [$cookiesForRequest, $cookiesFromResponse],
      onlyChanges: true,
    });

    response.write(htmlStart(assets.client.css, assets.client.js));
    stream.pipe(response, { end: false });
    stream.on('end', () => {
      response.end(htmlEnd(storesValues));
      cleanUp();
      console.info(
        '[PERF] sent page at %sms',
        (performance.now() - timeStart).toFixed(2),
      );
    });

    function cleanUp() {
      sheet.seal();
    }
  });

function htmlStart(assetsCss: string, assetsJs: string) {
  return `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Cardbox</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${assetsCss ? `<link rel="stylesheet" href="${assetsCss}">` : ''}
          ${
            process.env.NODE_ENV === 'production'
              ? `<script src="${assetsJs}" defer></script>`
              : `<script src="${assetsJs}" defer crossorigin></script>`
          }
    </head>
    <body>
        <div id="root">`;
}

function htmlEnd(storesValues: Record<string, unknown>): string {
  return `</div>
        <script>
          window.INITIAL_STATE = ${JSON.stringify(storesValues)}
        </script>
    </body>
</html>`;
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

function isRedirected(response: express.Response): boolean {
  return response.statusCode >= 300 && response.statusCode < 400;
}
