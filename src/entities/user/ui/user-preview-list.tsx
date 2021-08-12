import React from 'react';
import styled from 'styled-components';
import { Empty, SkeletonGroup } from '@box/ui';
import type { User } from '@box/api';

import { UserPreview } from './user-preview';

// FIXME: remove component as redundant later

interface UserListProps {
  users: User[];
  loading?: boolean;
  getUserHref?: (data: User) => string | undefined;
  // FIXME: will be removed later
  getCardsCount?: (data: User) => number;
}
export const UserPreviewList = ({
  users,
  loading,
  getUserHref,
  getCardsCount,
}: UserListProps) => {
  if (loading) {
    return <SkeletonGroup amount={3} columns={3} />;
  }

  if (users.length === 0) {
    return <Empty text="No users found" />;
  }

  return (
    <Container>
      {users.map((user) => (
        <UserPreview
          key={user.id}
          user={user}
          userHref={getUserHref?.(user)}
          // FIXME: temp hack, will be optimized later
          cardsCount={getCardsCount?.(user)}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1.125rem;
  flex-direction: column;
`;
