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
  cards: Card[];
  favorites: Card[];
  socials: {
    github?: string;
    devto?: string;
    twitter?: string;
  };
  work?: string;
}
