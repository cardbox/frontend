import { createEffect, createStore, root, sample } from 'effector-root';
import { createHatch } from '@box/framework/src';
import { Card } from '@box/api';

export const hatch = createHatch();

export const cardsFeedFx = createEffect<void, Card[] | null, any>({
  handler: () => {
    return [{
      title: 'from cardsFeedFx',
    }];
  },
});

export const $topCards = createStore<Card[]>([]);

$topCards.on(cardsFeedFx.doneData, (_, cards) => cards ? [...cards] : []);

sample({
  source: hatch.enter,
  target: cardsFeedFx,
});

