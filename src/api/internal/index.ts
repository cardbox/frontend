import type { Card, User } from '../types';
// NOTE: По сути будет использоваться только на клиенте, поэтому импорчу напрямую
import { requestClient } from '../request/client';

// FIXME: Удалю модуль позднее, после генерации через OpenApi
// Но для этого надо поправить саму схему

// TODO: bind with /api/request
// TODO: autogen later by openapi-generator

export interface CardListParams {
  search?: string;
  authorId?: string;
}

export interface CardCreateParams {
  title: string;
  content: string;
  tags: string[];
}

export interface CardUpdateParams {
  cardId: string;
  title?: string;
  content?: string;
  tags?: string[];
}

export const cards = {
  list(params?: CardListParams) {
    return requestClient<{ cards: Card[] }>({
      path: '/cards.list',
      method: 'POST',
      body: params as Record<string, unknown>,
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
      body: (payload as unknown) as Record<string, unknown>,
    });
  },
  update(payload: CardUpdateParams) {
    return requestClient({
      path: '/cards.update',
      method: 'POST',
      body: (payload as unknown) as Record<string, unknown>,
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
