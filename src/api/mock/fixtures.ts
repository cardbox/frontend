import { getValueNode } from '@box/lib/editor';

import type { Card, User } from '../types';

const stubCards = (amount: number) => new Array(amount).fill('-1');

// NOTE: preudo "uuid" for id property
export const userSova: User = {
  id: '1',
  username: 'sergeysova',
  firstName: 'Sergey',
  lastName: 'Sova',
  socials: [
    {
      type: 'github',
      link: 'https://github.com/sergeysova',
      nickname: 'sergeysova',
    },
  ],
  bio: '🦀 Rustacean, Frontender, Podcaster 🔍 @howtocards @accesso-app',
  work: 'red_mad_robot',
  avatar: 'https://avatars.githubusercontent.com/u/5620073?v=4',
  cards: stubCards(242),
  favorites: stubCards(1900),
};

export const userEvgeny: User = {
  id: '2',
  username: 'risenforces',
  firstName: 'Evgeny',
  lastName: 'Zakharov',
  socials: [
    {
      type: 'github',
      link: 'https://github.com/risenforces',
      nickname: 'risenforces',
    },
  ],
  bio: 'Front-end developer (React.js)',
  work: 'risenforces',
  avatar: 'https://avatars.githubusercontent.com/u/35740512?v=4',
  cards: stubCards(26),
  favorites: stubCards(60),
};

export const userIlya: User = {
  id: '3',
  username: 'martis-git',
  firstName: 'Ilya',
  lastName: 'Azin',
  socials: [
    {
      type: 'github',
      link: 'https://github.com/martis-git',
      nickname: 'martis-git',
    },
  ],
  bio: 'design.code @feature-sliced',
  work: 'Yandex',
  avatar: 'https://avatars.githubusercontent.com/u/42924400?v=4',
  cards: stubCards(42),
  favorites: stubCards(190),
};

export const userOleg: User = {
  id: '4',
  username: 'OlegBrony',
  firstName: 'Oleg',
  lastName: 'Brony',
  socials: [
    {
      type: 'github',
      link: 'https://github.com/OlegBrony',
      nickname: 'OlegBrony',
    },
  ],
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/19880334?v=4',
  cards: stubCards(19),
  favorites: stubCards(20),
};

export const userDmitry: User = {
  id: '5',
  username: 'dmi-ch',
  firstName: 'Dmitriy',
  lastName: 'Chikhanov',
  socials: [
    {
      type: 'github',
      link: 'https://github.com/dmi-ch',
      nickname: 'dmi-ch',
    },
  ],
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/5101606?v=4',
  cards: stubCards(4),
  favorites: stubCards(20),
};

export const userKirill: User = {
  id: '6',
  username: 'Drevoed',
  firstName: 'Kirill',
  lastName: 'Mironov',
  socials: [
    {
      type: 'github',
      link: 'https://github.com/Drevoed',
      nickname: 'Drevoed',
    },
  ],
  bio: 'Proud son of the Motherland, also known as the Inverted Netherlands.',
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/53709100?v=4',
  cards: stubCards(30),
  favorites: stubCards(23),
};

export const userAlex: User = {
  id: '7',
  username: 'asvtsv',
  firstName: 'Alexander',
  lastName: 'Sivtsov',
  socials: [
    {
      type: 'github',
      link: 'https://github.com/asvtsv',
      nickname: 'asvtsv',
    },
  ],
  bio: 'Cherry-picky and into master :)',
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/9406938?v=4',
  cards: stubCards(20),
  favorites: stubCards(8),
};

export const userAnton: User = {
  id: '8',
  username: 'antonmazhuto',
  firstName: 'Anton',
  lastName: 'Mazhuto',
  socials: [
    {
      type: 'github',
      link: 'https://github.com/antonmazhuto',
      nickname: 'antonmazhuto',
    },
  ],
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/36848395?v=4',
  cards: stubCards(20),
  favorites: stubCards(1),
};

export const userIrina: User = {
  id: '10',
  username: 'Irinaristova',
  firstName: 'Irina',
  lastName: 'Aristova',
  socials: [
    {
      type: 'github',
      link: 'https://github.com/Irinaristova',
      nickname: 'Irinaristova',
    },
  ],
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/38761239?v=4',
  cards: stubCards(3),
  favorites: stubCards(2),
};

export const viewer: User = {
  id: '100',
  username: 'LangCreator',
  socials: [
    {
      type: 'github',
      link: 'https://github.com/langcreator',
      nickname: 'langcreator',
    },
  ],
  work: 'Frontend Lead at Yandex Music Saint-Petersburg, Russia',
  avatar:
    'https://images.pexels.com/photos/2927811/pexels-photo-2927811.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  cards: ['1', '3', '5'],
  favorites: ['2', '4'],
};

export const users: User[] = [
  userSova,
  userEvgeny,
  userIlya,
  userOleg,
  userDmitry,
  userKirill,
  userAlex,
  userAnton,
  userIrina,
];

// NOTE: preudo "uuid" for id property
export const cards: Card[] = [
  {
    id: '1',
    title: `Manage map or Set in effector store`,
    content: getValueNode(
      `Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)`,
    ),
    author: viewer,
    createdAt: '2021-01-03T05:03:00.000Z',
    updatedAt: '2021-01-03T12:34:00.000Z',
    tags: [],
  },
  {
    id: '2',
    title: `Effector: sample vs forward, Effector: sample vs forward`,
    content: getValueNode(
      `Sample: This method can be used for linking two nodes, resulting the third one, which will fire only upon clock node trigger.\nForward: Method to create connection between units in a declarative way. Sends updates from one set of units to another`,
    ),
    author: viewer,
    createdAt: '2021-01-04T05:03:00.000Z',
    updatedAt: '2021-01-04T12:34:00.000Z',
    tags: [],
  },
  {
    id: '3',
    title: `Effects sequence, Effects sequence, Effects sequence`,
    content:
      getValueNode(`We'll need it when second request to the server requires resolved data from the first one
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
    `),
    author: viewer,
    createdAt: '2021-01-05T05:03:00.000Z',
    updatedAt: '2021-01-05T12:34:00.000Z',
    tags: [],
  },
  {
    id: '4',
    title: `Effector: Domain usage`,
    content:
      getValueNode(`Domain is a namespace for your events, stores and effects.
    Domain can subscribe to event, effect, store or nested domain creation with onCreateEvent, onCreateStore, onCreateEffect, onCreateDomain methods.
    It is useful for logging or other side effects.`),
    author: viewer,
    createdAt: '2021-01-06T05:03:00.000Z',
    updatedAt: '2021-01-06T12:34:00.000Z',
    tags: [],
  },
  {
    id: '5',
    title: `Stop using Effector`,
    content:
      getValueNode(`Effector is a brand new reactive state manager. Its ambitious team aims to solve all the problems that existing solutions have. Writing the core of the library from scratch took several attempts across six months, and recently the team released the first stable release.

    In this article, I will show why I prefer using Effector for my new projects instead of other state managers. Let's get started with the Effector API.`),
    author: viewer,
    createdAt: '2021-01-07T05:03:00.000Z',
    updatedAt: '2021-01-07T12:34:00.000Z',
    tags: [],
  },
];
