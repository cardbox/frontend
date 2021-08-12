import type { Card } from '@box/api';
import { attach, forward, restore } from 'effector-root';
import { cardModel } from '@box/entities/card';
import { createStart } from '@box/lib/page-routing';
import { internalApi } from '@box/api';

export const pageStart = createStart();

export const cardsFeedFx = attach({ effect: internalApi.cardsFeedFx });
export const $pagePending = restore(cardsFeedFx.pending.updates, true);

forward({
  from: pageStart,
  to: cardsFeedFx,
});

forward({
  from: cardsFeedFx.doneData.map(({ answer }) => answer.cards as Card[]),
  to: cardModel.setCards,
});
