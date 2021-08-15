import * as React from 'react';

interface TabProps {
  label: string;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};
