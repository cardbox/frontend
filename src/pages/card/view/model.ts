import { createEffect, createStore, forward, root } from 'effector-root';
import { Card } from '@box/api';
import { createHatch } from '@box/framework/src';

export const loadCardFx = createEffect<void, Card | null, any>({
  handler() {
    return {
      title: 'Card from loadCardFx',
    };
  },
});

export const $currentCard = createStore<Card | null>(null);

export const hatch = createHatch();

forward({
  from: hatch.enter,
  to: loadCardFx,
});

$currentCard.on(loadCardFx.doneData, (store, card) => {
  if (card) {
    return card;
  }
  return store;
});
