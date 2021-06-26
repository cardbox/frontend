import type { Card, User } from '@box/api';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector-root';
import { internalApi } from '@box/api';
import { model } from '@box/features/search-bar';

export const $searchResultCardList = createStore<Card[]>([]);
export const $searchResultUserList = createStore<User[]>([]);
export const $searchCardsCount = createStore<number>(0);
export const $searchUsersCount = createStore<number>(0);

export const searchQueryChanged = createEvent();
const searchFx = createEffect(async (query: string) => {
  const response = await internalApi.search.results(query);
  return response.data;
});

export const $isShowLoading = combine(
  searchFx.pending,
  $searchCardsCount,
  $searchUsersCount,
  (isPending, cardsCount, usersCount) =>
    isPending && !cardsCount && !usersCount,
);
sample({
  clock: searchQueryChanged,
  source: model.$searchValue,
  target: searchFx,
});

$searchResultCardList.on(searchFx.doneData, (_, { cards }) => cards);
$searchResultUserList.on(searchFx.doneData, (_, { users }) => users);
$searchCardsCount.on(searchFx.doneData, (_, { cards }) => cards.length);
$searchUsersCount.on(searchFx.doneData, (_, { users }) => users.length);
