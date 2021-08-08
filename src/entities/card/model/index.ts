import * as api from '@box/api/generated';
import type { Card } from '@box/api';
import { createEffect, createStore } from 'effector-root';
import { internalApi } from '@box/api';

export const getCardByIdFx = createEffect(async (cardId: string) => {
  const response = await internalApi.cards.get(cardId);
  return response.body.card;
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

export const getCardsListFx = createEffect(async () => {
  const response = await internalApi.cards.list();
  return response.body.cards;
});

export const deleteCardByIdFx = createEffect(async (cardId: string) => {
  const { answer } = await api.cardsDelete({ body: { cardId } });
  return answer.cardId;
});

export const $cards = createStore<Card[]>([]);
export const $currentCard = createStore<Card | null>(null);

export const $currentCardId = $currentCard.map((card) =>
  card ? card.id : null,
);

$cards.on(getCardsListFx.doneData, (_, cards) => cards);

$currentCard.on(getCardByIdFx.doneData, (_, card) => card);
