import React from 'react';
import styled from 'styled-components';
import { Avatar, PaperContainer, Text, TextType } from '@box/ui';
import { Link } from 'react-router-dom';
import type { User } from '@box/api';
import { paths } from '@box/pages/paths';
import { plural } from '@box/lib/plural';
import { useSearchQuery } from '@box/features/search-bar';

import { getFoundData } from '../lib';

interface UserPreviewProps {
  user: User;
}
export const UserPreview: React.FC<UserPreviewProps> = ({ user }) => {
  return (
    <PaperContainerStyled>
      <Header>
        <Content username={user.username}>{user.bio}</Content>
        <Avatar src={user.avatar} />
      </Header>

      <Meta cards={user.cards} />
    </PaperContainerStyled>
  );
};
const PaperContainerStyled = styled(PaperContainer)`
  justify-content: space-between;
  min-height: 120px;
  max-height: 150px;
  overflow: hidden;

  transition: 0.25s;

  &:hover {
    box-shadow: 0 3px 9px #ebebeb;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;

  & > *:not(:first-child) {
    margin-left: 1rem;
  }
`;
const Content: React.FC<Pick<User, 'username'>> = ({ children, username }) => {
  const query = useSearchQuery();
  const data = getFoundData({ search: username, query });

  return (
    <ContentStyled>
      <UserLink to={paths.user(username)}>
        <UserName type={TextType.header4} title={username}>
          {data.map(({ isFound, text }, index) => (
            // no need to handle index issue here
            // eslint-disable-next-line react/no-array-index-key
            <PartUserName key={index} data-is-selected={isFound}>
              {text}
            </PartUserName>
          ))}
        </UserName>
      </UserLink>
      <ContentText type={TextType.small}>{children}</ContentText>
    </ContentStyled>
  );
};

const PartUserName = styled.span<{ 'data-is-selected': boolean }>`
  &[data-is-selected='true'] {
    color: blue;
  }
`;
const UserName = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Meta = ({ cards }: Pick<User, 'cards'>) => {
  return (
    <MetaStyled>
      <Text type={TextType.small}>
        {cards.length} {plural(cards.length, 'card', 'cards')}
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
`;
