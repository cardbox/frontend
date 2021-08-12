import React from 'react';
import styled from 'styled-components';
import { button } from '@box/ui';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from './session-panel.model';
import { $isAuthenticated } from '../model';

export const SessionPanel: React.FC = () => {
  const handleClick = useEvent(model.loginClicked);
  const isAuthenticated = useStore($isAuthenticated);

  return (
    <span>
      {isAuthenticated ? (
        <Logout> Logout </Logout>
      ) : (
        <Login onClick={handleClick}>Login</Login>
      )}
    </span>
  );
};

const Login = styled(button.Primary)`
  margin-left: 1.125rem;
`;

const Logout = styled(button.Base)`
  margin-left: 1.125rem;
`;
