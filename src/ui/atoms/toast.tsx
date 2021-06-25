import React from 'react';
import styled from 'styled-components';

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

  background: var(--wizard100);
  border: 1px solid var(--wizard300);
  box-sizing: border-box;
  box-shadow: 0px 3px 9px #fbfafb;
  border-radius: 6px;
  padding: 30px 24px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
`;

const Extra = styled.div`
  display: flex;
  align-items: center;
  margin-left: 30px;
`;
