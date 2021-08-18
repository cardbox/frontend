import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@box/ui/atoms';
import { Link } from 'react-router-dom';
import type { User } from '@box/api';
import { imgLogo } from '@box/shared/assets';
import { theme } from '@box/lib/theme';

import { getFullName } from '../lib';

interface Props {
  user: User;
  getUserHref?: (data: User) => string | undefined;
}

// FIXME: move to entities/user (BOX-155)
export const UserCard: React.FC<Props> = ({ user, getUserHref }) => {
  const href = getUserHref?.(user) || '';
  const fullName = getFullName(user);
  const { avatar, work } = user;

  const username = `${user.firstName} ${user.lastName}`;
  return (
    <Container>
      <Content>
        <Name>
          {href && <TitleLink to={href}>{fullName}</TitleLink>}
          {!href && fullName}
        </Name>
        {work && <Role>{work}</Role>}
      </Content>
      <Avatar src={avatar || imgLogo} />
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  background-color: var(${theme.palette.bnw1000});
  border: 1px solid var(${theme.palette.bnw850});
  border-radius: 6px;
  box-shadow: 0 6px 9px var(${theme.palette.bnw950});
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
  color: var(${theme.palette.bnw600});
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
