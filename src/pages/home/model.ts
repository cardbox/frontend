import { attach, combine, createStore, sample } from 'effector';

import { cardsCache } from '@box/entities/card';
import { $session, chainAuthenticated } from '@box/entities/session';
import { addUsersToCache } from '@box/entities/user';

import type { Card } from '@box/shared/api';
import { internalApi } from '@box/shared/api';
import { routes } from '@box/shared/routes';

export const cardsFeedFx = attach({ effect: internalApi.cardsFeed });
export const cardsListFx = attach({ effect: internalApi.cardsList });
const currentRoute = routes.home;
const authenticatedRoute = chainAuthenticated(currentRoute);

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
  source: currentRoute.opened,
  target: cardsFeedFx,
});

$topCards.on(cardsFeedFx.doneData, (_, { answer }) => answer.top.cards as Card[]);
$latestCards.on(cardsFeedFx.doneData, (_, { answer }) => answer.latest.cards as Card[]);

// FIXME: move logic to entities level?
sample({
  source: cardsFeedFx.doneData,
  fn: ({ answer }) => [...answer.latest.users, ...answer.top.users],
  target: addUsersToCache,
});

// @TODO Will be deleted after BOX-250
const favoritesCtxLoaded = sample({
  source: $session,
  clock: authenticatedRoute.opened,
  fn: (user) => ({
    body: { authorId: user?.id, favorites: true },
  }),
  target: cardsListFx,
});

sample({
  source: favoritesCtxLoaded.doneData,
  fn: ({ answer }) => answer.cards.map(({ id }) => id),
  target: cardsCache.favouriteCardsSet,
});
