import type { User } from '@box/api';
import { createStore } from 'effector-root';
import { internalApi } from '@box/api';

export const $currentUser = createStore<User | null>(null);

$currentUser.on(internalApi.usersGet.doneData, (_, { answer }) => answer.user);
