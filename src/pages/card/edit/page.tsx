import React from 'react';
import styled from 'styled-components';
import { CardDraft } from '@box/features/card/draft';
import { ContentCenteredTemplate, Empty } from '@box/ui';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { createStore } from 'effector';
import { paths } from '@box/pages/paths';
import { theme } from '@box/lib/theme';
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
    notFound: () => (
      <Empty text="Sorry, the page you visited does not exist.">
        <LinkHome to={paths.home()}>Back Home</LinkHome>
      </Empty>
    ),
    ready: () => <CardDraft.Form okText="Save" _name="edit" />,
  },
});

const Container = styled.div`
  margin: 30px 120px 120px 120px;
`;

const LinkHome = styled(Link)`
  --base-color: var(${theme.palette.wizard500});

  color: var(--base-color);
  margin-top: 2rem;
  &:hover {
    opacity: 0.7;
  }
`;
