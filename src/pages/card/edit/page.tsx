import React from 'react';
import styled from 'styled-components';
import { CardDraft } from '@box/features/card/draft';
import { ContentCenteredTemplate, Text } from '@box/shared/ui';
import { Helmet } from 'react-helmet-async';
import { createStore } from 'effector';
import { variant } from '@effector/reflect/ssr';

export const $isCardFound = createStore(false);

/**
 * Страница редактирования карточки
 */
export const CardEditPage: React.FC = () => {
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
  source: $isCardFound.map((isFound) => {
    if (!isFound) return 'notFound';
    return 'ready';
  }),
  cases: {
    // FIXME: replace to Error widget later
    // @see https://ant.design/components/result/#components-result-demo-404
    notFound: () => <Text type="h2">Card not found</Text>,
    ready: () => <CardDraft.Form okText="Save" _name="edit" />,
  },
});

const Container = styled.div`
  margin: 30px 120px 120px 120px;
`;
