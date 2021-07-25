import type { Card } from '@box/api';
import { createEffect, createStore } from 'effector-root';
import { internalApi } from '@box/api';

export const cardGetByIdFx = createEffect(async (cardId: string) => {
  const response = await internalApi.cards.get(cardId);
  return response.body;
});
// TODO: add params
export const cardGetListFx = createEffect(async () => {
  const response = await internalApi.cards.list();
  return response.body;
});

export const cardCreateFx = createEffect(
  async (params: internalApi.CardCreateParams) => {
    const response = await internalApi.cards.create(params);
    return response.body;
  },
);

export const cardUpdateFx = createEffect(
  async (params: internalApi.CardUpdateParams) => {
    const response = await internalApi.cards.update(params);
    return response.body;
  },
);

export const $cards = createStore<Card[]>([]).on(
  cardGetListFx.doneData,
  (_, payload) => payload.cards,
);

export const $currentCard = createStore<Card | null>(null).on(
  cardGetByIdFx.doneData,
  (_, payload) => payload.card,
);

export const $currentCardId = $currentCard.map((card) =>
  card ? card.id : null,
);
