import React from 'react';
import styled from 'styled-components';
import type { Card, User } from '@box/shared/api';
import { Empty, SkeletonGroup } from '@box/shared/ui';

import { CardPreview } from './card-preview';

// FIXME: remove component as redundant later

interface Props {
  cards: Card[];
  getHref?: (data: Card) => string | undefined;
  getUserHref?: (data: Card) => string | undefined;
  // FIXME: will be removed later
  getUser: (data: Card) => User;
  loading?: boolean;
}

export const CardList = ({
  cards,
  getHref,
  getUserHref,
  getUser,
  loading,
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
          // FIXME: temp hack, will be optimized later
          author={getUser(card)}
          isCardInFavorite={i % 2 === 0}
          href={getHref?.(card)}
          userHref={getUserHref?.(card)}
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
