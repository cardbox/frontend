import {
  Event,
  Unit,
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  guard,
  sample,
} from 'effector';
import { SessionUser } from '@box/api';
import { condition } from 'patronum';
import { historyPush } from '@box/entities/navigation';
import { paths } from '@box/pages/paths';

export interface SessionGetDone {
  answer: {
    user: SessionUser | null,
  },
}

export interface SessionDeleteDone {
  answer: {
    user: SessionUser | null,
  },
}

export interface Fail {
  status: string,
}

const sessionGet = createEffect<void, SessionGetDone, Fail>({
  handler: () => {
    return {
      answer: {
        user: null
      },
    };
  },
});
const sessionDelete = createEffect<void, SessionDeleteDone, Fail>({
  handler: () => {
    return {
      answer: {
        user: null
      },
    };
  },
});

export const readyToLoadSession = createEvent<void>();

export const sessionLoaded = sessionGet.finally;

export const $session = createStore<SessionUser | null>(null);

export const $isAuthenticated = $session.map((user) => user !== null);

// Show loading state if no session but first request is sent
export const $sessionPending = combine(
  [$session, sessionGet.pending],
  ([session, pending]) => !session && pending,
);

const sessionWaitFx = createEffect<void,
  SessionGetDone,
  Fail>({
  async handler() {
    // Here is pivot: sessionWaitFx was emitter before this point and events wait for it to resolve
    // but now sessionWaitFx effect became subscriber(watcher) itself
    return new Promise((resolve, reject) => {
      const watcher = sessionGet.finally.watch((response) => {
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
  .on(sessionGet.doneData, (_, { answer }) => answer.user)
  .on(sessionGet.failData, (session, { status }) => {
    if (status === 'unauthorized') {
      return null;
    }
    return session;
  })
  .on(sessionDelete.done, () => null);

guard({
  source: readyToLoadSession,
  filter: $sessionPending.map((is) => !is),
  target: sessionGet.prepend(() => ({})),
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

  guard({
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
export function checkAnonymous<T>(config: {
  when: Unit<T>;
  continue?: Unit<T>;
}): Event<T> {
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

  guard({
    source: authenticatedCheck,
    filter: $isAuthenticated,
    target: historyPush.prepend(paths.home),
  });

  // Used as guard event
  const continueTrigger = createEvent();
  sample({
    source: config.when,
    target: continueLogic,
    clock: continueTrigger,
  });

  condition({
    source: sessionWaitFx.finally,
    if: $isAuthenticated,
    then: historyPush.prepend(paths.home),
    else: continueTrigger,
  });

  const result = createEvent<T>();
  forward({
    from: continueLogic,
    to: result,
  });
  return result;
}

function noop(): void {
}
