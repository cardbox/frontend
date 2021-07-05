import { StartParams } from '@box/lib/page-routing';
import { attach, createEvent, forward, restore } from 'effector-root';
import { cardModel } from '@box/entities/card';
import { userModel } from '@box/entities/user';

export const getUserByNicknameFx = attach({
  effect: userModel.getUserByNicknameFx,
});

export const pageLoaded = createEvent<StartParams>();
export const $pagePending = restore(getUserByNicknameFx.pending.updates, true);

forward({
  // @ts-ignore
  from: pageLoaded,
  to: getUserByNicknameFx,
});

export const getCardsListFx = attach({ effect: cardModel.getCardsListFx });

forward({
  from: pageLoaded,
  to: getCardsListFx,
});
