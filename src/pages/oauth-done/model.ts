import { attach, createStore, sample } from 'effector';

import { historyPush } from '@box/entities/navigation';
import { $session } from '@box/entities/session';

import { internalApi } from '@box/shared/api';
import { routes } from '@box/shared/routes';

const DEFAULT_REDIRECT_STATE = '/';

const currentRoute = routes.accesso.done;

const authDoneFx = attach({ effect: internalApi.authDone });
const $redirectBackState = createStore<string>(DEFAULT_REDIRECT_STATE);

sample({
  clock: currentRoute.opened,
  fn: ({ query }) => ({ body: { authorizationCode: query.code } }),
  target: authDoneFx,
});

$redirectBackState.on(currentRoute.opened, (_, { query }) => query.state || DEFAULT_REDIRECT_STATE);

sample({
  clock: authDoneFx.doneData,
  fn: ({ answer: { user } }) => ({
    avatar: user.avatar,
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  }),
  target: $session,
});

sample({
  source: $redirectBackState,
  clock: authDoneFx.doneData,
  target: historyPush,
  fn: (redirectBackState) => redirectBackState,
});
