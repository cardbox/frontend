import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@box/ui/atoms';
import { Link } from 'react-router-dom';
import type { User } from '@box/api';
import { theme } from '@box/lib/theme';

interface Props {
  user: User;
  getUserHref?: (data: User) => string | undefined;
}

export const UserCard: React.FC<Props> = ({ user, getUserHref }) => {
  const href = getUserHref?.(user) || '';

  const username = `${user.firstName} ${user.lastName}`;
  return (
    <Container>
      <Content>
        <Name>
          {href && <TitleLink to={href}>{username}</TitleLink>}
          {!href && username}
        </Name>
        <Role>{user.work}</Role>
      </Content>
      <Avatar src={user.avatar} />
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  background-color: var(${theme.palette.bnw0});
  border: 1px solid var(${theme.palette.bnw200});
  border-radius: 6px;
  box-shadow: 0px 6px 9px var(${theme.palette.unknown7});
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
  white-space: nowrap;
`;

const Role = styled.div`
  color: var(${theme.palette.unknown1});
  font-size: 0.8125rem;
  line-height: 1rem;
`;

const TitleLink = styled(Link)`
  color: unset;
  text-decoration: unset;
  transition: 0.25s;

  &:hover {
    color: var(${theme.palette.wizard500});
  }
`;
