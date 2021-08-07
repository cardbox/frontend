import React from "react";
import styled from "styled-components";
import type { Card } from "@box/api";
import { Empty, iconEmpty, SkeletonGroup, Text, TextType } from "@box/ui";
import { useKeyboardFocus } from "@box/lib/use-keyboard-focus";

import { CardPreview } from "./card-preview";

interface Props {
  cards: Card[];
  getHref?: (data: Card) => string | undefined;
  getUserHref?: (data: Card) => string | undefined;
  loading?: boolean;
}

export const CardList = ({ cards, getHref, getUserHref, loading }: Props) => {
  const { focusItemChanged, containerRef } = useKeyboardFocus();

  if (loading) {
    return <SkeletonGroup amount={4} />;
  }

  if (cards.length === 0) {
    return <Empty text='No cards found' />;
  }

  return (
    <Container ref={containerRef}>
      {cards.map((card, i) => (
        <CardPreview
          key={card.id}
          card={card}
          isCardInFavorite={i % 2 === 0}
          href={getHref?.(card)}
          userHref={getUserHref?.(card)}
          focusItemChanged={focusItemChanged}
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
