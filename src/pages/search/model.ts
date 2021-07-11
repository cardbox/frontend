import { combine, createEvent } from 'effector-root';
import { searchModel } from '@box/features/search-bar';

export const searchQueryChanged = createEvent();

export const $isShowLoading = combine(
  searchModel.searchFx.pending,
  searchModel.$cardsCount,
  searchModel.$usersCount,
  (isPending, cardsCount, usersCount) =>
    isPending && !cardsCount && !usersCount,
);
