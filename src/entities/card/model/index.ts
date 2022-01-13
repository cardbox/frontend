import { attach, combine, createEvent, createStore, sample } from 'effector';

import { Card, internalApi } from '@box/shared/api';

export const $cardsCache = createStore<{ cache: Record<string, Card> }>({
  cache: {},
});

export const cardsSaveFx = attach({ effect: internalApi.cardsSave });
export const cardsUnsaveFx = attach({ effect: internalApi.cardsUnsave });

// @TODO It's bad practice to use global store. Will be fixed after BOX-250
export const $favoritesIds = createStore<string[]>([]);

export const changeFavorites = createEvent<string[]>();
changeFavorites.watch((list) => console.info('————', list));
export const $favoritesCards = combine($favoritesIds, $cardsCache, (ids, { cache }) =>
  ids.map((id) => cache[id] ?? null),
);

export const favoritesAdd = createEvent<string>();
export const favoritesRemove = createEvent<string>();

$cardsCache
  .on(internalApi.cardsList.doneData, (cache, { answer }) =>
    updateCache(cache, answer.cards as Card[]),
  )
  .on(
    [
      internalApi.cardsGet.doneData,
      internalApi.cardsCreate.doneData,
      internalApi.cardsEdit.doneData,
      internalApi.cardsSave.doneData,
      internalApi.cardsUnsave.doneData,
    ],
    (cache, { answer }) => updateCache(cache, [answer.card as Card]),
  );

sample({
  clock: favoritesAdd,
  fn: (cardId) => ({ body: { cardId } }),
  target: cardsSaveFx,
});

sample({
  clock: favoritesRemove,
  fn: (cardId) => ({
    body: { cardId },
  }),
  target: cardsUnsaveFx,
});

$favoritesIds
  .on(changeFavorites, (_, ids) => ids)
  .on(cardsSaveFx.doneData, (ids, { answer }) => [...ids, answer.card.id])
  .on(cardsUnsaveFx.doneData, (ids, { answer }) => ids.filter((s) => s !== answer.card.id));

function updateCache<T extends { id: string }>(source: { cache: Record<string, T> }, values: T[]) {
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
