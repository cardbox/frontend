import type { Card } from '@box/api';
import { attach, createDomain, createStore, restore, sample } from 'effector';
import { createHatch } from 'framework';
import { internalApi } from '@box/api';
import { userModel } from '@box/entities/user';

export const cardsFeedFx = attach({ effect: internalApi.cardsFeed });
export const hatch = createHatch(createDomain('HomePage'));

export const $pagePending = restore(cardsFeedFx.pending.updates, true);

// FIXME: move to entities/card level later? (as cache store?)
export const $topCards = createStore<Card[]>([]);
export const $latestCards = createStore<Card[]>([]);
export const $usersMap = userModel.$usersMap;

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
