import type { Card } from '@box/shared/api';
import { attach } from 'effector/effector.umd';
import { combine, createEvent, createStore, sample } from 'effector';
import { internalApi } from '@box/shared/api';

export const setCards = createEvent<Card[]>();

export const $cardsCache = createStore<{ cache: Record<string, Card> }>({
  cache: {},
});

export const cardsSaveFx = attach({ effect: internalApi.cardsSave });
export const cardsUnsaveFx = attach({ effect: internalApi.cardsUnsave });

export const $cards = createStore<Card[]>([]);

// @TODO It's bad practice to use global store. Will be fixed after BOX-250
export const $favoritesIds = createStore<string[]>([]);

export const changeFavorites = createEvent<string[]>();

export const $favoritesCards = combine(
  $favoritesIds,
  $cardsCache,
  (ids, { cache }) => ids.map((id) => cache[id] ?? null),
);
export const $currentCard = createStore<Card | null>(null);
// TODO: remove current card id and current card store from entities
export const $currentCardId = $currentCard.map((card) =>
  card ? card.id : null,
);

export const addedToFavorites = createEvent<string>();
export const removedFromFavorites = createEvent<string>();

$cards.on(internalApi.cardsList.done, (cards, { params, result }) =>
  !params.body?.favorites ? (result.answer.cards as Card[]) : cards,
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
  )
  .on(internalApi.cardsSave.doneData, (cache, { answer }) =>
    updateCache(cache, [answer.card as Card]),
  )
  .on(internalApi.cardsUnsave.doneData, (cache, { answer }) =>
    updateCache(cache, [answer.card as Card]),
  );

const cardSaveResolved = sample({
  clock: addedToFavorites,
  fn: (id) => ({
    body: { cardId: id },
  }),
  target: cardsSaveFx,
});

const cardUnsaveResolved = sample({
  clock: removedFromFavorites,
  fn: (id) => ({
    body: { cardId: id },
  }),
  target: cardsUnsaveFx,
});

$favoritesIds
  .on(changeFavorites, (_, ids) => ids)
  .on(cardSaveResolved.doneData, (ids, { answer }) => [...ids, answer.card.id])
  .on(cardUnsaveResolved.doneData, (ids, { answer }) =>
    ids.filter((s) => s !== answer.card.id),
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
