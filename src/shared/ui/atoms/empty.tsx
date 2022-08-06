import React from 'react';
import styled from 'styled-components';

import { Text } from './text';

interface EmptySearchProps {
  text: string;
  children?: React.ReactNode;
}

export const Empty: React.FC<EmptySearchProps> = ({ text, children }) => {
  return (
    <EmptyBlock>
      <Text>{text}</Text>
      {children}
    </EmptyBlock>
  );
};

const EmptyBlock = styled.div`
  display: flex;
  margin-top: 15%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
