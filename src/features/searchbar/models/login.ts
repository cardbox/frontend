import { $sessionPending, authorizeFx } from 'features/session';
import { createEvent, createStore } from 'effector-root';
import { historyChanged } from 'features/navigation';
import { postpone } from 'lib/postpone';
import { some } from 'patronum/some';

type ButtonClick = React.MouseEvent<HTMLButtonElement>;

export const loginClicked = createEvent<ButtonClick>();
const $loginPending = createStore(false);

export const $pending = some({
  stores: [$sessionPending, $loginPending],
  predicate: true,
});

$loginPending.on(loginClicked, () => true);

// Nothing more, because authorizeFx redirects to accesso URL
postpone({
  source: loginClicked,
  target: authorizeFx.prepend(() => {}),
  delay: 100,
  abort: historyChanged,
});
