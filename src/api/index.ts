/* eslint-disable unicorn/no-nested-ternary */
import faker from 'faker';
import { createEffect } from 'effector-root';

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

function createUser(id = faker.random.uuid()): User {
  return {
    id,
    type: 'user',
    displayName: `${faker.name.firstName()} ${faker.name.lastName()}`,
    active: true,
    avatarUrl: faker.image.avatar(),
  };
}

const users = createList(3, createUser);

const me = faker.random.arrayElement(users);

interface SessionMeGet {
  user: User;
}

export const sessionMeGet = createEffect<void, Ok<SessionMeGet>>(async () =>
  ok({
    user: me,
  }),
);

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

const createCard = (id = faker.random.uuid()): Card => {
  const createdAt = faker.date.past(0).toISOString();
  return {
    id,
    type: 'card',
    title: faker.lorem.sentence(),
    previewContent: faker.lorem.paragraphs(2),
    content: faker.lorem.paragraphs(6),
    updatedAt: faker.date.past(0, createdAt).toISOString(),
    createdAt,
    owner: faker.random.arrayElement(users),
    savedCount: faker.random.number({ min: 0, max: 10 }),
  };
};

function createList<T>(count: number, creator: () => T): T[] {
  return Array.from({ length: count }, () => creator());
}

const cards = createList(10, createCard);

interface CardsLatestGet {
  cards: Card[];
}

export const cardsLatestGet = createEffect<void, Ok<CardsLatestGet>>(async () =>
  ok({
    cards: cards.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()),
  }),
);

interface CardGetById {
  card: Card | null;
}

export const cardGetById = createEffect<string, Ok<CardGetById>>(async (id) =>
  ok({
    card: cards.find((card) => card.id === id) ?? createCard(id),
  }),
);

// function randomCall(...list: Array<() => void>) {
//   return faker.random.arrayElement(list)();
// }
