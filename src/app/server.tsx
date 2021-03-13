import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import cookieParser from 'cookie-parser';
import express from 'express';
import through from 'through';
import {
  $cookiesForRequest,
  $cookiesFromResponse,
  setCookiesForRequest,
} from '@cardbox/api/request';
import { $lastPushed } from '@cardbox/entities/navigation';
import { Event, forward, root, sample } from 'effector-root';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { MatchedRoute, matchRoutes } from 'react-router-config';
import { ROUTES } from '@cardbox/pages/routes';
import { ServerStyleSheet } from 'styled-components';
import { StartParams, getStart } from '@cardbox/lib/page-routing';
import { StaticRouter } from 'react-router-dom';
import { allSettled, fork, serialize } from 'effector/fork';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { localeLoadFromHeader } from '@cardbox/entities/i18n';
import { performance } from 'perf_hooks';
import { readyToLoadSession, sessionLoaded } from '@cardbox/entities/session';

import { Application } from './application';

const serverStarted = root.createEvent<{
  req: express.Request;
  res: express.Response;
}>();

const requestHandled = serverStarted.map(({ req }) => req);

const cookiesReceived = requestHandled.filterMap((r) => r.headers.cookie);
const acceptLanguageReceived = requestHandled.map((r) => r.headers['accept-language'] ?? '');

forward({ from: acceptLanguageReceived, to: localeLoadFromHeader });

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
    const matchedRoute = sample(routesMatched, sessionLoaded).filterMap(({ routes, query }) => {
      const route = routes.find(routeWithEvent(startPageEvent));
      if (route) return { route, query };
      return undefined; // `undefined` skips update in `filterMap`
    });

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

function syncLoadAssets() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
}

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

    const storesValues = serialize(scope, {
      ignore: [$cookiesForRequest, $cookiesFromResponse],
      onlyChanges: true,
    });

    const routerContext = {};
    const sheet = new ServerStyleSheet();
    const helmetContext: FilledContext = {} as FilledContext;

    const jsx = sheet.collectStyles(
      <HelmetProvider context={helmetContext}>
        <StaticRouter context={routerContext} location={request.url}>
          <Application root={scope} />
        </StaticRouter>
      </HelmetProvider>,
    );

    if (isRedirected(response)) {
      cleanUp();
      console.info(
        '[REDIRECT] from %s to %s at %sms',
        request.url,
        response.get('Location'),
        (performance.now() - timeStart).toFixed(2),
      );
      response.end();
      return;
    }

    let sent = false;

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

    stream.pipe(response, { end: false });
    stream.on('end', () => {
      response.end();
      cleanUp();
      console.info('[PERF] sent page at %sms', (performance.now() - timeStart).toFixed(2));
    });

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
    <html ${p.helmet.htmlAttributes.toString()}>
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
          window.INITIAL_STATE = ${JSON.stringify(p.storesValues)}
        </script>
        ${p.helmet.script.toString()}
        ${p.helmet.noscript.toString()}
    </body>
</html>
  `;
}

function lookupStartEvent<P>(match: MatchedRoute<P>): Event<StartParams> | undefined {
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
