import React from 'react';
import { button } from '@box/ui';
import { useEvent } from 'effector-react/ssr';

import * as model from './session-panel.model';

export const SessionPanel: React.FC = () => {
  const handleClick = useEvent(model.loginClicked);

  return (
    <span>
      <button.Primary onClick={handleClick}>Login</button.Primary>
    </span>
  );
};
