import { createEffect, createEvent, forward, sample } from 'effector';
import { not } from 'patronum';

import { sessionDeleteFx } from '@box/entities/session/model/login';

import { internalApi } from '@box/shared/api';

export const forceLogout = createEvent<void>();

const reloadFx = createEffect<void, void, any>({
  handler() {
    document.location = '';
  },
});

sample({
  clock: forceLogout,
  filter: not(sessionDeleteFx.pending),
  fn: (_) => ({ body: { deleteAllSessions: true } }),
  target: sessionDeleteFx,
});

forward({
  from: internalApi.sessionDelete.done,
  to: reloadFx,
});
