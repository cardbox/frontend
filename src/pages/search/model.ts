import { attach, createEvent, sample } from 'effector';
import { and, not } from 'patronum';

import { searchModel } from '@box/features/search-bar';

import { cardModel } from '@box/entities/card';
import { $session } from '@box/entities/session';

import { internalApi } from '@box/shared/api';
import { routes } from '@box/shared/routes';

export const cardsListFx = attach({ effect: internalApi.cardsList });

export const searchQueryChanged = createEvent();
const currentRoute = routes.search.results;

export const $isShowLoading = and(
  searchModel.searchFx.pending,
  not(searchModel.$cardsCount),
  not(searchModel.$usersCount),
);

// @TODO Will be deleted after BOX-250
const favoritesCtxLoaded = sample({
  source: $session,
  clock: [currentRoute.opened, currentRoute.updated],
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
