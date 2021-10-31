import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@box/shared/ui/atoms';
import { Link } from 'react-router-dom';
import type { User } from '@box/shared/api';
import { breakpoints } from '@box/shared/lib/breakpoints';
import { imgLogo } from '@box/shared/assets';
import { paths } from '@box/pages/paths';
import { theme } from '@box/shared/lib/theme';

import { getFullName } from '../lib';

interface Props {
  user: User;
}

function linkToUser(user: User): string {
  return paths.user(user.username || user.id);
}

// FIXME: move to entities/user (BOX-155)
export const UserCard: React.FC<Props> = ({ user }) => {
  const href = linkToUser(user);
  const fullName = getFullName(user);
  const { avatar, work } = user;

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
  border: 1px solid var(${theme.palette.bnw900});
  border-radius: 6px;
  box-shadow: ${theme.shadows[1]};
  display: flex;
  justify-content: space-between;
  padding: 1.0625rem 1.3125rem;

  & > *:first-child {
    order: 0;
  }

  & > *:last-child {
    order: 1;
  }

  ${breakpoints.devices.mobile} {
    box-shadow: none;
    border: none;
    padding: 0;
    margin: 0;

    & > *:first-child {
      order: 1;
    }

    & > *:last-child {
      order: 0;
      margin-right: 12px;
    }
  }
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
