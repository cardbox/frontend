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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1.125rem;
  flex-direction: column;
`;
