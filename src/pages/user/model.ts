import { attach, combine, restore, root, sample } from 'effector-root';
import { cardModel } from '@box/entities/card';
import { createHatch } from 'framework';
import { internalApi } from '@box/api';
import { userModel } from '@box/entities/user';

export const hatch = createHatch(root.createDomain('UserViewPage'));

export const usersGetFx = attach({ effect: internalApi.usersGet });
export const cardsListFx = attach({ effect: internalApi.cardsList });

export const $userPending = restore(usersGetFx.pending.updates, true);
export const $cardsPending = restore(cardsListFx.pending.updates, true);
export const $currentUser = userModel.$currentUser;
export const $cards = cardModel.$cards;

// FIXME: Позже скорее всего разобъем SkeletonLayout
// Но пока пусть вся страница будет дожидаться полного резолва эффектов
export const $pagePending = combine(
  $userPending,
  $cardsPending,
  (users, cards) => users || cards,
);

sample({
  clock: [hatch.enter, hatch.update],
  fn: ({ params }) => ({ body: { username: params.username } }),
  target: usersGetFx,
});

// FIXME: simplify, resolve before first render?
sample({
  source: usersGetFx.doneData,
  fn: ({ answer }) => ({ body: { authorId: answer.user.id } }),
  target: cardsListFx,
});
