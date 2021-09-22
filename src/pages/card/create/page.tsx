import React from 'react';
import styled from 'styled-components';
import { CardDraft } from '@box/features/card/draft';
import { ContentCenteredTemplate } from '@box/shared/ui';
import { Helmet } from 'react-helmet-async';

/**
 * Страница создания карточки
 */
export const CardCreatePage: React.FC = () => (
  <>
    <Helmet title="Create card" />
    <ContentCenteredTemplate>
      <Container>
        <CardDraft.Form okText="Create and publish" _name="create" />
      </Container>
    </ContentCenteredTemplate>
  </>
);

const Container = styled.div`
  margin: 30px 120px 120px 120px;
`;
