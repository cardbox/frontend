import React from 'react';
import styled from 'styled-components';
import { CardDraft } from '@box/features/card/draft';
import { ContentCenteredTemplate, Text, TextType } from '@box/ui';
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
    ready: () => <CardDraft.Form okText="Save" _name="edit" />,
  },
});

withStart(model.pageLoaded, CardEditPage);

const Container = styled.div`
  margin: 30px 120px 120px 120px;
`;
