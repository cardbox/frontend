import { useStore } from 'effector-react/scope';
import React from 'react';

import { $isAuthenticated } from '../model';

interface Props {
  when: 'authorized' | 'anonymous';
  children?: React.ReactNode;
}

export const ShowOnly: React.FC<Props> = ({ when, children }) => {
  const isAuthorized = useStore($isAuthenticated);
  const shouldShow = (when === 'authorized') === isAuthorized;

  if (shouldShow) return <>{children}</>;
  return null;
};
