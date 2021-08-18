import { createBrowserHistory } from 'history';
import { createEvent, createStore, merge } from 'effector-root';

export interface HistoryChange {
  pathname: string;
  hash: string;
  search: string;
  action: 'PUSH' | 'POP' | 'REPLACE';
}

export const history =
  process.env.BUILD_TARGET === 'client' ? createBrowserHistory() : null;

export const $redirectTo = createStore('');

export const historyPush = createEvent<string>();
export const historyPushParams = createEvent<{ search: string }>();
export const historyReplace = createEvent<string>();

export const historyChanged = createEvent<HistoryChange>();

if (process.env.BUILD_TARGET === 'client') {
  historyPush.watch((url) => history?.push(url));
  historyReplace.watch((url) => history?.replace(url));
  historyPushParams.watch((params) => history?.push(params));
  history?.listen(({ pathname, search, hash }, action) => {
    historyChanged({ pathname, search, hash, action });
  });
} else {
  const historyUpdate = merge([historyPush, historyReplace]);
  $redirectTo.on(historyUpdate, (_, url) => url);
}

export const navigationModel = {
  historyPush,
  historyReplace,
};
