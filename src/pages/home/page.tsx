import * as React from 'react';
import styled from 'styled-components';
import { CardList } from '@cardbox/entities/card';
import { ContentCenteredTemplate } from '@cardbox/ui';
import { createStart, withStart } from '@cardbox/lib/page-routing';
import { createStore } from 'effector-root';
import { reflect } from '@effector/reflect/ssr';

import { Card } from './types';

export const start = createStart();
export const $cards = createStore<Card[]>([]);

export const HomePage = withStart(start, () => {
  return (
    <ContentCenteredTemplate>
      <Container>
        <Main>
          <Cards />
        </Main>
      </Container>
    </ContentCenteredTemplate>
  );
});

const Cards = reflect({
  view: CardList,
  bind: { cards: $cards },
});

const Container = styled.div`
  display: flex;
  padding-bottom: 3rem;
`;

const Main = styled.div`
  width: 74.5%; /* 1044 / 1404 * 100 */
`;
