import { attach, createEffect, createEvent, forward, sample } from 'effector';
import { not } from 'patronum';

import { internalApi } from '@box/shared/api';

const sessionDeleteFx = attach({ effect: internalApi.sessionDelete });

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
