import type { Card } from '@box/api';
import { StartParams } from '@box/lib/page-routing';
import {
  attach,
  createEvent,
  createStore,
  forward,
  restore,
} from 'effector-root';
import { internalApi } from '@box/api';

export const cardsFeedFx = attach({ effect: internalApi.cardsFeed });
export const pageLoaded = createEvent<StartParams>();
export const $pagePending = restore(cardsFeedFx.pending.updates, true);

// FIXME: move to entities/card level later? (as cache store?)
export const $topCards = createStore<Card[]>([]);
export const $latestCards = createStore<Card[]>([]);

forward({
  from: pageLoaded,
  to: cardsFeedFx,
});

$topCards.on(
  cardsFeedFx.doneData,
  (_, { answer }) => answer.top.cards as Card[],
);
$latestCards.on(
  cardsFeedFx.doneData,
  (_, { answer }) => answer.latest.cards as Card[],
);
