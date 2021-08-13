import type { User } from '@box/api';
import { createEvent, createStore } from 'effector-root';
import { internalApi } from '@box/api';

export const $currentUser = createStore<User | null>(null);

// FIXME: temp solution
export const $usersMap = createStore<Record<string, User>>({});

export const updateMap = createEvent<User[]>();

$currentUser.on(internalApi.usersGet.doneData, (_, { answer }) => answer.user);

$usersMap.on(updateMap, (state, nextUsers) => {
  // FIXME: no deep
  const prevState = { ...state };
  const nextState = nextUsers.reduce(
    (acc, user) => ({ ...acc, [user.id]: user }),
    prevState,
  );
  return nextState;
});
