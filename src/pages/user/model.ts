import { $cardsCache } from '@box/entities/card/model';
import { $session } from '@box/entities/session';
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
const $cardsIds = createStore<string[]>([]);
const $favoritesIds = createStore<string[]>([]);
export const $cards = combine($cardsIds, $cardsCache, (ids, { cache }) =>
  ids.map((id) => cache[id]),
);
export const $favoritesCards = combine(
  $favoritesIds,
  $cardsCache,
  (ids, { cache }) => ids.map((id) => cache[id]),
);
export const $isOnOwnedPage = combine(
  $session,
  $currentUser,
  (session, current) => {
    if (!session || !current) return false;
    return session.id === current.id;
  },
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
  fn: ({ answer }) => ({
    body: { authorId: answer.user.id, favorites: false },
  }),
  target: cardsListFx,
});

sample({
  source: usersGetFx.doneData,
  fn: ({ answer }) => ({
    body: { authorId: answer.user.id, favorites: true },
  }),
  target: cardsListFx,
});

$cardsIds.on(cardsListFx.done, (ids, { params, result }) =>
  params.body?.favorites ? ids : result.answer.cards.map(({ id }) => id),
);

$favoritesIds.on(cardsListFx.done, (ids, { params, result }) =>
  params.body?.favorites ? result.answer.cards.map(({ id }) => id) : ids,
);
