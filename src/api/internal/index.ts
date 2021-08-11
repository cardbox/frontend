import { createEffect } from 'effector-root';

import { cardsList } from './index.gen';

// FIXME: replace to real-API impl
export const cardsFeedFx = createEffect(async () => {
  const response = await cardsList({ body: {} });
  return response;
});

export * from './index.gen';
