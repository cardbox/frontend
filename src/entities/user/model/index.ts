import { createEvent, createStore } from 'effector';

import type { User } from '@box/shared/api';

export const $usersCache = createStore<{ map: Record<string, User> }>({ map: {} });

export const addUsersToCache = createEvent<User[]>();

$usersCache.on(addUsersToCache, ({ map }, nextUsers) => {
  nextUsers.forEach((user) => {
    map[user.id] = user;
  });
  return { map };
});
