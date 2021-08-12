import { StartParams } from '@box/lib/page-routing';
import { attach, createEvent, restore, sample } from 'effector-root';
import { internalApi } from '@box/api';

export const pageLoaded = createEvent<StartParams>();
export const usersGetFx = attach({
  effect: internalApi.usersGet,
  mapParams: (res: StartParams) => {
    return {
      body: {
        username: res.params.username,
      },
    };
  },
});

export const $pagePending = restore(usersGetFx.pending.updates, true);

sample({
  source: pageLoaded,
  target: usersGetFx,
});

// FIXME: simplify, resolve before first render?
sample({
  source: usersGetFx.doneData,
  fn: ({ answer }) => ({
    body: { authorId: answer.user.id },
  }),
  target: internalApi.cardsList,
});
