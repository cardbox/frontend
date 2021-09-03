import createDebug from 'debug';
import { Domain, sample } from 'effector';
import { RouteConfig, matchRoutes } from 'react-router-config';
import { splitMap } from 'patronum';

import { HatchParams, getHatch } from './hatch';
import { createNavigation } from './navigation';
import { defaultDomain } from './default-domain';

export function createServerApplication(config: { routes: RouteConfig[]; domain?: Domain }) {
  const debug = createDebug('framework-server');
  const domain = config.domain || defaultDomain;
  const navigation = createNavigation(domain, { emitHistory: false, trackRedirects: true });

  const api = {
    failedToHandle: domain.createEvent<string>(),
  };

  api.failedToHandle.watch((failure) => {
    debug(`failedToHandle: ${failure}`);
  });

  const routeHandled = domain.createEvent<{ url: URL }>();

  const { routeResolved, __: routeNotResolved } = splitMap({
    source: routeHandled,
    cases: {
      routeResolved: ({ url }) => {
        const routes = matchRoutes(config.routes, url.pathname);
        if (routes.length > 0) return { route: routes[0].route, match: routes[0].match, url };
        return undefined;
      },
    },
  });

  sample({
    clock: routeNotResolved,
    fn: ({ url }) => `Failed to resolve path ${url.toString()}`,
    target: api.failedToHandle,
  });

  for (const { component, path } of config.routes) {
    if (!component) {
      debug(`skipping ${path}, because no component provided`);
      continue;
    }
    if ((component as any).load) {
      throw new Error(
        `[${path}] lazy components temporary is not supported. Please, remove loadable() call`,
      );
    }

    const { routeMatched, __: notMatched } = splitMap({
      source: routeResolved,
      cases: {
        routeMatched: ({ route, match, url }) => {
          if (route.path === path) {
            return {
              // route.path contains params, like /user/:userId
              // :userId is a param
              // match.params contains parsed params values
              // /user/123 will be parsed as { userId: 123 }
              params: match.params,
              query: Object.fromEntries(url.searchParams),
            };
          }
          return undefined;
        },
      },
    });
  }
}
