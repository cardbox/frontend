import type { Card } from '@box/api';
import { createEffect, createStore } from 'effector-root';
import { internalApi } from '@box/api';

export const getCardByIdFx = createEffect(async (cardId: string) => {
  const response = await internalApi.cards.get(cardId);
  return response.data;
});
// TODO: add params
export const getCardsListFx = createEffect(async () => {
  const response = await internalApi.cards.list();
  return response.data;
});

// TODO: add "normalizr"
// export const cardSchema = new schema.Entity('cards');
// export const cardsSchema = new schema.Array(cardSchema);
// export const normalizeCards = (data: Card[]) =>
//   normalize(data, cardsSchema).entities.cards;

export const $cards = createStore<Card[]>([]).on(
  getCardsListFx.doneData,
  (_, payload) => payload.cards,
);

export const $currentCard = createStore<Card | null>(null).on(
  getCardByIdFx.doneData,
  (_, payload) => payload.card,
);
