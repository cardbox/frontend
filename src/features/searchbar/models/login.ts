import { authorizeFx } from 'features/session';
import { createEvent, createStore } from 'effector-root';
import { historyChanged } from 'features/navigation';
import { postpone } from 'lib/postpone';

type ButtonClick = React.MouseEvent<HTMLButtonElement>;

export const loginClicked = createEvent<ButtonClick>();
export const $pending = createStore(false);

$pending.on(loginClicked, () => true);

postpone({
  source: loginClicked,
  target: authorizeFx.prepend(() => {}),
  delay: 100,
  abort: historyChanged,
});
