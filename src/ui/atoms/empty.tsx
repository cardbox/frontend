import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { paths } from '@box/pages/paths';
import { theme } from '@box/lib/theme';

import { Text } from './text';

interface EmptySearchProps {
  text: string;
  enableButton?: boolean;
}

/**
 * Заглушка для пустых блоков с данными
 */
export const Empty: React.FC<EmptySearchProps> = ({ text, enableButton }) => {
  return (
    <EmptyBlock>
      <Text>{text}</Text>
      {enableButton && <LinkHome to={paths.home()}>Back Home</LinkHome>}
    </EmptyBlock>
  );
};

const EmptyBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LinkHome = styled(Link)`
  --base-color: var(${theme.palette.wizard500});

  color: var(--base-color);
  margin-top: 2rem;
  &:hover {
    opacity: 0.7;
  }
`;
