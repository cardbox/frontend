import * as api from '@box/api/generated';
import { CardsGetDone } from '@box/api/generated';
import { createEffect, createStore } from 'effector-root';

type Card = CardsGetDone['answer']['card'];

export const getCardByIdFx = createEffect(async (cardId: string) => {
  const { answer } = await api.cardsGet({ body: { cardId } });
  return answer.card;
});

// TODO: add params
export const getCardsListFx = createEffect(async () => {
  const { answer } = await api.cardsList({});
  return answer.cards as Card[];
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
