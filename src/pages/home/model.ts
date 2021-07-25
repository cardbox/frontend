import { StartParams } from '@box/lib/page-routing';
import { attach, createEvent, forward, restore } from 'effector-root';
import { cardModel } from '@box/entities/card';

export const getCardsListFx = attach({ effect: cardModel.cardGetListFx });
export const pageLoaded = createEvent<StartParams>();
export const $pagePending = restore(getCardsListFx.pending.updates, true);

forward({
  from: pageLoaded,
  to: getCardsListFx,
});
