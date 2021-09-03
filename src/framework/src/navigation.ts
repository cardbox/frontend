import { Domain, merge, sample } from 'effector';
import { createBrowserHistory, createMemoryHistory } from 'history';

export interface HistoryChange {
  pathname: string;
  hash: string;
  search: string;
  action: 'PUSH' | 'POP' | 'REPLACE';
}

export function createNavigation(
  domain: Domain,
  { emitHistory = false, trackRedirects = false } = {},
) {
  const history = typeof document !== 'undefined' ? createBrowserHistory() : createMemoryHistory();

  const historyPush = domain.createEffect<string, void>(() => {});
  const historyPushSearch = domain.createEffect<string, void>(() => {});
  const historyReplace = domain.createEffect<string, void>(() => {});

  const historyChanged = domain.createEvent<HistoryChange>();

  const historyEmitCurrent = domain.createEvent();

  const $redirectTo = domain.createStore('');

  // do not actual change history, just trigger history changed with correct arguments
  sample({
    clock: historyEmitCurrent,
    fn: () =>
      ({
        action: 'REPLACE',
        hash: history.location.hash,
        pathname: history.location.pathname,
        search: history.location.search,
      } as HistoryChange),
    target: historyChanged,
  });

  if (emitHistory) {
    historyPush.use((url) => history.push(url));
    historyReplace.use((url) => history.replace(url));
    historyPushSearch.use((search) => history.push({ search }));

    history.listen(({ pathname, search, hash }, action) => {
      historyChanged({ pathname, search, hash, action });
    });
  }

  if (trackRedirects) {
    $redirectTo.on([historyPush, historyReplace], (_, url) => url);
    if (emitHistory) {
      $redirectTo.on(historyChanged, (_, { pathname, search }) => `${pathname}?${search}`);
    }
  }

  return {
    history,
    historyPush,
    historyPushSearch,
    historyReplace,
    historyChanged,
    historyEmitCurrent,
    $redirectTo,
  };
}
