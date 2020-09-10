import { attach } from 'effector-root';

import { requestFx } from './request';

export const authUrlFx = attach({
  effect: requestFx,
  mapParams: (body: { state: string }) => ({
    path: '/accesso/auth_url',
    method: 'POST',
    body,
  }),
});
