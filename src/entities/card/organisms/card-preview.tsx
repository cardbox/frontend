import React from 'react';
import styled from 'styled-components';
import { CardContainer } from '@cardbox/ui';

import { Card } from '../types';

interface Props {
  card: Card;
}

export const CardPreview: React.FC<Props> = ({ card }) => (
  <CardContainer>
    <Header>
      <Title>{card.title}</Title>
      <Meta>
        Update {card.updatedAt}, {card.author}
      </Meta>
    </Header>
    <Body>{card.content}</Body>
  </CardContainer>
);

const Header = styled.header`
  display: flex;
`;

const Title = styled.h3`
  font-size: 1.875rem;
  font-weight: 500;
  line-height: 2.25rem;
  margin: 0;
`;

const Meta = styled.div`
  color: #a39bb2;
  flex-shrink: 0;
  font-size: 0.75rem;
  margin-left: auto;
`;

const Body = styled.div`
  font-size: 0.9375rem;
  line-height: 1.3125rem;
  padding: 1rem 0;
`;
