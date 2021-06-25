import { StartParams } from '@cardbox/lib/page-routing';
import { attach, createEvent, restore, sample } from 'effector-root';
import { cardModel } from '@cardbox/entities/card';

export const getCardByIdFx = attach({ effect: cardModel.getCardByIdFx });
export const pageLoaded = createEvent<StartParams>();
export const $pagePending = restore(getCardByIdFx.pending.updates, true);

sample({
  source: pageLoaded,
  fn: ({ params }) => params.cardId,
  target: getCardByIdFx,
});
