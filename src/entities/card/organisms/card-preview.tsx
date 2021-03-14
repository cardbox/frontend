import React from 'react';
import styled from 'styled-components';
import { DateRelative, DateShort } from '@cardbox/entities/i18n';
import { SEC_DAY } from '@cardbox/lib/dates';

import { Card } from '../types';

interface Props {
  card: Card;
}

export const CardPreview: React.FC<Props> = React.memo(({ card }) => (
  <Container>
    <Header>
      <Title>{card.title}</Title>
      <Meta>
        Created <DateRelative secondsUntilFull={SEC_DAY * 7} date={card.createdAt} />
      </Meta>
    </Header>
    <Body>{card.previewContent}</Body>
  </Container>
));

const Container = styled.div`
  background-color: #fff;
  border: 1px solid #e7e5ee;
  border-radius: 6px;
  box-shadow: 0px 6px 9px #f6f5f8;
  color: #1a1e23;
  padding: 1.125rem 1.5rem 0.625rem 1.5rem;
`;

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
