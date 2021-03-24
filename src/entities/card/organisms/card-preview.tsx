import React from 'react';
import styled from 'styled-components';
import { DateRelative } from '@cardbox/entities/i18n';
import { Link } from 'react-router-dom';
import { SEC_DAY } from '@cardbox/lib/dates';
import { paths } from '@cardbox/pages/paths';

import { Card } from '../types';

interface Props {
  card: Card;
}

export const CardPreview: React.FC<Props> = React.memo(({ card }) => (
  <Container>
    <Header>
      <Title>
        <Link to={paths.card(card.id)}>{card.title}</Link>
      </Title>
      <Meta>
        Created <DateRelative secondsUntilFull={SEC_DAY * 7} date={card.createdAt} />
      </Meta>
    </Header>
    <Body>{card.previewContent}</Body>
  </Container>
));

export const CardFull: React.FC<Props> = ({ card }) => (
  <Container>
    <Header>
      <Title>
        <Link to={paths.card(card.id)}>{card.title}</Link>
      </Title>
      <Meta>
        Created <DateRelative secondsUntilFull={SEC_DAY * 7} date={card.createdAt} />
      </Meta>
    </Header>
    <Body>{card.content}</Body>
  </Container>
);

const Container = styled.div`
  background-color: #fff;
  border: 1px solid #e7e5ee;
  border-radius: 6px;
  box-shadow: 0px 6px 9px #f6f5f8;
  color: #1a1e23;
  padding: 1.2rem 1.5rem 0.6rem 1.5rem;
`;

const Header = styled.header`
  display: flex;
`;

const Title = styled.h3`
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 2rem;
  margin: 0;
`;

const Meta = styled.div`
  color: #a39bb2;
  flex-shrink: 0;
  font-size: 0.75rem;
  margin-left: auto;
`;

const Body = styled.div`
  font-size: 1rem;
  line-height: 1.5rem;
  padding: 1rem 0;
`;
