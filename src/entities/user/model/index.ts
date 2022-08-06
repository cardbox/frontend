import { createEvent, createStore } from 'effector';

import type { User } from '@box/shared/api';

export const $usersCache = createStore<{ map: Map<string, User> }>({ map: new Map() });

export const addUsersToCache = createEvent<User[]>();

$usersCache.on(addUsersToCache, ({ map }, nextUsers) => {
  nextUsers.forEach((user) => {
    map.set(user.id, user);
  });
  return { map };
});
