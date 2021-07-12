import { StartParams } from '@box/lib/page-routing';
import { attach, createEvent, forward, restore } from 'effector-root';
import { cardModel } from '@box/entities/card';
import { userModel } from '@box/entities/user';

export const pageLoaded = createEvent<StartParams>();
export const $pagePending = restore(
  userModel.getUserByNicknameFx.pending.updates,
  true,
);

export const getUserByNicknameFx = attach({
  effect: userModel.getUserByNicknameFx,
  mapParams: (res: StartParams) => {
    return res.params.username;
  },
});

forward({
  from: pageLoaded,
  to: getUserByNicknameFx,
});

forward({
  from: pageLoaded,
  to: cardModel.getCardsListFx,
});
