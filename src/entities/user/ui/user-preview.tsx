import React from 'react';
import styled from 'styled-components';
import { Avatar, PaperContainer, Text } from '@box/ui';
import { HighlightText } from '@box/entities/search';
import { Link } from 'react-router-dom';
import type { User } from '@box/api';
import { imgLogo } from '@box/shared/assets';
import { plural } from '@box/lib/plural';
import { theme } from '@box/lib/theme';

interface UserPreviewProps {
  user: User;
  userHref?: string;
  cardsCount?: number;
}
export const UserPreview: React.FC<UserPreviewProps> = ({
  user,
  userHref,
  cardsCount,
}) => {
  const { username, avatar, bio } = user;
  return (
    <PaperContainerStyled>
      <Header>
        {bio && (
          <Content username={username} userHref={userHref}>
            {bio}
          </Content>
        )}
        <Avatar src={avatar || imgLogo} />
      </Header>

      {cardsCount && <Meta cardsCount={cardsCount} />}
    </PaperContainerStyled>
  );
};

type ContentProps = Pick<UserPreviewProps, 'userHref'> & Pick<User, 'username'>;

const Content: React.FC<ContentProps> = ({
  children,
  username,
  userHref = '',
}) => {
  return (
    <ContentStyled>
      <UserLink to={userHref}>
        <UserName type="h4" title={username}>
          <HighlightText text={username} />
        </UserName>
      </UserLink>
      <ContentText type="span">{children}</ContentText>
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

const UserLink = styled(Link)`
  text-decoration: none;
  color: var(${theme.palette.bnw0});

  &:hover {
    color: var(${theme.palette.wizard500});
  }
`;
