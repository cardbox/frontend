import type { Card } from '@box/shared/api';
import { createEvent, createStore } from 'effector';
import { internalApi } from '@box/shared/api';

export const setCards = createEvent<Card[]>();

export const $cardsCache = createStore<{ cache: Record<string, Card> }>({
  cache: {},
});

export const $cards = createStore<Card[]>([]);
export const $currentCard = createStore<Card | null>(null);
// TODO: remove current card id and current card store from entities
export const $currentCardId = $currentCard.map((card) =>
  card ? card.id : null,
);

$cards.on(
  internalApi.cardsList.doneData,
  (_, { answer }) => answer.cards as Card[],
);

$cards.on(setCards, (_, cards) => cards);

$currentCard.on(internalApi.cardsGet.doneData, (_, { answer }) => answer.card);

$cardsCache
  .on(internalApi.cardsList.doneData, (cache, { answer }) =>
    updateCache(cache, answer.cards as Card[]),
  )
  .on(internalApi.cardsGet.doneData, (cache, { answer }) =>
    updateCache(cache, [answer.card as Card]),
  )
  .on(internalApi.cardsCreate.doneData, (cache, { answer }) =>
    updateCache(cache, [answer.card as Card]),
  )
  .on(internalApi.cardsEdit.doneData, (cache, { answer }) =>
    updateCache(cache, [answer.card as Card]),
  );

function updateCache<T extends { id: string }>(
  source: { cache: Record<string, T> },
  values: T[],
) {
  let modified = false;
  values.forEach((value) => {
    if (source.cache[value.id] === value) {
      // skip
      return;
    }

    source.cache[value.id] = value;
    modified = true;
  });

  if (modified) return { cache: source.cache }; // Recreate object to force update
  return source;
}
