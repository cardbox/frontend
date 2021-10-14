import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '@box/shared/lib/breakpoints';

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
  max-width: 100%;
  /* NOTE: Return later, after "large-pages" adaptation */
  /* width: 1404px; */
  width: 100%;
  padding: 0 36px;

  ${breakpoints.devices.tablet} {
    padding: 0 30px;
  }

  ${breakpoints.devices.mobile} {
    padding: 0 18px;
  }
`;
