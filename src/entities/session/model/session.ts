import { combine, createEvent, createStore, sample, Store } from 'effector';
import { and, equals, not } from 'patronum';

import type { SessionUser } from '@box/shared/api';
import { internalApi } from '@box/shared/api';
import { $cookiesForRequests } from '@box/shared/api/request';

export const readyToLoadSession = createEvent<void>();

export const $session = createStore<SessionUser | null>(null);
export const $isAuthenticated = $session.map((user) => user !== null);
const $isCookiesEmpty = equals(trim($cookiesForRequests), '');

// Show loading state if no session but first request is sent
export const $sessionPending = combine(
  [$session, internalApi.sessionGet.pending],
  ([session, pending]) => !session && pending,
);

sample({
  clock: readyToLoadSession,
  filter: and(not($sessionPending), not($isCookiesEmpty)),
  fn: () => ({}),
  target: internalApi.sessionGet,
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

function trim(source: Store<string>): Store<string> {
  return source.map((string) => string.trim());
}
