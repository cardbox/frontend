import { attach, combine, createDomain, createStore, sample } from 'effector';
import { createHatch } from 'framework';
import { some } from 'patronum';

import { cardModel } from '@box/entities/card';
import { $session } from '@box/entities/session';
import { User, internalApi } from '@box/shared/api';

export const hatch = createHatch(createDomain('UserViewPage'));

export const usersGetFx = attach({ effect: internalApi.usersGet });
export const cardsListFx = attach({ effect: internalApi.cardsList });

export const $userPending = usersGetFx.pending;
export const $cardsPending = cardsListFx.pending;
export const $currentUser = createStore<User | null>(null);
const $cardsIds = createStore<string[]>([]);
export const $cards = combine($cardsIds, cardModel.$cardsCache, (ids, { cache }) =>
  ids.map((id) => cache[id] ?? null),
);
export const $isOnOwnedPage = combine($session, $currentUser, (session, current) => {
  if (!session || !current) return false;
  return session.id === current.id;
});

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

// @TODO Will be deleted after BOX-250
const favoritesCtxLoaded = sample({
  source: $session,
  clock: hatch.enter,
  fn: (user) => ({
    body: { authorId: user?.id, favorites: true },
  }),
  target: cardsListFx,
});

sample({
  source: favoritesCtxLoaded.doneData,
  fn: ({ answer }) => answer.cards.map(({ id }) => id),
  target: cardModel.changeFavorites,
});
