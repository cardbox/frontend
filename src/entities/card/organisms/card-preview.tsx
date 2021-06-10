import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Card } from '../types';
import { IconSave } from '../../../ui';

interface Props {
  card: Card;
}

export const CardPreview: React.FC<Props> = ({ card }) => {
  const truncate = (str: string, n: number) => {
    return str.length > n ? str.slice(0, n - 1) + '...' : str;
  };
  return (
    <Container>
      <Header>
        <Title>{card.title}</Title>
        <Link to={`/card/${card.id}`}>
          <SaveButton src={IconSave} />
        </Link>
      </Header>
      <Meta>
        Update {card.updatedAt}, {card.author}
      </Meta>
      <Body>{truncate(card.content, 115)}</Body>
    </Container>
  );
};

const Container = styled.article`
  position: relative;
  background-color: #fbfafb;
  border: 1px solid #e7e5ee;
  border-radius: 6px;
  box-shadow: 0 6px 9px #f6f5f8;
  color: #1a1e23;
  padding: 1.125rem 1.5rem 3.938rem 1.5rem;
  cursor: pointer;
  max-height: 13.5rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const Title = styled.h3`
  font-size: 1.875rem;
  font-weight: 500;
  line-height: 2.625rem;
  margin: 0;
  text-decoration: none;
`;

const Meta = styled.div`
  color: #a39bb2;
  flex-shrink: 0;
  font-size: 0.75rem;
  margin-left: auto;
  position: absolute;
  right: 1.875rem;
  bottom: 1.5rem;
`;

const SaveButton = styled.img`
  background: #ffffff;

  border: 1px solid #eeeef1;
  border-radius: 3px;
  width: 3rem;
  height: 2.625rem;
`;

const Body = styled.div`
  font-size: 0.9375rem;
  line-height: 1.3125rem;
  padding: 1rem 0;
`;
