import { useEvent } from 'effector-react/scope';
import React from 'react';

import { Button, ButtonProps } from '@box/shared/ui';

import * as model from '../model';

interface SignInButtonProps {
  variant?: ButtonProps['variant'];
  label?: string;
}
export const SignInButton = ({ variant = 'text', label = 'Sign in' }: SignInButtonProps) => {
  const handleClick = useEvent(model.loginClicked);
  return (
    <Button variant={variant} onClick={handleClick}>
      {label}
    </Button>
  );
};
