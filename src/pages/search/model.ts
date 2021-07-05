import { combine, createEvent } from 'effector-root';

import { searchModel } from '../../features/search-bar';

export const searchQueryChanged = createEvent();

export const $isShowLoading = combine(
  searchModel.searchFx.pending,
  searchModel.$searchCardsCount,
  searchModel.$searchUsersCount,
  (isPending, cardsCount, usersCount) =>
    isPending && !cardsCount && !usersCount,
);
