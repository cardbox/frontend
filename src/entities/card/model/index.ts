import type { Card } from '@box/api';
import { createEffect, createEvent, createStore } from 'effector-root';
import { internalApi } from '@box/api';

export const getCardByIdFx = createEffect(async (cardId: string) => {
  const { answer } = await internalApi.cardsGet({ body: { cardId } });
  return answer.card;
});

export const getCardsListFx = createEffect(async () => {
  const { answer } = await internalApi.cardsList({});
  return answer.cards as Card[];
});

export const deleteCardByIdFx = createEffect(async (cardId: string) => {
  const { answer } = await internalApi.cardsDelete({ body: { cardId } });
  return answer.cardId;
});

export const setCards = createEvent<Card[]>();

export const $cards = createStore<Card[]>([]);
export const $currentCard = createStore<Card | null>(null);

export const $currentCardId = $currentCard.map((card) =>
  card ? card.id : null,
);

$cards.on(getCardsListFx.doneData, (_, cards) => cards);
$cards.on(setCards, (_, cards) => cards);

$currentCard.on(getCardByIdFx.doneData, (_, card) => card);
