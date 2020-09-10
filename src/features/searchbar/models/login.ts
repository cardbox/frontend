import { authorizeFx } from 'features/session';
import { createEvent, forward } from 'effector-root';

type ButtonClick = React.MouseEvent<HTMLButtonElement>;

export const loginClicked = createEvent<ButtonClick>();

forward({ from: loginClicked, to: authorizeFx });
