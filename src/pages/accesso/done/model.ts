import { authFinishFx } from 'api/accesso';
import { createStart } from 'lib/page-routing';
import { createStore, forward, restore, sample } from 'effector-root';
import { delay } from 'patronum/delay';
import { historyChanged, historyReplace } from 'features/navigation';
import { paths } from 'pages/paths';
import { postpone } from 'lib/postpone';
import { status } from 'patronum/status';

export const pageReady = createStart();

const authorizeRequestDone = pageReady.map(({ query }) => ({
  state: query.state,
  code: query.code,
}));

const $queryState = restore(
  pageReady.map((data) => data.query.state),
  '',
);

export const $userName = createStore({ firstName: '', lastName: '' });

export const $status = status({
  effect: authFinishFx,
  defaultValue: 'pending',
});

forward({
  from: authorizeRequestDone,
  to: historyReplace.prepend(paths.accessoDone),
});

const paramsRemoved = delay({ source: authorizeRequestDone, timeout: 1 });

forward({
  from: paramsRemoved,
  to: authFinishFx.prepend(({ code }) => ({ authorizationCode: code })),
});

$userName.on(authFinishFx.doneData, (_, { userInfo }) => userInfo);

postpone({
  source: sample($queryState, authFinishFx.done),
  target: historyReplace,
  delay: 3000,
  abort: historyChanged,
});
