import { StartParams } from '@box/lib/page-routing';
import { Unit } from 'effector';
import { attach, createEvent, forward, restore } from 'effector-root';
import { cardModel } from '@box/entities/card';
import { userModel } from '@box/entities/user';

export const pageLoaded = createEvent<StartParams>();

export const getUserByNicknameFx = attach({
  effect: userModel.getUserByNicknameFx,
});

export const $pagePending = restore(getUserByNicknameFx.pending.updates, true);
export const getCardsListFx = attach({ effect: cardModel.getCardsListFx });

const options: { from: Unit<unknown>; to: Unit<unknown> } = {
  from: pageLoaded,
  to: getUserByNicknameFx,
};

forward(options);

forward({
  from: pageLoaded,
  to: getCardsListFx,
});
