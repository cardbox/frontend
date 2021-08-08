import { Card, internalApi } from '@box/api';
import { createEffect, createEvent, createStore } from 'effector-root';

export const getCardByIdFx = createEffect(async (cardId: string) => {
  const { answer } = await internalApi.cardsGet({ body: { cardId } });
  return answer.card;
});

// TODO: add params
export const getCardsListFx = createEffect(async () => {
  const { answer } = await internalApi.cardsList({});
  return answer.cards as Card[];
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
