import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@cardbox/ui';

// Временно
interface User {
  avatarUrl: string;
  displayName: string;
}

interface Props {
  user: User;
  role?: string;
}

export const UserCard: React.FC<Props> = ({ user, role }) => (
  <Container>
    <Content>
      <Name>{user.displayName}</Name>
      {role ? <Role>{role}</Role> : null}
    </Content>
    <Avatar src={user.avatarUrl} />
  </Container>
);

const Container = styled.div`
  align-items: center;
  background-color: #fff;
  border: 1px solid #e7e5ee;
  border-radius: 6px;
  box-shadow: 0px 6px 9px #f6f5f8;
  display: flex;
  justify-content: space-between;
  padding: 1.0625rem 1.3125rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-size: 1.3125rem;
  line-height: 1.5625rem;
`;

const Role = styled.div`
  color: #a39bb2;
  font-size: 0.8125rem;
  line-height: 1rem;
`;
