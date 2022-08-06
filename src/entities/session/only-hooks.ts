import { chainRoute, RouteInstance, RouteParamsAndQuery } from 'atomic-router';
import { createEvent, Effect, Event, guard, sample, Store } from 'effector';
import { not } from 'patronum';

import { $isAuthenticated } from '@box/entities/session/model';

export function filterAuthenticated<T>(
  source: Event<T> | Store<T> | Effect<T, any, any>,
): Event<T> {
  const target = createEvent<T>();

  guard({
    source,
    filter: $isAuthenticated,
    target,
  });

  return target;
}

export function filterAnonymous<T>(source: Event<T> | Store<T> | Effect<T, any, any>): Event<T> {
  const target = createEvent<T>();

  guard({
    source,
    filter: $isAuthenticated.map((is) => !is),
    target,
  });

  return target;
}

export function filterOnly<T>(config: {
  when: 'anonymous' | 'authenticated';
  clock: Event<T> | Store<T> | Effect<T, any, any>;
}): Event<T> {
  if (config.when === 'anonymous') return filterAnonymous(config.clock);

  return filterAuthenticated(config.clock);
}

/**
 * Clones the passed route and opens it only if user is authenticated
 * @param route Original route
 * @returns New route
 */
export function chainAuthenticated<Params>(route: RouteInstance<Params>) {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();

  const alreadyAuthorized = sample({
    clock: sessionCheckStarted,
    filter: $isAuthenticated,
  });

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: alreadyAuthorized,
  });
}

/**
 * Clones the passed route and opens it only if user is anonymous
 * @param route Original route
 * @returns New route
 */
export function chainAnonymous<Params>(route: RouteInstance<Params>) {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();

  const alreadyAnonymous = sample({
    clock: sessionCheckStarted,
    filter: not($isAuthenticated),
  });

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: alreadyAnonymous,
  });
}
