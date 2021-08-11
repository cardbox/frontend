import type { Card } from '@box/api';
import { StartParams } from '@box/lib/page-routing';
import { attach, createEvent, forward, restore } from 'effector-root';
import { cardModel } from '@box/entities/card';
import { internalApi } from '@box/api';

export const cardsFeedFx = attach({ effect: internalApi.cardsFeedFx });
export const pageLoaded = createEvent<StartParams>();
export const $pagePending = restore(cardsFeedFx.pending.updates, true);

forward({
  from: pageLoaded,
  to: cardsFeedFx,
});

forward({
  from: cardsFeedFx.doneData.map(({ answer }) => answer.cards as Card[]),
  to: cardModel.setCards,
});
