import type { Card, User } from '../types';
// NOTE: По сути будет использоваться только на клиенте, поэтому импорчу напрямую
import { requestClient } from '../request/client';

// FIXME:
//  Удалю модуль позднее, после генерации через OpenApi
//  Но для этого надо поправить саму схему

// TODO: bind with /api/request
// TODO: autogen later by openapi-generator

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type CardListParams = {
  search?: string;
  authorId?: string;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type CardCreateParams = Pick<Card, 'title' | 'content' | 'tags'>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type CardUpdateParams = Partial<
  Pick<Card, 'title' | 'content' | 'tags'>
> & {
  cardId: string;
};

export const cards = {
  list(params?: CardListParams) {
    return requestClient<{ cards: Card[] }>({
      path: '/cards.list',
      method: 'POST',
      body: params,
    });
  },
  get(cardId: string) {
    return requestClient<{ card: Card | null }>({
      path: '/cards.get',
      method: 'POST',
      body: { cardId },
    });
  },
  create(payload: CardCreateParams) {
    return requestClient({
      path: '/cards.create',
      method: 'POST',
      body: payload,
    });
  },
  update(payload: CardUpdateParams) {
    return requestClient({
      path: '/cards.update',
      method: 'POST',
      body: payload,
    });
  },
  delete(cardId: string) {
    return requestClient({
      path: '/cards.delete',
      method: 'POST',
      body: { cardId },
    });
  },
};

export const users = {
  viewer() {
    return requestClient<{ user: User }>({
      path: '/users.viewer',
      method: 'POST',
    });
  },
  get(username: string) {
    return requestClient<{ user: User | null }>({
      path: '/users.get',
      method: 'POST',
      body: { username },
    });
  },
};

export const search = {
  results(query: string) {
    return requestClient<{ cards: Card[]; users: User[] }>({
      path: '/search.results',
      method: 'POST',
      body: { query },
    });
  },
};
