import React from 'react';
import styled from 'styled-components';
import { Avatar, HighlightText, PaperContainer, Text, TextType } from '@box/ui';
import { Link } from 'react-router-dom';
import type { User } from '@box/api';
import { imgLogo } from '@box/shared/assets';
// import { plural } from '@box/lib/plural';
import { useSearchQuery } from '@box/features/search-bar';

interface UserPreviewProps {
  user: User;
  userHref?: string;
}
export const UserPreview: React.FC<UserPreviewProps> = ({ user, userHref }) => {
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

      {/* FIXME: resolve relations BOX-185 */}
      {/* <Meta cards={user.cards} /> */}
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

interface ContentProps extends Pick<User, 'username'> {
  children: React.ReactNode | React.ReactNode[];
  userHref?: string;
}

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

const UserName = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
// const Meta = ({ cards }: Pick<User, 'cards'>) => {
//   return (
//     <MetaStyled>
//       <Text type={TextType.small}>
//         {cards.length} {plural(cards.length, 'card', 'cards')}
//       </Text>
//     </MetaStyled>
//   );
// };
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
