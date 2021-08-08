import * as api from '@box/api/generated';
import { CardsGetDone } from '@box/api/generated';
import { createEffect, createStore } from 'effector-root';
import { internalApi } from '@box/api';

type Card = CardsGetDone['answer']['card'];

export const cardGetByIdFx = createEffect(async (cardId: string) => {
  const response = await internalApi.cards.get(cardId);
  return response.body;
});

export const getCardByIdFx = createEffect(async (cardId: string) => {
  const { answer } = await api.cardsGet({ body: { cardId } });
  return answer.card;
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

export const getCardsListFx = createEffect(async () => {
  const { answer } = await api.cardsList({});
  return answer.cards as Card[];
});

export const $cards = createStore<Card[]>([]);
export const $currentCard = createStore<Card | null>(null);

export const $currentCardId = $currentCard.map((card) =>
  card ? card.id : null,
);

$cards.on(getCardsListFx.doneData, (_, cards) => cards);

$currentCard.on(getCardByIdFx.doneData, (_, card) => card);
