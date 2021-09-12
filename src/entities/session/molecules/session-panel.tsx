import React from 'react';
import { Button } from '@box/ui';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from './session-panel.model';
import { $isAuthenticated } from '../model';

// FIXME: move to features
export const SessionPanel: React.FC = () => {
  const handleClick = useEvent(model.loginClicked);
  const isAuthenticated = useStore($isAuthenticated);

  if (isAuthenticated) {
    return <Button variant="text">Logout</Button>;
  }

  return (
    <Button variant="text" onClick={handleClick}>
      Sign in
    </Button>
  );
};
