import React from 'react';
import styled from 'styled-components';
import { theme } from '@box/lib/theme';

interface Props {
  extra?: React.ReactNode;
}

export const Toast: React.FC<Props> = ({ extra, children }) => {
  return (
    <Root>
      <Content>{children}</Content>
      {extra && <Extra>{extra}</Extra>}
    </Root>
  );
};

const Root = styled.article`
  display: flex;
  background: var(${theme.palette.wizard950});
  border-bottom: 1px solid var(${theme.palette.wizard750});
  box-sizing: border-box;
  box-shadow: ${theme.shadows[2]};
  justify-content: space-between;
  margin-top: -1.875rem; // Компенсируем отступ PagesContainer
  padding: 0 36px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  justify-content: space-between;
  line-height: 30px;
  padding: 10px 0;
`;

const Extra = styled.div`
  display: flex;
  align-items: center;
  margin-left: 30px;
`;
