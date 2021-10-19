import React from 'react';
import styled from 'styled-components';
import { Button } from '@box/shared/ui';
import { getFullName } from '@box/entities/user/lib';
import { useStore } from 'effector-react/ssr';

import { $session } from '../model';
import { ShowOnly } from './show-only';
import { SignInButton } from '../atoms';

// FIXME: move to features
export const SessionPanel = () => {
  return (
    <>
      <ShowOnly when="authorized">
        <Viewer />
        <Button variant="text">Logout</Button>
      </ShowOnly>
      <ShowOnly when="anonymous">
        <SignInButton />
      </ShowOnly>
    </>
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
