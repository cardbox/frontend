export interface Card {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  tags: string[];
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
  socials: {
    github?: string;
    devto?: string;
    twitter?: string;
  };
  work?: string;
}
