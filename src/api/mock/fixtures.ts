import type { Card, User } from '../types';

// NOTE: preudo "uuid" for id property
export const viewer: User = {
  id: '1',
  username: 'sergeysova',
  firstName: 'Sergey',
  lastName: 'Sova',
  socials: {},
  bio: '🦀 Rustacean, Frontender, Podcaster 🔍 @howtocards @accesso-app',
  work: 'red_mad_robot',
  avatar: 'https://avatars.githubusercontent.com/u/5620073?v=4',
  cards: [],
  favorites: [],
};

export const users: User[] = [viewer];

// NOTE: preudo "uuid" for id property
export const cards: Card[] = [
  {
    id: '1',
    title: `Manage map or Set in effector store. Manage map or Set in effector store. Manage map or Set in effector store.`,
    content: `Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)`,
    author: viewer,
    createdAt: '2021-01-03T05:03:00.000Z',
    updatedAt: '2021-01-03T12:34:00.000Z',
    tags: [],
  },
  {
    id: '2',
    title: `Manage map or Set in effector store`,
    content: `Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)`,
    author: viewer,
    createdAt: '2021-01-04T05:03:00.000Z',
    updatedAt: '2021-01-04T12:34:00.000Z',
    tags: [],
  },
  {
    id: '3',
    title: `Manage map or Set in effector store`,
    content: `Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)`,
    author: viewer,
    createdAt: '2021-01-05T05:03:00.000Z',
    updatedAt: '2021-01-05T12:34:00.000Z',
    tags: [],
  },
  {
    id: '4',
    title: `Manage map or Set in effector store. Manage map or Set in effector store. Manage map or Set in effector store.`,
    content: `Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)`,
    author: viewer,
    createdAt: '2021-01-06T05:03:00.000Z',
    updatedAt: '2021-01-06T12:34:00.000Z',
    tags: [],
  },
  {
    id: '5',
    title: `Manage map or Set in effector store. Manage map or Set in effector store. Manage map or Set in effector store.`,
    content: `Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)`,
    author: viewer,
    createdAt: '2021-01-07T05:03:00.000Z',
    updatedAt: '2021-01-07T12:34:00.000Z',
    tags: [],
  },
];
