import React from 'react';
import styled from 'styled-components';
import { button } from '@box/ui';
import { useEvent } from 'effector-react/ssr';

import * as model from './session-panel.model';

export const SessionPanel: React.FC = () => {
  const handleClick = useEvent(model.loginClicked);

  return (
    <span>
      <Login onClick={handleClick}>Login</Login>
    </span>
  );
};

const Login = styled(button.Primary)`
  margin-left: 1.125rem;
`;
