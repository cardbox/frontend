import type { EditorValue } from '@cardbox/editor';

// Экспортируем отдельно, чтобы могли обращаться к типу, не зная, про реализацию (Editor)
export type CardContent = EditorValue;

export interface Card {
  id: string;
  title: string;
  content: CardContent;
  createdAt: string;
  updatedAt: string;
  author: User;
  tags: string[];
}

export interface Social {
  type: string;
  link: string;
  nickname: string;
}

export interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  // FIXME: resolve to Card[]
  cards: string[];
  // FIXME: resolve to Card[]
  favorites: string[];
  socials: Social[];
  work?: string;
}
