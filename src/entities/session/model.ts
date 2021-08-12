import {
  Event,
  Unit,
  combine,
  createEvent,
  createStore,
  forward,
  guard,
} from 'effector-root';
import type { SessionUser } from '@box/api';
// import { SessionUser, sessionGet } from '@box/api/session';
import { condition } from 'patronum/condition';
import { historyPush } from '@box/entities/navigation';
import { internalApi } from '@box/api';
import { paths } from '@box/pages/paths';

export const readyToLoadSession = createEvent();

export const sessionLoaded = createEvent();

forward({ from: readyToLoadSession, to: sessionLoaded });

// FIXME: will be replaced to session later
export const $sessionUser = createStore<SessionUser | null>(null);

// FIXME: Фетчим сессию на клиенте из-за requestClient#Headers issue
// Позже поправим после втягивания реальной авторизации
export const _sessionLoadedClient = createEvent();

forward({
  from: _sessionLoadedClient,
  to: internalApi.sessionGet.prepend(() => ({})),
});

$sessionUser.on(
  internalApi.sessionGet.doneData,
  (_, { answer }) => answer.user,
);

// export const $session = createStore<SessionUser | null>(null);
// export const $isAuthenticated = $session.map((user) => user !== null);

// // Show loading state if no session but first request is sent
// export const $sessionPending = combine(
//   [$session, sessionGet.pending],
//   ([session, pending]) => !session && pending,
// );

// /**
//  * If user not authenticated, redirect to login
//  */
// export function checkAuthenticated<T>(config: {
//   when: Unit<T>;
//   continue?: Unit<T>;
// }): Event<T> {
//   const continueLogic = config.continue ?? createEvent();
//   condition({
//     source: config.when,
//     if: $isAuthenticated,
//     then: continueLogic,
//     else: historyPush.prepend(paths.login),
//   });

//   const result = createEvent<T>();
//   forward({
//     from: continueLogic,
//     to: result,
//   });
//   return result;
// }

// /**
//  * If user **anonymous**, continue, else redirect to home
//  */
// export function checkAnonymous<T>(config: {
//   when: Unit<T>;
//   continue?: Unit<T>;
// }): Event<T> {
//   const continueLogic = config.continue ?? createEvent();
//   condition({
//     source: config.when,
//     if: $isAuthenticated,
//     then: historyPush.prepend(paths.home),
//     else: continueLogic,
//   });

//   const result = createEvent<T>();
//   forward({
//     from: continueLogic,
//     to: result,
//   });
//   return result;
// }

// $session
//   .on(sessionGet.done, (_, { result }) => result.body.user)
//   .on(sessionGet.failData, (session, { status }) => {
//     if (status === 401) {
//       return null;
//     }
//     return session;
//   });

// guard({
//   source: readyToLoadSession,
//   filter: $sessionPending.map((is) => !is),
//   target: sessionGet,
// });
