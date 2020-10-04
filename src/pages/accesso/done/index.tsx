import React from 'react';
import styled from 'styled-components';
import { ContentCenteredTemplate, LoaderFull } from 'ui';
import { useStart } from 'lib/page-routing';

import * as model from './model';

export const AccessoDonePage = () => {
  useStart(model.pageReady);

  return (
    <ContentCenteredTemplate>
      <Container>
        <LoaderFull />
      </Container>
    </ContentCenteredTemplate>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
