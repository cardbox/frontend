import { attach, combine, createDomain, createEvent, sample } from 'effector';
import { createHatch } from 'framework';

import { cardModel } from '@box/entities/card';
import { $session } from '@box/entities/session';
import { searchModel } from '@box/features/search-bar';
import { internalApi } from '@box/shared/api';

export const cardsListFx = attach({ effect: internalApi.cardsList });

export const searchQueryChanged = createEvent();
export const hatch = createHatch(createDomain('SearchPage'));

export const $isShowLoading = combine(
  searchModel.searchFx.pending,
  searchModel.$cardsCount,
  searchModel.$usersCount,
  (isPending, cardsCount, usersCount) => isPending && !cardsCount && !usersCount,
);

// @TODO Will be deleted after BOX-250
const favoritesCtxLoaded = sample({
  source: $session,
  clock: hatch.enter,
  fn: (user) => ({
    body: { authorId: user?.id, favorites: true },
  }),
  target: cardsListFx,
});

sample({
  source: favoritesCtxLoaded.doneData,
  fn: ({ answer }) => answer.cards.map(({ id }) => id),
  target: cardModel.changeFavorites,
});
