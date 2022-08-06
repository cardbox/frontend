import { attach, combine, createEvent, createStore, sample } from 'effector';

import { Card, internalApi } from '@box/shared/api';

export const $cardsCache = createStore<{ map: Record<string, Card> }>({
  map: {},
});

export const cardsSaveFx = attach({ effect: internalApi.cardsSave });
export const cardsUnsaveFx = attach({ effect: internalApi.cardsUnsave });

export const $favoritesIds = createStore<string[]>([]);

export const favouriteCardsSet = createEvent<string[]>();
export const $favoritesCards = combine($favoritesIds, $cardsCache, (ids, { map }) =>
  ids.map((id) => (map[id] as Card) ?? null),
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
  .on(favouriteCardsSet, (_, ids) => ids)
  .on(cardsSaveFx.doneData, (ids, { answer }) => [...ids, answer.card.id])
  .on(cardsUnsaveFx.doneData, (ids, { answer }) => ids.filter((s) => s !== answer.card.id));

function updateCache<T extends { id: string }>(source: { map: Record<string, T> }, values: T[]) {
  let modified = false;
  values.forEach((value) => {
    if (source.map[value.id] === value) {
      // skip
      return;
    }

    source.map[value.id] = value;
    modified = true;
  });

  if (modified) return { map: source.map }; // Recreate object to force update
  return source;
}
