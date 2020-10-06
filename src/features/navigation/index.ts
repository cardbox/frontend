import { createBrowserHistory } from 'history';
import { createEvent, createStore, merge } from 'effector-root';

export const history =
  process.env.BUILD_TARGET === 'client' ? createBrowserHistory() : null;

export const $lastPushed = createStore('');

export const historyPush = createEvent<string>();
export const historyReplace = createEvent<string>();

export const historyChanged = createEvent();

if (process.env.BUILD_TARGET === 'client') {
  historyPush.watch((url) => history?.push(url));
  historyReplace.watch((url) => history?.replace(url));
  history?.listen(() => historyChanged());
} else {
  const historyUpdate = merge([historyPush, historyReplace]);
  $lastPushed.on(historyUpdate, (_, url) => url);
}
