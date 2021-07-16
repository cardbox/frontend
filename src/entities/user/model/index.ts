import type { User } from '@box/api';
import { createEffect, createStore } from 'effector-root';
import { internalApi } from '@box/api';

export const getUserByNicknameFx = createEffect(async (username: string) => {
  const response = await internalApi.users.get(username);
  return response.body;
});

export const $currentUser = createStore<User | null>(null).on(
  getUserByNicknameFx.doneData,
  (_, payload) => payload.user,
);
