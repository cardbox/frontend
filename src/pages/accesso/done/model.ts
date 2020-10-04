import { authFinishFx } from 'api/accesso';
import { createStart } from 'lib/page-routing';
import { createStore, forward, restore, sample } from 'effector-root';
import { historyReplace } from 'features/navigation';
import { postpone } from 'lib/postpone';
import { status } from 'patronum/status';

export const pageReady = createStart();

const authorizeRequestDone = pageReady.map(({ query }) => ({
  state: query.state,
  code: query.code,
}));
const $queryState = restore(
  authorizeRequestDone.map((q) => q.state),
  '',
);

export const $userName = createStore({ firstName: '', lastName: '' });

export const $status = status({
  effect: authFinishFx,
  defaultValue: 'pending',
});

forward({
  from: authorizeRequestDone,
  to: authFinishFx.prepend(({ code }) => ({ authorizationCode: code })),
});

$userName.on(authFinishFx.doneData, (_, { userInfo }) => userInfo);

postpone({
  source: sample($queryState, authFinishFx.done),
  target: historyReplace,
  delay: 3000,
});
