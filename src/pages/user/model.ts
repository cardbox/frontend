import { StartParams } from '@box/lib/page-routing';
import { attach, combine, createEvent, restore, sample } from 'effector-root';
import { internalApi } from '@box/api';

export const pageLoaded = createEvent<StartParams>();
export const usersGetFx = attach({
  effect: internalApi.usersGet,
});
export const cardsListFx = attach({
  effect: internalApi.cardsList,
});

export const $userPending = restore(usersGetFx.pending.updates, true);
export const $cardsPending = restore(cardsListFx.pending.updates, true);

// FIXME: Позже скорее всего разобъем SkeletonLayout
// Но пока пусть вся страница будет дожидаться полного резолва эффектов
export const $pagePending = combine(
  $userPending,
  $cardsPending,
  (users, cards) => users || cards,
);

sample({
  source: pageLoaded,
  fn: ({ params }) => ({
    body: {
      username: params.username,
    },
  }),
  target: usersGetFx,
});

// FIXME: simplify, resolve before first render?
sample({
  source: usersGetFx.doneData,
  fn: ({ answer }) => ({
    body: { authorId: answer.user.id },
  }),
  target: cardsListFx,
});
