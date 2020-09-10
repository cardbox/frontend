import { createEvent } from 'effector-root';

type ButtonClick = React.MouseEvent<HTMLButtonElement>;

export const loginClicked = createEvent<ButtonClick>();
