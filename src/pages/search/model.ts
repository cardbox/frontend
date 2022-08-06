import { attach, createEvent, createStore, sample } from 'effector';
import { and, not } from 'patronum';

import { searchModel } from '@box/features/search-bar';

import { cardsCache } from '@box/entities/card';
import { $session } from '@box/entities/session';

import { internalApi } from '@box/shared/api';
import { routes } from '@box/shared/routes';

export const cardsLoadFavouritesFx = attach({
  source: $session,
  async effect(user) {
    return internalApi.cardsList({ body: { authorId: user?.id, favorites: true } });
  },
});

export const $searchQuery = createStore('');

export const searchQueryChanged = createEvent<string>();
const currentRoute = routes.search.results;

export const $isShowLoading = and(
  searchModel.searchFx.pending,
  not(searchModel.$cardsCount),
  not(searchModel.$usersCount),
);

// TODO: load favourites immediately with session
sample({
  clock: [currentRoute.opened, currentRoute.updated],
  target: cardsLoadFavouritesFx,
});

sample({
  source: cardsLoadFavouritesFx.doneData,
  fn: ({ answer }) => answer.cards.map(({ id }) => id),
  target: cardsCache.favouriteCardsSet,
});
