/* eslint-disable unicorn/no-nested-ternary */
import { createEffect } from 'effector-root';

import { Answer, requestFx } from './request';

interface Ok<T> {
  status: 'ok';
  answer: T;
}

const ok = <T>(answer: T): Ok<T> => ({ status: 'ok', answer });

export interface User {
  id: string;
  type: 'user';
  displayName: string;
  active: boolean;
  avatarUrl: string;
}

interface SessionMeGet {
  user: User;
}

export const sessionMeGet = createEffect<User, Ok<SessionMeGet>>(async (user) => {
  const res = await requestFx({ path: '/users/0', method: 'GET' });
  return ok({
    user: res.body as SessionMeGet['user'],
  });
});

export interface Card {
  id: string;
  type: 'card';
  title: string;
  previewContent: string;
  content: string;
  // ISO8601 with UTC timezone
  updatedAt: string;
  createdAt: string;
  owner: User;
  savedCount: number;
}

interface CardsLatestGet {
  cards: Card[];
}

export const cardsLatestGet = createEffect<void, Ok<CardsLatestGet>>(async () => {
  const cards = (await requestFx({
    path: '/cards',
    method: 'GET',
  })) as Answer<Card[]>;
  return ok({
    cards: cards.body.sort(
      (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
    ),
  });
});

interface CardGetById {
  card: Card | null;
}

export const cardGetById = createEffect<string, Ok<CardGetById>>(async (id) => {
  const cards = (await requestFx({
    path: '/cards/',
    method: 'GET',
  })) as Answer<Card[]>;
  return ok({
    card: cards.body.find((card) => card.id === id) ?? null,
  });
});

// function randomCall(...list: Array<() => void>) {
//   return faker.random.arrayElement(list)();
// }
