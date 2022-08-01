import { attach, createDomain, createStore, sample } from 'effector';
import { createHatch } from 'framework';

import { historyPush } from '@box/entities/navigation';
import { $session } from '@box/entities/session';

import { internalApi } from '@box/shared/api';

const DEFAULT_REDIRECT_STATE = '/';

export const hatch = createHatch(createDomain('OAuthDonePage'));

const authDoneFx = attach({ effect: internalApi.authDone });
const redirectBackState$ = createStore<string>(DEFAULT_REDIRECT_STATE);

sample({
  clock: hatch.enter,
  fn: ({ query }) => ({ body: { authorizationCode: query.code } }),
  target: authDoneFx,
});

redirectBackState$.on(hatch.enter, (_, { query }) => query.state || DEFAULT_REDIRECT_STATE);

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
  source: redirectBackState$,
  clock: authDoneFx.doneData,
  target: historyPush,
  fn: (redirectBackState) => redirectBackState,
});
