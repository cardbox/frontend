import type { Card } from '@box/shared/api';
import {
  attach,
  combine,
  createDomain,
  createStore,
  restore,
  sample,
} from 'effector';
import { createHatch } from 'framework';
import { internalApi } from '@box/shared/api';
import { userModel } from '@box/entities/user';

export const cardsFeedFx = attach({ effect: internalApi.cardsFeed });
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
