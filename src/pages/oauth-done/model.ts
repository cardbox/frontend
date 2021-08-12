import { $session } from '@box/entities/session';
import { createStart } from '@box/lib/page-routing';
import { historyPush } from '@box/entities/navigation';
import { internalApi } from '@box/api';
import { sample } from 'effector';

import { paths } from '../paths';

export const pageStart = createStart();

sample({
  source: pageStart,
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
      firstName: source.answer.user.firstName,
      lastName: source.answer.user.lastName,
    };
  },
});

sample({
  source: internalApi.authDone.doneData,
  target: historyPush.prepend(paths.home),
});
