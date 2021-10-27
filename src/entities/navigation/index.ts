import { Scope, createEvent, createStore, merge, scopeBind } from 'effector';
import { createBrowserHistory } from 'history';
import { env } from '@box/shared/config';
import { logger } from '@box/shared/lib/logger';

export interface HistoryChange {
  pathname: string;
  hash: string;
  search: string;
  action: 'PUSH' | 'POP' | 'REPLACE';
}

export const history = env.BUILD_ON_CLIENT ? createBrowserHistory() : null;

export const $queryParams = createStore<Record<string, string>>({});

export const $redirectTo = createStore('');

export const historyPush = createEvent<string>();
export const historyPushParams = createEvent<{ search: string }>();
export const historyReplace = createEvent<string>();

export const historyChanged = createEvent<HistoryChange>();

$queryParams.on(historyChanged, ({ search }) =>
  Object.fromEntries(new URLSearchParams(search).entries()),
);

$queryParams.watch((params) => logger.info('query params', params));

export function initializeClientHistory(scope: Scope) {
  historyPush.watch((url) => history?.push(url));
  historyReplace.watch((url) => history?.replace(url));
  historyPushParams.watch((params) => history?.push(params));
  const boundHistoryChange = scopeBind(historyChanged, { scope });
  history?.listen(({ pathname, search, hash }, action) => {
    boundHistoryChange({ pathname, search, hash, action });
  });
}

export function initializeServerHistory() {
  const historyUpdate = merge([historyPush, historyReplace]);
  $redirectTo.on(historyUpdate, (_, url) => url);
}

export const navigationModel = {
  historyPush,
  historyReplace,
};
