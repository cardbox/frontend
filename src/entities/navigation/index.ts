import { createEvent, createStore } from 'effector';
import { createBrowserHistory, createMemoryHistory, History } from 'history';

import { env } from '@box/shared/config';

export const history = env.BUILD_ON_CLIENT ? createBrowserHistory() : createMemoryHistory();

export const $redirectTo = createStore('');

// Used in some cases
export const historyPush = createEvent<string>();

function attachEvents<T extends History>(history: T): T {
  historyPush.watch((url) => history.push(url));
  return history;
}

export function createClientHistory() {
  return attachEvents(createBrowserHistory());
}

export function createServerHistory(path: string) {
  return createMemoryHistory();
  // use createWatch
  // return attachEvents(createMemoryHistory({ initialEntries: [path] }));
}
