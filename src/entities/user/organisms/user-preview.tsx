import React from 'react';
import styled from 'styled-components';

import { Avatar, PaperContainer, Text, TextType } from '../../../ui';
import { IUserPreview } from '../types';
import { getFoundData } from '../lib';
import { plural } from '../../../lib/plural';
import { useSearchQuery } from '../../../features/search-bar';

interface UserPreviewProps {
  user: IUserPreview;
}
export const UserPreview: React.FC<UserPreviewProps> = ({ user }) => (
  <PaperContainerStyled>
    <Header>
      <Content name={user.name}>{user.description}</Content>
      <Avatar />
    </Header>

    <Meta cardsCount={user.cardsCount} />
  </PaperContainerStyled>
);
const PaperContainerStyled = styled(PaperContainer)`
  justify-content: space-between;
  min-height: 120px;
  max-height: 150px;
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;

  & > *:not(:first-child) {
    margin-left: 1rem;
  }
`;
const Content: React.FC<Pick<IUserPreview, 'name'>> = ({ children, name }) => {
  const query = useSearchQuery();
  const data = getFoundData({ search: name, query });

  return (
    <ContentStyled>
      <UserName type={TextType.header4} title={name}>
        {data.map(({ isFound, text }) => (
          <PartUserName key={text} data-is-selected={isFound}>
            {text}
          </PartUserName>
        ))}
      </UserName>
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
const Meta = ({ cardsCount }: Pick<IUserPreview, 'cardsCount'>) => (
  <MetaStyled>
    <Text type={TextType.small}>
      {cardsCount} {plural(cardsCount, 'card', 'cards')}
    </Text>
  </MetaStyled>
);
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
