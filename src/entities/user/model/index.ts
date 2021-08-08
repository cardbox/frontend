import type { User } from '@box/api';
import { createEffect, createStore } from 'effector-root';

export const getUserByNicknameFx = createEffect(async (username: string) => {
  // const response = await internalApi.users.get(username);
  // return response.body;
  return null;
});

export const $currentUser = createStore<User | null>(null).on(
  getUserByNicknameFx.doneData,
  (_, user) => user,
);
