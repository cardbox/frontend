import { Card } from '@box/api';
import { createEffect, createStore, root, sample } from 'effector-root';
import { createHatch } from '@box/framework/src';

export const hatch = createHatch(root.createDomain('HomePage'));

export const cardsFeedFx = createEffect<void, Card[] | null, any>({
  handler: () => {
    return [
      {
        title: 'from cardsFeedFx',
      },
    ];
  },
});

export const $topCards = createStore<Card[]>([]);

$topCards.on(cardsFeedFx.doneData, (_, cards) => (cards ? [...cards] : []));

sample({
  source: hatch.enter,
  target: cardsFeedFx,
});
