import React from 'react';
import styled from 'styled-components';

import { Text } from './text';

interface EmptySearchProps {
  text: string;
}

/**
 * Заглушка для пустых блоков с данными
 */
export const Empty: React.FC<EmptySearchProps> = ({ text }) => {
  return (
    <EmptyBlock>
      <Text>{text}</Text>
    </EmptyBlock>
  );
};

const EmptyBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// const EmptyIcon = styled.img<{ margin?: string }>`
//   margin: ${({ margin }) => margin || 0};
// `;
