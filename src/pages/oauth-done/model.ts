import { $session } from '@box/entities/session';
import { createHatch } from 'framework';
import { historyPush } from '@box/entities/navigation';
import { internalApi } from '@box/api';
import { root, sample } from 'effector-root';

import { paths } from '../paths';

export const hatch = createHatch(root.createDomain('OAuthDonePage'));

sample({
  source: hatch.enter,
  target: internalApi.authDone,
  fn: (source) => {
    return {
      body: {
        authorizationCode: source.query.code,
      },
    };
  },
});

sample({
  source: internalApi.authDone.doneData,
  target: $session,
  fn: (source) => {
    return {
      id: source.answer.user.id,
      firstName: source.answer.user.firstName,
      lastName: source.answer.user.lastName,
    };
  },
});

sample({
  source: internalApi.authDone.doneData,
  target: historyPush.prepend(paths.home),
});
