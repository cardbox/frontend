import { $session, authorizeFinishFx } from 'features/session';
import { createStart } from 'lib/page-routing';
import { delay } from 'patronum/delay';
import { forward, restore, sample } from 'effector-root';
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

export const $userName = $session;

export const $status = status({
  effect: authorizeFinishFx,
  defaultValue: 'pending',
});

// Remove query parameters
forward({
  from: authorizeRequestDone,
  to: historyReplace.prepend(paths.accessoDone),
});
const paramsRemoved = delay({ source: authorizeRequestDone, timeout: 1 });

forward({ from: paramsRemoved, to: authorizeFinishFx });

postpone({
  source: sample($queryState, authorizeFinishFx.done),
  delay: 1,
  target: historyReplace,
  abort: historyChanged,
});
