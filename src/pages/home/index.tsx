import React from 'react';
import styled from 'styled-components';
import { CardList, cardModel } from '@cardbox/entities/card';
import { ContentCenteredTemplate } from '@cardbox/ui';
import { useStart, withStart } from '@cardbox/lib/page-routing';
import { useStore } from 'effector-react/ssr';

import * as model from './model';

export const HomePage = () => {
  useStart(model.pageLoaded);
  const cards = useStore(cardModel.$cards);
  const isLoading = useStore(model.$pagePending);

  return (
    <ContentCenteredTemplate>
      <Container>
        <Main>
          {isLoading && 'Loading...'}
          {!isLoading && cards.length > 0 && (
            <CardList cards={cards} getHref={(card) => `/card/${card.id}`} />
          )}
          {/* TODO: Process "empty" case correctly */}
        </Main>
      </Container>
    </ContentCenteredTemplate>
  );
};

withStart(model.pageLoaded, HomePage);

const Container = styled.div`
  display: flex;
  padding-bottom: 3rem;
`;

const Main = styled.div`
  // width: 74.5%; /* 1044 / 1404 * 100 */
`;
