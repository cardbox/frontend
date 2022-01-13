import React from 'react';
import styled from 'styled-components';

import { paths } from '@box/pages/paths';
import type { Card } from '@box/shared/api';
import { breakpoints } from '@box/shared/lib/breakpoints';
import { Empty, SkeletonGroup } from '@box/shared/ui';

import { CardPreview } from './card-preview';

// FIXME: remove component as redundant later

interface Props {
  cards: Card[];
  loading?: boolean;
}

export const CardList = ({ cards, loading }: Props) => {
  if (loading) {
    return <SkeletonGroup columns={3} amount={4} />;
  }

  if (cards.length === 0) {
    return <Empty text="No cards found" />;
  }

  return (
    <Container>
      {cards.map((card, i) => (
        <CardPreview key={card.id} card={card} size="small" />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-column-gap: 1.125rem;

  & > *:not(:last-child) {
    margin-bottom: 1.125rem;
  }

  ${breakpoints.devices.desktopL} {
    grid-template-columns: repeat(4, 1fr);
  }

  ${breakpoints.devices.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${breakpoints.devices.laptop} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${breakpoints.devices.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${breakpoints.devices.mobile} {
    grid-template-columns: 1fr;
  }
`;
