import React from 'react';
import styled from 'styled-components';

import { Avatar, CardContainer } from '../../../ui';
import { IUserPreview } from '../types';
import { plural } from '../../../lib/plural';

interface UserPreviewProps {
  user: IUserPreview;
}
export const UserPreview: React.FC<UserPreviewProps> = ({ user }) => {
  return (
    <CardContainer>
      <Container>
        <Texts>
          <Title title={user.name}>{user.name}</Title>
          <Counter>
            {user.cardsCount} {plural(user.cardsCount, 'card', 'cards')}
          </Counter>
        </Texts>
        <Avatar />
      </Container>
    </CardContainer>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
`;
const Texts = styled.div`
  overflow: hidden;
`;
const Title = styled.h3`
  font-size: 1.12rem;
  font-weight: 500;
  line-height: 1rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Counter = styled.p`
  color: #a39bb2;
  flex-shrink: 0;
  font-size: 0.75rem;
  margin: 0 0 0 auto;
  padding-top: 0.5rem;
`;
