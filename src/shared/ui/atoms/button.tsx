import React, { MutableRefObject } from 'react';
import styled, { css } from 'styled-components';

import { theme } from '@box/shared/lib/theme';

type ButtonTheme = 'primary' | 'secondary' | 'danger';
type ButtonVariant = 'text' | 'outlined' | 'solid';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: ButtonTheme;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  accented?: boolean;
  // FIXME: MutableRefObject not suit for forwardRef
  ref?: MutableRefObject<HTMLButtonElement>;
};

/**
 * Button
 * @see https://ant.design/components/button
 * @see https://woly.sova.dev/woly/atoms/button
 * @see https://material-ui.com/components/buttons
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      theme = 'primary',
      variant = 'solid',
      icon,
      type,
      accented = false,
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
        data-accented={accented}
        type={type}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...buttonProps}
        ref={ref}
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
    --base-color: var(${theme.palette.bnw0});
  }
`;

const Variants = css`
  &[data-variant='outlined'] {
    --text-color: var(--base-color);
    background: var(${theme.palette.bnw1000});
    border-color: var(--base-color, ${theme.palette.bnw900});
  }

  &[data-variant='text'] {
    --text-color: var(${theme.palette.bnw0});
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

  font-size: 1rem;
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

  ${Themes}
  ${Variants}

  &[data-squared='true'] {
    width: 48px;
    height: var(--size);
  }

  &[data-accented='true'] {
    --text-color: var(--base-color);
    background: transparent;
    border-color: var(--base-color);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  button + button {
    margin-left: 12px;
  }
`;
