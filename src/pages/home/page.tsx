import React from 'react';
import styled from 'styled-components';
import type { Card } from '@box/api';
import { Link } from 'react-router-dom';
import { createStore } from 'effector-root';
import { useStore } from 'effector-react/ssr';

export const $topCards = createStore<Card[]>([]);

export const HomePage: React.FC = () => {
  const topCards = useStore($topCards);
  return (
    <Container>
      {topCards.map((card) => {
        return (
          <div key={card.title}>
            <Link to={'card/18bc22a5-bf9b-409a-9913-fb42ef0fcfbe'}>
              {card.title}
            </Link>
          </div>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
`;
