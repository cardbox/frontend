import React from 'react';
import styled from 'styled-components';

type ButtonTheme =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'text'
  | 'icon'
  | 'default';
interface Props {
  theme?: ButtonTheme;
  icon?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  ref?: any;
}

interface Compounds {
  Group: typeof Group;
}

/**
 * Button
 * @see https://ant.design/components/button
 * @see https://woly.sova.dev/woly/atoms/button
 */
export const Button: React.FC<Props> & Compounds = ({
  theme = 'default',
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
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      children={children}
    />
  );
};

// FIXME: move outline as boolean

const ButtonStyled = styled.button<{ 'data-theme': ButtonTheme }>`
  align-items: center;
  border: 1px solid var(--wizard500);
  border-radius: 3px;

  display: flex;
  font-size: 1.125rem;
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

  /* Override hover/disabled carefully! */
  &[data-theme='default'] {
    background-color: transparent;
    color: var(--wizard500);
  }

  &[data-theme='primary'] {
    background-color: #4231ff;
    color: #ffffff;
  }

  &[data-theme='secondary'] {
    background-color: #f4f2f7;
    border-color: #f4f2f7;
    color: #000;
  }

  &[data-theme='outline'] {
    background-color: #ffffff;
    border: 1px solid #eeeef1;
    border-radius: 0.188rem;
    color: #000000;
  }

  &[data-theme='text'] {
    background-color: transparent;
    border-color: transparent;
    color: #1d1a23;
    font-size: 0.9375rem;
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
`;

const Group = styled.div`
  display: flex;
  button + button {
    margin-left: 12px;
  }
`;

Button.Group = Group;
