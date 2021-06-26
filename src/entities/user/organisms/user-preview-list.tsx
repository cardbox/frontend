import React from 'react';
import styled from 'styled-components';
import { SkeletonGroup } from '@box/ui';
import type { User } from '@box/api';

import { UserPreview } from './user-preview';

interface UserListProps {
  users: User[];
  loading?: boolean;
}
export const UserPreviewList = ({ users, loading }: UserListProps) => (
  <>
    {loading && <SkeletonGroup amount={4} />}
    {!loading && (
      <Container>
        {users.map((user) => (
          <UserPreview key={user.id} user={user} />
        ))}
      </Container>
    )}
  </>
);

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1.125rem;
  flex-direction: column;
`;
