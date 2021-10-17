import React from 'react';
import { Button, ButtonProps } from '@box/shared/ui';
import { useEvent } from 'effector-react/ssr';

import * as model from '../model';

interface SignInButtonProps {
  variant: ButtonProps['variant'];
  label: string;
}
export const SignInButton = ({
  variant = 'text',
  label = 'Sign in',
}: SignInButtonProps) => {
  const handleClick = useEvent(model.loginClicked);
  return (
    <Button variant={variant} onClick={handleClick}>
      {label}
    </Button>
  );
};
