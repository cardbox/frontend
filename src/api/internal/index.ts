import axios from 'axios';

import type { Card, User } from '../types';

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
    return axios.post<{ cards: Card[] }>('/cards.list', params);
  },
  get(cardId: string) {
    return axios.post<{ card: Card | null }>('/cards.get', { cardId });
  },
  create(payload: CardCreateParams) {
    return axios.post('/cards.create', payload);
  },
  update(payload: CardUpdateParams) {
    return axios.post('/cards.update', payload);
  },
  delete(cardId: string) {
    return axios.post('/cards.delete', { cardId });
  },
};

export const users = {
  viewer() {
    return axios.post('/users.viewer');
  },
};

export const search = {
  results(query: string) {
    return axios.post<{ cards: Card[]; users: User[] }>('/search.results', {
      query,
    });
  },
};
