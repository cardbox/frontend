import React from 'react';
import styled from 'styled-components';

export const ContentCenteredTemplate: React.FC = ({ children }) => (
  <Container>
    <Content>{children}</Content>
  </Container>
);

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Content = styled.div`
  max-width: calc(100% - 36px);
  width: 1404px;
`;
