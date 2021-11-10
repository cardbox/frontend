import { $session } from '@box/entities/session';
import type { Card } from '@box/shared/api';
import { attach, combine, createDomain, createStore, sample } from 'effector';
import { cardModel } from '@box/entities/card';
import { createHatch } from 'framework';
import { internalApi } from '@box/shared/api';
import { userModel } from '@box/entities/user';

export const cardsFeedFx = attach({ effect: internalApi.cardsFeed });
export const cardsListFx = attach({ effect: internalApi.cardsList });
export const hatch = createHatch(createDomain('HomePage'));

// FIXME: move to entities/card level later? (as cache store?)
export const $topCards = createStore<Card[]>([]);
export const $latestCards = createStore<Card[]>([]);

export const $pagePending = combine(
  cardsFeedFx.pending,
  $topCards,
  $latestCards,
  (pending, top, _latest) => pending && top.length === 0,
);

sample({
  source: hatch.enter,
  target: cardsFeedFx,
});

$topCards.on(
  cardsFeedFx.doneData,
  (_, { answer }) => answer.top.cards as Card[],
);
$latestCards.on(
  cardsFeedFx.doneData,
  (_, { answer }) => answer.latest.cards as Card[],
);

// FIXME: move logic to entities level?
sample({
  source: cardsFeedFx.doneData,
  fn: ({ answer }) => [...answer.latest.users, ...answer.top.users],
  target: userModel.updateMap,
});

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
