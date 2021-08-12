import React from 'react';
import styled from 'styled-components';
import { Avatar, HighlightText, PaperContainer, Text, TextType } from '@box/ui';
import { Link } from 'react-router-dom';
import type { User } from '@box/api';
import { imgLogo } from '@box/shared/assets';
import { plural } from '@box/lib/plural';
import { useSearchQuery } from '@box/features/search-bar';

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
const PaperContainerStyled = styled(PaperContainer)`
  justify-content: space-between;
  overflow: hidden;
  box-shadow: 0px 3px 9px #faf9fa;
  transition: 0.25s;
  height: 190px;

  &:hover,
  &:focus {
    border-color: var(--wizard300);
    background-color: var(--bnw0);
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

type ContentProps = Pick<UserPreviewProps, 'userHref'> & Pick<User, 'username'>;

const Content: React.FC<ContentProps> = ({
  children,
  username,
  userHref = '',
}) => {
  const query = useSearchQuery();

  return (
    <ContentStyled>
      <UserLink to={userHref}>
        <UserName type={TextType.header4} title={username}>
          <HighlightText query={query} text={username} />
        </UserName>
      </UserLink>
      <ContentText type={TextType.small}>{children}</ContentText>
    </ContentStyled>
  );
};

interface MetaProps {
  cardsCount: number;
}

const UserName = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = ({ cardsCount }: MetaProps) => {
  return (
    <MetaStyled>
      <Text type={TextType.small}>
        {cardsCount} {plural(cardsCount, 'card', 'cards')}
      </Text>
    </MetaStyled>
  );
};

const MetaStyled = styled.div`
  color: #9b99ac;
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
  color: #62616d;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`;

const UserLink = styled(Link)`
  text-decoration: none;
  color: #000000;

  &:hover {
    color: blue;
  }
`;
