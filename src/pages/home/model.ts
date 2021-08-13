import type { Card } from '@box/api';
import { attach, createStore, restore, sample } from 'effector-root';
import { createStart } from '@box/lib/page-routing';
import { internalApi } from '@box/api';
import { userModel } from '@box/entities/user';

export const cardsFeedFx = attach({ effect: internalApi.cardsFeed });
export const pageStart = createStart();

export const $pagePending = restore(cardsFeedFx.pending.updates, true);

// FIXME: move to entities/card level later? (as cache store?)
export const $topCards = createStore<Card[]>([]);
export const $latestCards = createStore<Card[]>([]);

sample({
  source: pageStart,
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
