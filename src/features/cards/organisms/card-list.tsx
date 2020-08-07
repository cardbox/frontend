import React from 'react';
import styled from 'styled-components';

import { Card } from '../types';
import { CardPreview } from './card-preview';

interface Props {
  cards: Card[];
}

export const CardList: React.FC<Props> = ({ cards }) => (
  <Container>
    {cards.map((card) => (
      <CardPreview key={card.id} card={card} />
    ))}
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 1.125rem;
  }
`;
