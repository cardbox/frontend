import { $session } from '@box/entities/session';
import { attach, createDomain, sample } from 'effector';
import { createHatch } from 'framework';
import { historyPush } from '@box/entities/navigation';
import { internalApi } from '@box/shared/api';

import { paths } from '../paths';

export const hatch = createHatch(createDomain('OAuthDonePage'));

const authDoneFx = attach({ effect: internalApi.authDone });

sample({
  clock: hatch.enter,
  fn: ({ query }) => ({ body: { authorizationCode: query.code } }),
  target: authDoneFx,
});

sample({
  clock: authDoneFx.doneData,
  fn: ({ answer: { user } }) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  }),
  target: $session,
});

sample({
  source: authDoneFx.doneData,
  target: historyPush.prepend(paths.home),
});
