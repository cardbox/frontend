import React from 'react';
import styled from 'styled-components';

type ButtonTheme = 'primary' | 'secondary' | 'danger' | 'icon';
type ButtonVariant = 'text' | 'outlined' | 'solid';

// FIXME:
interface Props {
  theme?: ButtonTheme;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  // FIXME:
  ref?: any;
}

interface Compounds {
  Group: typeof Group;
}

/**
 * Button
 * @see https://ant.design/components/button
 * @see https://woly.sova.dev/woly/atoms/button
 * @see https://material-ui.com/components/buttons
 */
export const Button: React.FC<Props> & Compounds = ({
  theme = 'primary',
  variant = 'solid',
  icon,
  className,
  onClick,
  type,
  disabled,
  children,
}) => {
  return (
    <ButtonStyled
      data-theme={theme}
      data-variant={variant}
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      children={children}
    />
  );
};

// FIXME: move outline as boolean

const ButtonStyled = styled.button<{
  'data-theme': ButtonTheme;
  'data-variant': ButtonVariant;
}>`
  --base-color: var(--wizard500);
  --text-color: var(--bnw0);

  align-items: center;
  border: 1px solid var(--base-color);
  background-color: var(--base-color);
  color: var(--text-color);
  border-radius: 3px;

  display: flex;
  font-size: 1rem;
  height: 42px;
  outline: 0;
  padding: 0 1.125rem;
  transition: 0.25s;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.5;
  }

  &[data-theme='primary'] {
    --base-color: var(--wizard500);
  }

  &[data-theme='danger'] {
    --base-color: var(--notice500);
  }

  &[data-theme='secondary'] {
    --base-color: var(--bnw250);
  }

  &[data-theme='danger'] {
    --base-color: var(--notice500);
  }

  // FIXME: implement as Prop
  &[data-theme='icon'] {
    background-color: #fff;
    color: currentColor;
    border-color: #eeeef1;
    padding: 0;
    min-width: 42px;
    justify-content: center;

    transition: background-color 0.5s, box-shadow 0.5s;
    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }

    &:focus {
      box-shadow: #969696 0 0 3px, #c3c3c3 0 0 15px;
    }
  }

  &[data-variant='outlined'] {
    --text-color: var(--base-color);
    background: transparent;
  }

  &[data-variant='text'] {
    --text-color: var(--base-color);
    background: transparent;
    border-color: transparent;
  }
`;

const Group = styled.div`
  display: flex;
  button + button {
    margin-left: 12px;
  }
`;

Button.Group = Group;
