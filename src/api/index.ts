/* eslint-disable unicorn/no-nested-ternary */
import faker from 'faker';
import { createEffect } from 'effector-root';

interface Ok<T> {
  status: 'ok';
  answer: T;
}

const ok = <T>(answer: T): Ok<T> => ({ status: 'ok', answer });

export interface Card {
  id: string;
  title: string;
  previewContent: string;
  content: string;
  // ISO8601 with UTC timezone
  updatedAt: string;
  createdAt: string;
}

const createCard = (id = faker.random.uuid()): Card => {
  const createdAt = faker.date.past(0).toISOString();
  return {
    id,
    title: faker.lorem.sentence(),
    previewContent: faker.lorem.paragraphs(2),
    content: faker.lorem.paragraphs(6),
    updatedAt: faker.date.past(0, createdAt).toISOString(),
    createdAt,
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
