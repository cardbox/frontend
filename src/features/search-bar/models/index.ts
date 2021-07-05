import { ChangeEvent } from 'react';
import {
  createEffect,
  createEvent,
  createStore,
  forward,
  guard,
  restore,
} from 'effector-root';
import { debounce } from 'patronum/debounce';
import { historyPush } from '@box/entities/navigation';

import { Card, User, internalApi } from '../../../api';
import { paths } from '../../../pages/paths';

export const searchFieldChanged = createEvent<ChangeEvent<HTMLInputElement>>();

export const searchValueChanged = createEvent<string>();
export const $searchValue = restore(searchValueChanged, '');

forward({
  from: searchFieldChanged.map((event) => event.target.value),
  to: searchValueChanged,
});

const searchDebounced = debounce({
  source: searchValueChanged,
  timeout: 350,
});

const searchSubmitted = guard({
  clock: searchDebounced,
  source: $searchValue,
  filter: (query) => Boolean(query.trim()),
});

const trimmedSearchSubmitted = searchSubmitted.map((query) => query.trim());

export const $searchResultCardList = createStore<Card[]>([]);
export const $searchResultUserList = createStore<User[]>([]);
export const $searchCardsCount = createStore<number>(0);
export const $searchUsersCount = createStore<number>(0);

export const searchFx = createEffect(async (query: string) => {
  console.log(query);
  const response = await internalApi.search.results(query);
  return response.body;
});

forward({
  from: trimmedSearchSubmitted.map(paths.search),
  to: historyPush,
});
forward({
  from: trimmedSearchSubmitted,
  to: searchFx,
});

$searchResultCardList.on(searchFx.doneData, (_, { cards }) => cards);
$searchResultUserList.on(searchFx.doneData, (_, { users }) => users);
$searchCardsCount.on(searchFx.doneData, (_, { cards }) => cards.length);
$searchUsersCount.on(searchFx.doneData, (_, { users }) => users.length);
