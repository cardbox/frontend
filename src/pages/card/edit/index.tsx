import * as CardActions from '@box/features/card/actions';
import React from 'react';
import styled from 'styled-components';
import { ContentCenteredTemplate, button } from '@box/ui';
import { Helmet } from 'react-helmet-async';
import { useStart, withStart } from '@box/lib/page-routing';

import * as model from './model';

export const CardEditPage = () => {
  useStart(model.pageLoaded);

  return (
    <>
      <Helmet title="Edit card" />
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
    </>
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
  min-height: 500px;
`;

const Footer = styled.div`
  margin-top: 100px;
`;
