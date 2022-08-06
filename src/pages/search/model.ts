import { attach, createEffect, createEvent, createStore, sample } from 'effector';
import { and, not, throttle } from 'patronum';
import { spread } from 'patronum/spread';

import { cardsCache } from '@box/entities/card';
import { $searchQuery, searchQueryEntered } from '@box/entities/search';
import { $session } from '@box/entities/session';
import { addUsersToCache } from '@box/entities/user';

import { Card, internalApi, User } from '@box/shared/api';
import { routes } from '@box/shared/routes';

import { TabName } from './types';

export { $searchQuery };

const cardsSearchFx = attach({ effect: internalApi.cardsSearch });
const usersSearchFx = attach({ effect: internalApi.usersSearch });

const searchFx = createEffect(async (query: string) => {
  const [cards, users] = await Promise.all([
    cardsSearchFx({ body: { query } }),
    usersSearchFx({ body: { query } }),
  ]);
  return {
    cards: cards.answer.cards as Card[],
    users: users.answer.users as User[],
  };
});

export const cardsLoadFavouritesFx = attach({
  source: $session,
  async effect(user) {
    return internalApi.cardsList({
      body: {
        authorId: user?.id,
        favorites: true,
      },
    });
  },
});

export const tabChanged = createEvent<TabName>();

export const $currentTab = createStore<TabName>('cards');
export const $cardList = createStore<Card[]>([]);
export const $userList = createStore<User[]>([]);

const $cardsCount = $cardList.map((cards) => cards.length);
const $usersCount = $userList.map((users) => users.length);

export const $isShowLoading = and(searchFx.pending, not($cardsCount), not($usersCount));

const currentRoute = routes.search.results;

const $queryTab = currentRoute.$query.map((query) => query.tab ?? '');

// TODO: load favourites immediately with session
sample({
  clock: currentRoute.opened,
  target: cardsLoadFavouritesFx,
});

sample({
  source: cardsLoadFavouritesFx.doneData,
  fn: ({ answer }) => answer.cards.map(({ id }) => id),
  target: cardsCache.favouriteCardsSet,
});

sample({
  clock: currentRoute.opened,
  source: currentRoute.$query,
  filter: (query) => Boolean(query.search),
  fn: (query) => query.search,
  target: $searchQuery,
});

sample({
  clock: $queryTab,
  fn: (tab) => (['users', 'cards'].includes(tab) ? tab : 'cards'),
  target: $currentTab,
});

$currentTab.on(tabChanged, (_, tab) => tab);

sample({
  source: currentRoute.$query,
  clock: $currentTab,
  filter: (exists, newTab) => exists.tab !== newTab,
  fn: (query, tab) => ({ params: {}, query: { ...query, tab } }),
  target: currentRoute.navigate,
});

const readyToNavigate = sample({
  clock: searchQueryEntered,
  source: currentRoute.$query,
  filter: currentRoute.$isOpened,
  fn: (query, search) => ({ params: {}, query: { ...query, search } }),
});

sample({
  clock: throttle({
    source: readyToNavigate,
    timeout: 300,
  }),
  target: currentRoute.navigate,
});

sample({
  source: $searchQuery,
  clock: [currentRoute.opened, currentRoute.updated],
  target: searchFx,
});

spread({
  source: searchFx.doneData,
  targets: {
    cards: $cardList,
    users: $userList,
  },
});

sample({
  source: cardsSearchFx.doneData,
  fn: ({ answer }) => answer.users as User[],
  target: addUsersToCache,
});
