import React from 'react';
import styled from 'styled-components';
import { ContentCenteredTemplate, LoaderFull } from 'ui';
import { useStart } from 'lib/page-routing';
import { useStore } from 'effector-react/ssr';

import * as model from './model';

export const AccessoDonePage = () => {
  useStart(model.pageReady);
  const status = useStore(model.$status);

  return (
    <ContentCenteredTemplate>
      <Container>
        {status === 'pending' && <LoaderFull />}
        {status === 'done' && <UserName />}
        {status === 'fail' && (
          <pre>Oh! Something went wrong. Please try again later.</pre>
        )}
      </Container>
    </ContentCenteredTemplate>
  );
};

const UserName = () => {
  const { firstName, lastName } = useStore(model.$userName);

  return (
    <div>
      <h4>
        Welcome! Dear, {firstName} {lastName}.
      </h4>
      <p>You will be redirected back in 3 seconds.</p>
    </div>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
