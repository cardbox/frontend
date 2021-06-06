import React from 'react';
import styled from 'styled-components';

import type { IUserPreview } from '../types';
import { UserPreview } from './user-preview';

interface UserListProps {
  users: IUserPreview[];
}
export const UserPreviewList = ({ users }: UserListProps) => (
  <Container>
    {users.map((user) => (
      <UserPreview key={user.id} user={user} />
    ))}
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 1.125rem;
  }
`;
