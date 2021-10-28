import React from 'react';
import styled from 'styled-components';
import type { Card } from '@box/shared/api';
import { Empty, SkeletonGroup } from '@box/shared/ui';
import { paths } from '@box/pages/paths';

import { CardPreview } from './card-preview';

// FIXME: remove component as redundant later

interface Props {
  cards: Card[];
  loading?: boolean;
  favoritesCards: Card[];
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
}

export const CardList = ({
  cards,
  favoritesCards,
  loading,
  addToFavorites,
  removeFromFavorites,
}: Props) => {
  if (loading) {
    return <SkeletonGroup amount={4} />;
  }

  if (cards.length === 0) {
    return <Empty text="No cards found" />;
  }

  return (
    <Container>
      {cards.map((card, i) => (
        <CardPreview
          key={card.id}
          card={card}
          isCardInFavorite={favoritesCards?.some((s) => s.id === card.id)}
          href={paths.cardView(card.id)}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
          size="small"
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 1.125rem;

  & > *:not(:last-child) {
    margin-bottom: 1.125rem;
  }
`;
