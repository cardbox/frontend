import { getValueNode } from '@box/shared/lib/editor';

import type { Card, User } from '../types';

// FIXME: pseudo-uuid generation (refine later or use another solution)
const stubId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// FIXME: Поправить позднее роли

export const userSova: User = {
  id: stubId(),
  username: 'sergeysova',
  firstName: 'Sergey',
  lastName: 'Sova',
  socials: [
    {
      id: stubId(),
      type: 'github',
      link: 'https://github.com/sergeysova',
      username: 'sergeysova',
    },
  ],
  bio: '🦀 Rustacean, Frontender, Podcaster 🔍 @howtocards @accesso-app',
  work: 'red_mad_robot',
  avatar: 'https://avatars.githubusercontent.com/u/5620073?v=4',
  roles: undefined,
};

export const userEvgeny: User = {
  id: stubId(),
  username: 'risenforces',
  firstName: 'Evgeny',
  lastName: 'Zakharov',
  socials: [
    {
      id: stubId(),
      type: 'github',
      link: 'https://github.com/risenforces',
      username: 'risenforces',
    },
  ],
  bio: 'Front-end developer (React.js)',
  work: 'risenforces',
  avatar: 'https://avatars.githubusercontent.com/u/35740512?v=4',
  roles: undefined,
};

export const userIlya: User = {
  id: stubId(),
  username: 'martis-git',
  firstName: 'Ilya',
  lastName: 'Azin',
  socials: [
    {
      id: stubId(),
      type: 'github',
      link: 'https://github.com/martis-git',
      username: 'martis-git',
    },
  ],
  bio: 'design.code @feature-sliced',
  work: 'Yandex',
  avatar: 'https://avatars.githubusercontent.com/u/42924400?v=4',
  roles: undefined,
};

export const userOleg: User = {
  id: stubId(),
  username: 'OlegBrony',
  firstName: 'Oleg',
  lastName: 'Brony',
  socials: [
    {
      id: stubId(),
      type: 'github',
      link: 'https://github.com/OlegBrony',
      username: 'OlegBrony',
    },
  ],
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/19880334?v=4',
  bio: undefined,
  roles: undefined,
};

export const userDmitry: User = {
  id: stubId(),
  username: 'dmi-ch',
  firstName: 'Dmitriy',
  lastName: 'Chikhanov',
  socials: [
    {
      id: stubId(),
      type: 'github',
      link: 'https://github.com/dmi-ch',
      username: 'dmi-ch',
    },
  ],
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/5101606?v=4',
  bio: undefined,
  roles: undefined,
};

export const userKirill: User = {
  id: stubId(),
  username: 'Drevoed',
  firstName: 'Kirill',
  lastName: 'Mironov',
  socials: [
    {
      id: stubId(),
      type: 'github',
      link: 'https://github.com/Drevoed',
      username: 'Drevoed',
    },
  ],
  bio: 'Proud son of the Motherland, also known as the Inverted Netherlands.',
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/53709100?v=4',
  roles: undefined,
};

export const userAlex: User = {
  id: stubId(),
  username: 'asvtsv',
  firstName: 'Alexander',
  lastName: 'Sivtsov',
  socials: [
    {
      id: stubId(),
      type: 'github',
      link: 'https://github.com/asvtsv',
      username: 'asvtsv',
    },
  ],
  bio: 'Cherry-picky and into master :)',
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/9406938?v=4',
  roles: undefined,
};

export const userAnton: User = {
  id: stubId(),
  username: 'antonmazhuto',
  firstName: 'Anton',
  lastName: 'Mazhuto',
  socials: [
    {
      id: stubId(),
      type: 'github',
      link: 'https://github.com/antonmazhuto',
      username: 'antonmazhuto',
    },
  ],
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/36848395?v=4',
  bio: undefined,
  roles: undefined,
};

export const userIrina: User = {
  id: stubId(),
  username: 'Irinaristova',
  firstName: 'Irina',
  lastName: 'Aristova',
  socials: [
    {
      id: stubId(),
      type: 'github',
      link: 'https://github.com/Irinaristova',
      username: 'Irinaristova',
    },
  ],
  work: '',
  avatar: 'https://avatars.githubusercontent.com/u/38761239?v=4',
  bio: undefined,
  roles: undefined,
};

export const viewer: User = {
  id: stubId(),
  username: 'LangCreator',
  firstName: 'Lang',
  lastName: 'Creator',
  socials: [
    {
      id: stubId(),
      type: 'github',
      link: 'https://github.com/langcreator',
      username: 'langcreator',
    },
  ],
  work: 'Frontend Lead at Yandex Music Saint-Petersburg, Russia',
  avatar:
    'https://images.pexels.com/photos/2927811/pexels-photo-2927811.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  bio: undefined,
  roles: undefined,
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
  viewer,
];

// NOTE: preudo "uuid" for id property
export const cards: Card[] = [
  {
    id: stubId(),
    title: `Manage map or Set in effector store`,
    content: getValueNode(
      `Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)`,
    ),
    summary: undefined,
    authorId: viewer.id,
    createdAt: '2021-01-03T05:03:00.000Z',
    updatedAt: '2021-01-03T12:34:00.000Z',
    tags: [],
  },
  {
    id: stubId(),
    title: `Effector: sample vs forward, Effector: sample vs forward`,
    content: getValueNode(
      `Sample: This method can be used for linking two nodes, resulting the third one, which will fire only upon clock node trigger.\nForward: Method to create connection between units in a declarative way. Sends updates from one set of units to another`,
    ),
    summary: undefined,
    authorId: viewer.id,
    createdAt: '2021-01-04T05:03:00.000Z',
    updatedAt: '2021-01-04T12:34:00.000Z',
    tags: [],
  },
  {
    id: stubId(),
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
    summary: undefined,
    authorId: viewer.id,
    createdAt: '2021-01-05T05:03:00.000Z',
    updatedAt: '2021-01-05T12:34:00.000Z',
    tags: [],
  },
  {
    id: stubId(),
    title: `Effector: Domain usage`,
    content: getValueNode(`Domain is a namespace for your events, stores and effects.
    Domain can subscribe to event, effect, store or nested domain creation with onCreateEvent, onCreateStore, onCreateEffect, onCreateDomain methods.
    It is useful for logging or other side effects.`),
    summary: undefined,
    authorId: viewer.id,
    createdAt: '2021-01-06T05:03:00.000Z',
    updatedAt: '2021-01-06T12:34:00.000Z',
    tags: [],
  },
  {
    id: stubId(),
    title: `Stop using Effector`,
    content:
      getValueNode(`Effector is a brand new reactive state manager. Its ambitious team aims to solve all the problems that existing solutions have. Writing the core of the library from scratch took several attempts across six months, and recently the team released the first stable release.

    In this article, I will show why I prefer using Effector for my new projects instead of other state managers. Let's get started with the Effector API.`),
    summary: undefined,
    authorId: viewer.id,
    createdAt: '2021-01-07T05:03:00.000Z',
    updatedAt: '2021-01-07T12:34:00.000Z',
    tags: [],
  },
];
