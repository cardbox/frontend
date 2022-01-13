import { createEvent, createStore } from 'effector';

import type { User } from '@box/shared/api';

// FIXME: temp solution
export const $usersMap = createStore<Record<string, User>>({});

export const updateMap = createEvent<User[]>();

$usersMap.on(updateMap, (state, nextUsers) => {
  // FIXME: no deep
  const prevState = { ...state };
  const nextState = nextUsers.reduce((acc, user) => ({ ...acc, [user.id]: user }), prevState);
  return nextState;
});
