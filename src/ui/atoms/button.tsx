import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '@box/lib/theme';

type ButtonTheme = 'primary' | 'secondary' | 'danger';
type ButtonVariant = 'text' | 'outlined' | 'solid';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: ButtonTheme;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  // FIXME: MutableRefObject not suit for forwardRef
  ref?: any;
};

/**
 * Button
 * @see https://ant.design/components/button
 * @see https://woly.sova.dev/woly/atoms/button
 * @see https://material-ui.com/components/buttons
 */
export const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      theme = 'primary',
      variant = 'solid',
      icon,
      type,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    return (
      <ButtonStyled
        data-theme={theme}
        data-variant={variant}
        data-squared={Boolean(icon && !children)}
        type={type}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...buttonProps}
      >
        {icon && <span>{icon}</span>}
        {children && <span>{children}</span>}
      </ButtonStyled>
    );
  },
);

const Themes = css`
  &[data-theme='primary'] {
    --base-color: var(${theme.palette.wizard500});
  }

  &[data-theme='danger'] {
    --base-color: var(${theme.palette.notice550});
  }

  &[data-theme='secondary'] {
    --base-color: var(${theme.palette.bnw750});
  }
`;

const Variants = css`
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

const ButtonStyled = styled.button<{
  'data-theme': ButtonTheme;
  'data-variant': ButtonVariant;
  'data-squared': boolean;
}>`
  --base-color: var(${theme.palette.wizard500});
  --text-color: var(${theme.palette.bnw1000});
  --size: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--base-color);
  background-color: var(--base-color);
  color: var(--text-color);
  height: var(--size);
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

  span + span {
    margin-left: 0.5rem;
  }

  &[data-squared='true'] {
    width: var(--size);
  }

  ${Themes}
  ${Variants}
`;

export const ButtonGroup = styled.div`
  display: flex;
  button + button {
    margin-left: 12px;
  }
`;
