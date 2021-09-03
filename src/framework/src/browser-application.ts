import { Domain, Event, combine, forward, guard } from 'effector';
import { RouteConfig, matchRoutes } from 'react-router-config';
import { splitMap } from 'patronum';

import { HatchParams, getHatch } from './hatch';
import { createNavigation } from './navigation';
import { defaultDomain } from './default-domain';

// eslint-disable-next-line sonarjs/cognitive-complexity
export function createBrowserApplication(config: {
  ready: Event<void>;
  routes: RouteConfig[];
  domain?: Domain;
}) {
  const domain = config.domain || defaultDomain;
  const navigation = createNavigation(domain, { emitHistory: true });
  forward({ from: config.ready, to: navigation.historyEmitCurrent });

  const routeResolved = navigation.historyChanged.filterMap((change) => {
    const routes = matchRoutes(config.routes, change.pathname);

    if (routes.length > 0) {
      return {
        ...routes[0],
        change,
      };
    }
    return undefined
  });

  for (const { component, path } of config.routes) {
    if (!component) continue;
    if ((component as any).load) {
      throw new Error(
        `[${path}] lazy components temporary is not supported. Please, remove loadable() call`,
      );
    }

    const { routeMatched, __: notMatched } = splitMap({
      source: routeResolved,
      cases: {
        routeMatched: ({ route, match, change }) => {
          if (route.path === path) {
            return {
              // route.path contains params, like /user/:userId
              // :userId is a param
              // match.params contains parsed params values
              // /user/123 will be parsed as { userId: 123 }
              params: match.params,
              query: Object.fromEntries(new URLSearchParams(change.search)),
            };
          }
          return undefined;
        },
      },
    });

    const hatchEnter = domain.createEvent<HatchParams>({ name: `hatchEnter:${path}` });
    const hatchUpdate = domain.createEvent<HatchParams>({ name: `hatchUpdate:${path}` });
    const hatchExit = domain.createEvent<void>({ name: `hatchExit:${path}` });

    // Triggered when hatch is used from the main bundle
    const dontNeedLoadChunk = domain.createEvent({ name: `dontNeedLoadChunk:${path}` });

    const $chunkLoaded = domain.createStore(false, { name: `$chunkLoaded:${path}` });
    const $hasHatch = domain.createStore(getHatch(component) !== undefined, {
      name: `$hasHatch:${path}`,
    });

    const loadPageFx = domain.createEffect({
      name: `loadPageFx:${path}`,
      handler: async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const loader = (component as any).load;
        if (typeof loader === 'function') {
          const module = await loader();
          if (!module.default) {
            console.info(`Not found default export for "${path}" route`);
            return null;
          }
          // eslint-disable-next-line @typescript-eslint/ban-types
          return module.default as {};
        }
        return component;
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setupHatchLinksFx = domain.createEffect({
      name: `setupHatchLinksFx:${path}`,
      handler: (page: any) => {
        const hatch = getHatch(page);
        if (hatch) {
          forward({ from: hatchEnter, to: hatch.enter });
          forward({ from: hatchUpdate, to: hatch.update });
          forward({ from: hatchExit, to: hatch.exit });
          // Refork here?
          // Because computations still in the old scope, we can't switch to a new scope where page's events already forked
          // We need effector v22
          // https://share.effector.dev/HEXzaOU0
          return true;
        }
        return false;
      },
    });

    // Shows that user is on the route
    const $onRoute = domain
      .createStore(false, { name: `$onRoute:${path}` })
      .on(routeMatched, () => true)
      .on(notMatched, () => false);

    // Shows that user visited route and wait for page
    // If true, page.hatch.enter is triggered and logic is ran
    const $onPage = domain
      .createStore(false, { name: `$onPage:${path}` })
      .on(hatchEnter, () => true)
      .on(hatchExit, () => false);

    $chunkLoaded.on(loadPageFx.done, () => true).on(dontNeedLoadChunk, () => true);
    $hasHatch.on(setupHatchLinksFx.doneData, (_, has) => has);

    // When hatch not found on component from route and chunk don't load before
    guard({
      source: routeMatched,
      filter: combine(
        $hasHatch,
        $chunkLoaded,
        (hasHatch, chunkLoaded) => !hasHatch && !chunkLoaded,
      ),
      target: loadPageFx,
    });

    // After loading page chunk check that it has Page and try to connect with local events
    guard({
      source: loadPageFx.doneData,
      filter: (value) => value !== null,
      target: setupHatchLinksFx,
    });

    loadPageFx.failData.watch((error) => {
      console.error(`Failed to load page for ${path}`, error);
    });

    setupHatchLinksFx.failData.watch((error) => {
      console.error(`Failed to setup hatch links for ${path}`, error);
    });

    // Hatch found on component from route, but chunk never loaded
    // We need to setup connections between hatch from component and local triggers
    guard({
      source: routeMatched,
      filter: combine($hasHatch, $chunkLoaded, (hasHatch, chunkLoaded) => hasHatch && !chunkLoaded),
      target: [setupHatchLinksFx.prepend(() => component), dontNeedLoadChunk],
    });

    // Trigger local unit only after loading chunk and setup connections
    // Set onPage = true
    guard({
      source: routeMatched,
      clock: setupHatchLinksFx.doneData,
      filter: $onRoute,
      target: hatchEnter,
    });

    guard({
      source: routeMatched,
      filter: $onPage,
      target: hatchUpdate,
    });

    // onPage = false should set only after exit logic is run
    guard({
      source: notMatched,
      filter: $onPage,
      target: hatchExit,
    });
  }

  return { navigation };
}
