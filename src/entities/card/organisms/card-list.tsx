import React from 'react';
import styled from 'styled-components';

import { Card } from '../types';
import { CardPreview } from './card-preview';

interface Props {
  cards: Card[];
}

export const CardList: React.FC<Props> = ({ cards }) => (
  <Container>
    {cards.map((card, i) => (
      <CardPreview key={card.id} card={card} isCardInFavorite={i % 2 === 0} />
    ))}
  </Container>
);

const Container = styled.footer`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1.5rem;
  flex-direction: column;
`;
