import React from 'react';
import styled from 'styled-components';
import { Button } from '@box/ui';
import { getFullName } from '@box/entities/user/lib';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from './session-panel.model';
import { $isAuthenticated, $session } from '../model';

// FIXME: move to features
export const SessionPanel: React.FC = () => {
  const handleClick = useEvent(model.loginClicked);
  const isAuthenticated = useStore($isAuthenticated);

  if (isAuthenticated) {
    return (
      <>
        <Viewer />
        <Button variant="outlined">Logout</Button>
      </>
    );
  }

  return (
    <Button theme="primary" variant="outlined" onClick={handleClick}>
      Login
    </Button>
  );
};

const Viewer = () => {
  const viewer = useStore($session);
  if (!viewer) return null;

  return (
    <User>
      <span data-user="name">{getFullName(viewer)}</span>
    </User>
  );
};

const User = styled.div`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;

  [data-user='name'] {
    margin-right: 12px;
    margin-left: 8px;
  }
`;
