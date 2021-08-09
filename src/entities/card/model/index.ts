import type { Card } from '@box/api';
import { createEvent, createStore } from 'effector-root';
import { internalApi } from '@box/api';

export const setCards = createEvent<Card[]>();

export const $cards = createStore<Card[]>([]);
export const $currentCard = createStore<Card | null>(null);

export const $currentCardId = $currentCard.map((card) =>
  card ? card.id : null,
);

$cards.on(
  internalApi.cardsList.doneData,
  (_, { answer }) => answer.cards as Card[],
);

$cards.on(setCards, (_, cards) => cards);

$currentCard.on(internalApi.cardsGet.doneData, (_, { answer }) => answer.card);
