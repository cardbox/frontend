import type { Card } from '@cardbox/entities/card';
import { IUserPreview } from '@cardbox/entities/user/types';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector-root';
import { model } from '@cardbox/features/search-bar';

interface UserContract {
  name: string;
  id: string;
  cards_count: number;
  description: string;
}

export const $searchResultCardList = createStore<Card[]>([]);
export const $searchResultUserList = createStore<IUserPreview[]>([]);
export const $searchCardsCount = createStore<number>(0);
export const $searchUsersCount = createStore<number>(0);

interface ItemContract<T> {
  items: T[];
  total_count: number;
}
interface SearchContract {
  cards: ItemContract<Card>;
  users: ItemContract<UserContract>;
}
export const searchQueryChanged = createEvent();
const searchFx = createEffect<string, SearchContract>(
  (query) =>
    new Promise((resolve) => {
      setTimeout(
        () => resolve(query === 'test' ? test2Response : testResponse),
        1000,
      );
    }),
);
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

$searchResultCardList.on(searchFx.doneData, (_, { cards }) => cards.items);
$searchResultUserList.on(searchFx.doneData, (_, { users }) =>
  users.items.map(convertUserPreview),
);
$searchCardsCount.on(searchFx.doneData, (_, { cards }) => cards.total_count);
$searchUsersCount.on(searchFx.doneData, (_, { users }) => users.total_count);

function convertUserPreview(user: UserContract): IUserPreview {
  return {
    id: user.id,
    name: user.name,
    cardsCount: user.cards_count,
    description: user.description,
  };
}

// todo: remove
const testResponse: SearchContract = {
  cards: {
    items: [
      {
        id: 1,
        author: { username: 'author 1' },
        content:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae consequatur cum cupiditate debitis enim error expedita facilis illo impedit ipsum iusto labore maiores omnis repellendus, tempora. Ea iste necessitatibus officiis? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae consequatur cum cupiditate debitis enim error expedita facilis illo impedit ipsum iusto labore maiores omnis repellendus, tempora. Ea iste necessitatibus officiis? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae consequatur cum cupiditate debitis enim error expedita facilis illo impedit ipsum iusto labore maiores omnis repellendus, tempora. Ea iste necessitatibus officiis?',
        title: 'title 1',
        updatedAt: '05:03 03.01.2',
      },
      {
        id: 2,
        author: { username: 'author 2' },
        content: 'content 2',
        title: 'title 2',
        updatedAt: '05:03 03.01.2',
      },
      {
        id: 3,
        author: { username: 'author 3' },
        content: 'content 3',
        title: 'title 3',
        updatedAt: '05:03 03.01.2',
      },
      {
        id: 4,
        author: { username: 'author 4' },
        content: 'content 4',
        title: 'title 4',
        updatedAt: '05:03 03.01.2',
      },
    ],
    total_count: 4,
  },
  users: {
    items: [
      {
        id: '1',
        name: 'Usercode',
        cards_count: 17,
        description: 'Frontend Lead at Yandex Music, Saint-Petersburg, Russia',
      },
      {
        id: '2',
        name: 'Fixit',
        cards_count: 1,
        description: 'Frontend Lead at Yandex Music, Saint-Petersburg, Russia',
      },
      {
        id: '3',
        name: 'JSMagister',
        cards_count: 346,
        description: 'Frontend Lead at Yandex Music, Saint-Petersburg, Russia',
      },
      {
        id: '4',
        name: 'Mammy',
        cards_count: 0,
        description: 'Frontend Lead at Yandex Music, Saint-Petersburg, Russia',
      },
    ],
    total_count: 4,
  },
};
const test2Response: SearchContract = {
  cards: {
    items: [
      {
        id: 5,
        author: { username: 'author 5' },
        content: 'content 5',
        title: 'title 5',
        updatedAt: '05:03 03.01.2',
      },
      {
        id: 6,
        author: { username: 'author 6' },
        content: 'content 6',
        title: 'title 6',
        updatedAt: '05:03 03.01.2',
      },
      {
        id: 7,
        author: { username: 'author 7' },
        content: 'content 7',
        title: 'title 7',
        updatedAt: '05:03 03.01.2',
      },
      {
        id: 8,
        author: { username: 'author 8' },
        content: 'content 8',
        title: 'title 8',
        updatedAt: '05:03 03.01.2',
      },
    ],
    total_count: 4,
  },
  users: {
    items: [
      {
        id: '5',
        name: 'Test',
        cards_count: 17,
        description: 'Frontend Lead at Yandex Music, Saint-Petersburg, Russia',
      },
      {
        id: '6',
        name: 'EngLangtest',
        cards_count: 2,
        description: 'Frontend Lead at Yandex Music, Saint-Petersburg, Russia',
      },
      {
        id: '7',
        name: 'Sylvanas Windrunner Test Dominating',
        cards_count: 346,
        description: 'Frontend Lead at Yandex Music, Saint-Petersburg, Russia',
      },
      {
        id: '8',
        name: 'LangTestQweTest',
        cards_count: 7,
        description: 'Frontend Lead at Yandex Music, Saint-Petersburg, Russia',
      },
    ],
    total_count: 4,
  },
};
