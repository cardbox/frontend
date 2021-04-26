import { Scope, allSettled } from 'effector/fork';
import { createBrowserHistory } from 'history';
import { createEvent, createStore, merge } from 'effector-root';

export const history = process.env.BUILD_TARGET === 'client' ? createBrowserHistory() : null;

export const $lastPushed = createStore('');

export interface HistoryChange {
  pathname: string;
  hash: string;
  search: string;
  action: 'PUSH' | 'POP' | 'REPLACE';
}
export const historyChanged = createEvent<HistoryChange>();

export const historyPush = createEvent<string>();
export const historyReplace = createEvent<string>();

export function historyInit(scope: Scope) {
  if (process.env.BUILD_TARGET === 'client') {
    historyPush.watch((url) => history?.push(url));
    historyReplace.watch((url) => history?.replace(url));

    if (history)
      history.listen(async ({ pathname, search, hash }, action) => {
        await allSettled(historyChanged, { scope, params: { pathname, search, hash, action } });
      });
  }
}

if (process.env.BUILD_TARGET === 'server') {
  const historyUpdate = merge([historyPush, historyReplace]);
  $lastPushed.on(historyUpdate, (_, url) => url);
}
