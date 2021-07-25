import * as CardDraft from '@box/features/card/draft';
import React from 'react';
import styled from 'styled-components';
import { ContentCenteredTemplate, Text, TextType, button } from '@box/ui';
import { Helmet } from 'react-helmet-async';
import { combine } from 'effector-root';
import { useStart, withStart } from '@box/lib/page-routing';
import { variant } from '@effector/reflect/ssr';

import * as model from './model';

/**
 * Страница редактирования карточки
 */
export const CardEditPage = () => {
  useStart(model.pageLoaded);

  return (
    <>
      <Helmet title="Edit card" />
      <ContentCenteredTemplate>
        <Container>
          <PageContent />
        </Container>
      </ContentCenteredTemplate>
    </>
  );
};

const PageContent = variant({
  source: combine({ isFound: model.$isCardFound }, ({ isFound }) => {
    if (!isFound) return 'notFound';
    return 'ready';
  }),
  cases: {
    // FIXME: replace to Error widget later
    // @see https://ant.design/components/result/#components-result-demo-404
    notFound: () => <Text type={TextType.header2}>Card not found</Text>,
    ready: () => (
      <>
        <Header>
          <CardDraft.EditTitle />
        </Header>
        <Content>
          <CardDraft.EditContent />
        </Content>
        <Footer>
          <button.Group>
            <CardDraft.SubmitChanges title="Save" />
            <CardDraft.ResetChanges />
          </button.Group>
        </Footer>
      </>
    ),
  },
});

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
