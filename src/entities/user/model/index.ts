import type { User } from '@box/api';
import { createEvent, createStore } from 'effector';

// FIXME: temp solution
export const $usersMap = createStore<Record<string, User>>({});

export const updateMap = createEvent<User[]>();

$usersMap.on(updateMap, (state, nextUsers) => {
  // FIXME: no deep
  const prevState = { ...state };
  const nextState = nextUsers.reduce(
    (acc, user) => ({ ...acc, [user.id]: user }),
    prevState,
  );
  return nextState;
});
