import React from 'react';
import styled from 'styled-components';
import { CardDraft } from '@box/features/card/draft';
import { ContentCenteredTemplate } from '@box/ui';
import { Helmet } from 'react-helmet-async';
import { useStart, withStart } from '@box/lib/page-routing';

import * as model from './model';

/**
 * Страница создания карточки
 */
export const CardCreatePage = () => {
  useStart(model.pageLoaded);

  return (
    <>
      <Helmet title="Create card" />
      <ContentCenteredTemplate>
        <Container>
          <CardDraft.Form okText="Create and publish" />
        </Container>
      </ContentCenteredTemplate>
    </>
  );
};

withStart(model.pageLoaded, CardCreatePage);

const Container = styled.div`
  margin: 30px 120px 120px 120px;
`;
