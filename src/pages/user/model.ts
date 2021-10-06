import { $cardsCache } from '@box/entities/card/model';
import { User, internalApi } from '@box/shared/api';
import { attach, combine, createDomain, createStore, sample } from 'effector';
import { createHatch } from 'framework';
import { some } from 'patronum';

export const hatch = createHatch(createDomain('UserViewPage'));

export const usersGetFx = attach({ effect: internalApi.usersGet });
export const cardsListFx = attach({ effect: internalApi.cardsList });

export const $userPending = usersGetFx.pending;
export const $cardsPending = cardsListFx.pending;
export const $currentUser = createStore<User | null>(null);
export const $isUserFound = $currentUser.map((user) => Boolean(user));
const $cardsIds = createStore<string[]>([]);
export const $cards = combine($cardsIds, $cardsCache, (ids, { cache }) =>
  ids.map((id) => cache[id]),
);

export const $pagePending = some({
  predicate: true,
  stores: [$userPending, $cardsPending],
});

sample({
  clock: [hatch.enter, hatch.update],
  fn: ({ params }) => ({ body: { username: params.username } }),
  target: usersGetFx,
});

$currentUser.on(usersGetFx.doneData, (_, { answer }) => answer.user);

sample({
  source: usersGetFx.doneData,
  fn: ({ answer }) => ({ body: { authorId: answer.user.id } }),
  target: cardsListFx,
});

$cardsIds.on(cardsListFx.doneData, (_, { answer }) =>
  answer.cards.map(({ id }) => id),
);
