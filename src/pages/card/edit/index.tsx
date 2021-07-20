import * as CardDraft from '@box/features/card/draft';
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
            <CardDraft.EditTitle />
          </Header>
          <Content>
            <CardDraft.EditContent />
          </Content>
          <Footer>
            <button.Group>
              <CardDraft.UpdateChanges />
              <CardDraft.ResetChanges />
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
