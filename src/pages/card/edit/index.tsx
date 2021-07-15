import * as CardActions from '@box/features/card/actions';
import React from 'react';
import styled from 'styled-components';
import { ContentCenteredTemplate, button } from '@box/ui';
import { useStart, withStart } from '@box/lib/page-routing';
import { useStore } from 'effector-react/ssr';

import * as model from './model';

export const CardEditPage = () => {
  useStart(model.pageLoaded);
  const isLoading = useStore(model.$pagePending);

  //   const pageTitle = useStore(model.$pageTitle);

  if (isLoading) return <>Loading...</>;

  return (
    <ContentCenteredTemplate>
      <Container>
        <Header>
          <CardActions.EditTitle />
        </Header>
        <Content>
          <CardActions.EditContent />
        </Content>
        <Footer>
          <button.Group>
            <CardActions.UpdateChanges />
            <CardActions.ResetChanges />
          </button.Group>
        </Footer>
      </Container>
    </ContentCenteredTemplate>
  );
};

withStart(model.pageLoaded, CardEditPage);

const Container = styled.div`
  margin: 30px 120px 120px 120px;
`;

// Layout
const Header = styled.div`
  margin-bottom: 50px;
`;

const Content = styled.div`
  margin-left: -50px;
  min-height: 500px;
`;

const Footer = styled.div`
  margin-top: 100px;
`;
