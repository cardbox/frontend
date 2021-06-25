import { StartParams } from '@cardbox/lib/page-routing';
import { attach, createEvent, forward, restore } from 'effector-root';
import { cardModel } from '@cardbox/entities/card';

export const getCardsListFx = attach({ effect: cardModel.getCardsListFx });
export const pageLoaded = createEvent<StartParams>();
export const $pagePending = restore(getCardsListFx.pending.updates, true);

forward({
  from: pageLoaded,
  to: getCardsListFx,
});
