import { StartParams } from '@box/lib/page-routing';
import { attach, createEvent, forward, restore } from 'effector-root';
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

forward({
  from: pageLoaded,
  to: usersGetFx,
});

// FIXME: simplify, resolve before first render?
forward({
  from: usersGetFx.doneData,
  to: internalApi.cardsList.prepend(({ answer }) => ({
    body: { authorId: answer.user.id },
  })),
});
