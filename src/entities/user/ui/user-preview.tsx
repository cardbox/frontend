import { Link } from 'atomic-router-react';
import React from 'react';
import styled from 'styled-components';

import { HighlightText } from '@box/entities/search';

import type { User } from '@box/shared/api';
import { imgLogo } from '@box/shared/assets';
import { plural } from '@box/shared/lib/plural';
import { theme } from '@box/shared/lib/theme';
import { routes } from '@box/shared/routes';
import { Avatar, PaperContainer, Text } from '@box/shared/ui';

interface UserPreviewProps {
  user: User;
  cardsCount?: number;
}
export const UserPreview: React.FC<UserPreviewProps> = ({ user, cardsCount }) => {
  return (
    <PaperContainerStyled>
      <Header>
        <>
          <Content user={user} />
          <Avatar src={user.avatar || imgLogo} />
        </>
      </Header>

      {cardsCount && <Meta cardsCount={cardsCount} />}
    </PaperContainerStyled>
  );
};

const Content: React.FC<{ user: User }> = ({ user }) => {
  if (!user.bio) return null;
  return (
    <ContentStyled>
      <Link to={routes.user.view} params={{ username: user.username || user.id }}>
        <UserName type="h4" title={user.username}>
          <HighlightText text={user.username} />
        </UserName>
      </Link>
      <ContentText type="span">{user.bio}</ContentText>
    </ContentStyled>
  );
};

interface MetaProps {
  cardsCount: number;
}

const Meta: React.FC<MetaProps> = ({ cardsCount }) => {
  return (
    <MetaStyled>
      <Text type="span">
        {cardsCount} {plural(cardsCount, 'card', 'cards')}
      </Text>
    </MetaStyled>
  );
};

const PaperContainerStyled = styled(PaperContainer)`
  justify-content: space-between;
  overflow: hidden;
  box-shadow: ${theme.shadows[1]};
  transition: 0.25s;
  height: 190px;

  &:hover,
  &:focus {
    border-color: var(${theme.palette.wizard800});
    background-color: var(${theme.palette.bnw1000});
    cursor: pointer;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;

  & > *:not(:first-child) {
    margin-left: 1rem;
  }
`;

const UserName = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MetaStyled = styled.div`
  color: var(${theme.palette.bnw600});
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContentStyled = styled.div`
  width: 100%;
  overflow: hidden;

  & > *:not(:first-child) {
    margin-top: 6px;
  }
`;
const ContentText = styled(Text)`
  color: var(${theme.palette.bnw400});
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`;
