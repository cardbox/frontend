import React from 'react';
import styled from 'styled-components';
import type { Card } from '@cardbox/api';

import { CardPreview } from './card-preview';

interface Props {
  cards: Card[];
  getHref?: (data: Card) => string | undefined;
}

export const CardList: React.FC<Props> = ({ cards, getHref }) => (
  <Container>
    {cards.map((card, i) => (
      <CardPreview
        key={card.id}
        card={card}
        isCardInFavorite={i % 2 === 0}
        href={getHref?.(card)}
      />
    ))}
  </Container>
);

const Container = styled.footer`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1.5rem;
  flex-direction: column;
`;
