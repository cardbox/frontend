import React from 'react';
import { UserCard } from '@cardbox/ui';
import { useStore } from 'effector-react/ssr';

import { $session } from './model';

interface Props {
  role?: string;
}

export const CurrentUserCard: React.FC<Props> = ({ role }) => {
  const user = useStore($session);
  if (user) {
    return <UserCard user={user} role={role} />;
  }
  return null;
};
