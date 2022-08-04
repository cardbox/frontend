import {
  combine,
  createEffect,
  createEvent,
  createStore,
  Event,
  forward,
  sample,
  Store,
  Unit,
} from 'effector';
import { and, condition, equals, not } from 'patronum';

import type { SessionUser } from '@box/shared/api';
import { internalApi } from '@box/shared/api';
import { $cookiesForRequest } from '@box/shared/api/request';
import { routes } from '@box/shared/routes';

export const readyToLoadSession = createEvent<void>();

export const sessionLoaded = createEvent<void>();

export const $session = createStore<SessionUser | null>(null);

export const $isAuthenticated = $session.map((user) => user !== null);

// Show loading state if no session but first request is sent
export const $sessionPending = combine(
  [$session, internalApi.sessionGet.pending],
  ([session, pending]) => !session && pending,
);

const sessionWaitFx = createEffect<void, internalApi.SessionGetDone, internalApi.SessionGetFail>({
  async handler() {
    // Here is pivot: sessionWaitFx was emitter before this point and events wait for it to resolve
    // but now sessionWaitFx effect became subscriber(watcher) itself
    return new Promise((resolve, reject) => {
      const watcher = internalApi.sessionGet.finally.watch((response) => {
        if (response.status === 'done') {
          watcher();
          resolve(response.result);
          return;
        }
        reject(response.error);
      });
    });
  },
});

$session
  .on(internalApi.sessionGet.doneData, (_, { answer }) => answer.user)
  .on(internalApi.sessionGet.failData, (session, { status }) => {
    if (status === 'unauthorized') {
      return null;
    }
    return session;
  })
  .on(internalApi.sessionDelete.done, () => null);

const $cookiesEmpty = equals(trim($cookiesForRequest), '');

sample({
  clock: readyToLoadSession,
  filter: and(not($sessionPending), not($cookiesEmpty)),
  target: internalApi.sessionGet.prepend(() => ({})),
});

sample({
  clock: internalApi.sessionGet.finally,
  target: sessionLoaded,
});

sample({
  clock: readyToLoadSession,
  filter: $cookiesEmpty,
  target: sessionLoaded,
});

export function checkAuthenticated<T>(config: {
  when: Unit<T>;
  continue?: Unit<T>;
  stop?: Event<unknown>;
}): Event<T> {
  const continueLogic = config.continue ?? createEvent();
  const stopLogic = config.stop ?? createEvent();

  // Synthetic event just to get store value
  const sessionPendingCheck = createEvent<boolean>();
  const authenticatedCheck = createEvent<boolean>();

  sample({
    source: $sessionPending,
    clock: config.when,
    target: sessionPendingCheck,
  });

  condition({
    source: sessionPendingCheck,
    if: (session) => session,
    then: sessionWaitFx,
    else: authenticatedCheck,
  });

  sample({
    source: authenticatedCheck,
    filter: $isAuthenticated.map((is) => !is),
    target: stopLogic.prepend(noop),
  });

  // Used as guard event
  const continueTrigger = createEvent();
  condition({
    source: sessionWaitFx.finally,
    if: $isAuthenticated,
    then: continueTrigger,
    else: stopLogic.prepend(noop),
  });

  sample({
    source: config.when,
    target: continueLogic,
    clock: continueTrigger,
  });

  const result = createEvent<T>();
  forward({
    from: continueLogic,
    to: result,
  });
  return result;
}

/**
 * If user **anonymous**, continue, else redirect to home
 */
export function checkAnonymous<T>(config: { when: Unit<T>; continue?: Unit<T> }): Event<T> {
  const continueLogic = config.continue ?? createEvent<T>();

  // Synthetic event just to get store value
  const sessionPendingCheck = createEvent<boolean>();
  const authenticatedCheck = createEvent<boolean>();

  sample({
    source: $sessionPending,
    clock: config.when,
    target: sessionPendingCheck,
  });

  condition({
    source: sessionPendingCheck,
    if: (session) => session,
    then: sessionWaitFx,
    else: authenticatedCheck,
  });

  sample({
    source: authenticatedCheck,
    filter: $isAuthenticated,
    target: routes.home.open,
  });

  // Used as sample event
  const continueTrigger = createEvent();
  sample({
    source: config.when,
    target: continueLogic,
    clock: continueTrigger,
  });

  condition({
    source: sessionWaitFx.finally,
    if: $isAuthenticated,
    then: routes.home.open.prepend(() => ({})),
    else: continueTrigger,
  });

  const result = createEvent<T>();
  forward({
    from: continueLogic,
    to: result,
  });
  return result;
}

function noop(): void {}

function trim(source: Store<string>): Store<string> {
  return source.map((string) => string.trim());
}
