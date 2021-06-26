import React from 'react';
import styled from 'styled-components';
import type { Card } from '@box/api';
import { SkeletonGroup } from '@box/ui';

import { CardPreview } from './card-preview';

interface Props {
  cards: Card[];
  getHref?: (data: Card) => string | undefined;
  loading?: boolean;
}

export const CardList: React.FC<Props> = ({ cards, getHref, loading }) => (
  <>
    {loading && <SkeletonGroup amount={4} />}
    {!loading && (
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
    )}
  </>
);

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1.5rem;
  flex-direction: column;
`;
