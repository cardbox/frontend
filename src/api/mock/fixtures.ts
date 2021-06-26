import type { Card, User } from '../types';

// NOTE: preudo "uuid" for id property
export const userSova: User = {
  id: '1',
  username: 'sergeysova',
  firstName: 'Sergey',
  lastName: 'Sova',
  socials: { github: 'https://github.com/sergeysova' },
  bio: '🦀 Rustacean, Frontender, Podcaster 🔍 @howtocards @accesso-app',
  work: 'red_mad_robot',
  avatar: 'https://avatars.githubusercontent.com/u/5620073?v=4',
  cards: ['1', '2', '5'],
  favorites: ['3', '4'],
};

export const userEvgeny: User = {
  id: '2',
  username: 'risenforces',
  firstName: 'Evgeny',
  lastName: 'Zakharov',
  socials: { github: 'https://github.com/risenforces' },
  bio: 'Front-end developer (React.js)',
  work: 'risenforces',
  avatar: 'https://avatars.githubusercontent.com/u/35740512?v=4',
  cards: new Array(26).fill('-1'),
  favorites: new Array(60).fill('-1'),
};

export const userIlya: User = {
  id: '3',
  username: 'martis-git',
  firstName: 'Ilya',
  lastName: 'Azin',
  socials: { github: 'https://github.com/martis-git' },
  bio: 'Front-end developer (React.js)',
  work: 'Yandex',
  avatar: 'https://avatars.githubusercontent.com/u/42924400?v=4',
  cards: new Array(42).fill('-1'),
  favorites: new Array(190).fill('-1'),
};

export const userOleg: User = {
  id: '4',
  username: 'OlegBrony',
  firstName: 'Oleg',
  lastName: 'Brony',
  socials: { github: 'https://github.com/OlegBrony' },
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/19880334?v=4',
  cards: new Array(19).fill('-1'),
  favorites: new Array(20).fill('-1'),
};

export const userDmitry: User = {
  id: '5',
  username: 'dmi-ch',
  firstName: 'Dmitriy',
  lastName: 'Chikhanov',
  socials: { github: 'https://github.com/dmi-ch' },
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/5101606?v=4',
  cards: new Array(4).fill('-1'),
  favorites: new Array(120).fill('-1'),
};

export const userKirill: User = {
  id: '6',
  username: 'Drevoed',
  firstName: 'Kirill',
  lastName: 'Mironov',
  socials: { github: 'https://github.com/Drevoed' },
  bio: 'Proud son of the Motherland, also known as the Inverted Netherlands.',
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/53709100?v=4',
  cards: new Array(30).fill('-1'),
  favorites: new Array(23).fill('-1'),
};

export const userAlex: User = {
  id: '7',
  username: 'asvtsv',
  firstName: 'Alexander',
  lastName: '',
  socials: { github: 'https://github.com/asvtsv' },
  bio: 'Cherry-picky and into master :)',
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/9406938?v=4',
  cards: new Array(3).fill('-1'),
  favorites: new Array(8).fill('-1'),
};

export const userAnton: User = {
  id: '8',
  username: 'antonmazhuto',
  firstName: 'Anton',
  lastName: 'Mazhuto',
  socials: { github: 'https://github.com/antonmazhuto' },
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/36848395?v=4',
  cards: new Array(20).fill('-1'),
  favorites: new Array(1).fill('-1'),
};

export const viewer = userSova;

export const users: User[] = [
  userSova,
  userEvgeny,
  userIlya,
  userOleg,
  userDmitry,
  userKirill,
  userAlex,
  userAnton,
];

// NOTE: preudo "uuid" for id property
export const cards: Card[] = [
  {
    id: '1',
    title: `Manage map or Set in effector store`,
    content: `Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)`,
    author: viewer,
    createdAt: '2021-01-03T05:03:00.000Z',
    updatedAt: '2021-01-03T12:34:00.000Z',
    tags: [],
  },
  {
    id: '2',
    title: `Effector: sample vs forward`,
    content: `Sample: This method can be used for linking two nodes, resulting the third one, which will fire only upon clock node trigger.\nForward: Method to create connection between units in a declarative way. Sends updates from one set of units to another`,
    author: viewer,
    createdAt: '2021-01-04T05:03:00.000Z',
    updatedAt: '2021-01-04T12:34:00.000Z',
    tags: [],
  },
  {
    id: '3',
    title: `Effects sequence`,
    content: `We'll need it when second request to the server requires resolved data from the first one
    \`\`\`
    import ReactDOM from 'react-dom'

    const getAllId = createEffect({handler: async () => [1, 2, 3]})
    
    const getPostsByIds = createEffect({
      handler: ids => Promise.all(ids.map(
        async id => {
          const res = await fetch(
            \`https://jsonplaceholder.typicode.com/posts?userId=\${id}\`
          )
          const posts = await res.json()
          return {id, posts}
        }
      ))
    })
    
    forward({
      from: getAllId.done.map(({result}) => result),
      to: getPostsByIds,
    })
    
    const postGroups = createStore([])
      .on(getPostsByIds.done, (list, {result}) => [
        ...list,
        ...result,
      ])
    \`\`\`

    - See: https://effector.dev/docs/introduction/examples#effects-sequence
    `,
    author: viewer,
    createdAt: '2021-01-05T05:03:00.000Z',
    updatedAt: '2021-01-05T12:34:00.000Z',
    tags: [],
  },
  {
    id: '4',
    title: `Effector: Domain usage`,
    content: `Domain is a namespace for your events, stores and effects.
    Domain can subscribe to event, effect, store or nested domain creation with onCreateEvent, onCreateStore, onCreateEffect, onCreateDomain methods.
    It is useful for logging or other side effects.`,
    author: viewer,
    createdAt: '2021-01-06T05:03:00.000Z',
    updatedAt: '2021-01-06T12:34:00.000Z',
    tags: [],
  },
  {
    id: '5',
    title: `Effector live comparsion`,
    content: `Effector is a brand new reactive state manager. Its ambitious team aims to solve all the problems that existing solutions have. Writing the core of the library from scratch took several attempts across six months, and recently the team released the first stable release.

    In this article, I will show why I prefer using Effector for my new projects instead of other state managers. Let's get started with the Effector API.`,
    author: viewer,
    createdAt: '2021-01-07T05:03:00.000Z',
    updatedAt: '2021-01-07T12:34:00.000Z',
    tags: [],
  },
];
