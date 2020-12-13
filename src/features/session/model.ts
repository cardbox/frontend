import {
  Event,
  Unit,
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  guard,
} from 'effector-root';
import { authFinishFx, authUrlFx } from 'api/accesso';
// import { SessionUser, sessionGet } from 'api/session';
import { condition } from 'patronum/condition';
import { historyPush } from 'features/navigation';
import { paths } from 'pages/paths';
import { pending } from 'patronum/pending';

interface UserInfo {
  firstName: string;
  lastName: string;
}

/** Called on server when it ready to load */
export const readyToLoadSession = createEvent<void>();

/** Called when session already loaded and you go next */
export const sessionLoaded = createEvent();

/**
 * First step: Redirect to Accesso oauth authorize
 */
export const authorizeFx = createEffect(async () => {
  const { accessoUrl } = await authUrlFx({ state: getLocationState() });
  document.location = (accessoUrl as any) as Location;
});

/**
 * Second step: exchange authorization token to session token in cookies and user info
 */
export const authorizeFinishFx = createEffect((payload: { code: string }) =>
  authFinishFx({ authorizationCode: payload.code }),
);

export const $session = createStore<UserInfo | null>(null);
export const $isAuthenticated = $session.map((user) => user !== null);

forward({ from: readyToLoadSession, to: sessionLoaded });

$session.on(authorizeFinishFx.doneData, (_, { userInfo }) => userInfo);

export const $sessionPending = pending({
  effects: [authorizeFx, authorizeFinishFx],
});

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

function getLocationState(): string {
  return [
    document.location.pathname,
    document.location.search,
    document.location.hash,
  ].join('');
}
