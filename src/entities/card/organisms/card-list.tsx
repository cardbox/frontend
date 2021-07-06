import React from 'react';
import styled from 'styled-components';
import type { Card } from '@box/api';
import { SkeletonGroup } from '@box/ui';
import { useFocus } from '@box/lib/use-focus';

import { CardPreview } from './card-preview';

interface Props {
  cards: Card[];
  getHref?: (data: Card) => string | undefined;
  loading?: boolean;
}

export const CardList = ({ cards, getHref, loading }: Props) => {
  const { focusItemChanged, containerRef } = useFocus();

  if (loading) {
    return <SkeletonGroup amount={4} />;
  }

  return (
    <Container ref={containerRef}>
      {cards.map((card, i) => (
        <CardPreview
          key={card.id}
          card={card}
          isCardInFavorite={i % 2 === 0}
          href={getHref?.(card)}
          focusItemChanged={focusItemChanged}
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
