import { createStore } from 'effector';
import { useStore } from 'effector-react/scope';
import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';

import { variant } from '@effector/reflect/ssr';

import { CardList, cardModel } from '@box/entities/card';
import { ShowOnly } from '@box/entities/session';
import { userLib } from '@box/entities/user';
import { Card, User } from '@box/shared/api';
import { imgLogo } from '@box/shared/assets';
import { breakpoints } from '@box/shared/lib/breakpoints';
import { theme } from '@box/shared/lib/theme';
import {
  Avatar,
  Button,
  ContentCenteredTemplate,
  Empty,
  IconEdit,
  Tab,
  Tabs,
  iconUserBg,
} from '@box/shared/ui';

import { SkeletonLayout } from './skeleton';

export const $currentUser = createStore<User | null>(null);
export const $cards = createStore<Card[]>([]);
export const $pagePending = createStore(false);
export const $isOnOwnedPage = createStore(false);

const $isUserFound = $currentUser.map((user) => Boolean(user));

export const UserPage = () => {
  const isLoading = useStore($pagePending);
  if (isLoading) return <SkeletonLayout />;

  return (
    <>
      <UnderLay bg={iconUserBg} />
      <ContentCenteredTemplate>
        <UserPageContent />
      </ContentCenteredTemplate>
    </>
  );
};

const UserPageContentComponent = () => {
  const isLoading = useStore($pagePending);
  const userInfo = useStore($currentUser)!;
  const isOnOwnedPage = useStore($isOnOwnedPage);
  const cards = useStore($cards);
  const favoritesCards = useStore(cardModel.$favoritesCards);

  const { work, bio, socials, avatar } = userInfo;
  const fullName = userLib.getFullName(userInfo);

  return (
    <Container>
      <UserHeader>
        <UserFace>
          <UserFaceContent>
            <UserFaceName>{fullName}</UserFaceName>
            {work && <UserFacePosition>{work}</UserFacePosition>}
            <UserLocation>Saint-Petersburg, Russia</UserLocation>
            {bio && <UserFaceDescription>{bio}</UserFaceDescription>}
          </UserFaceContent>
        </UserFace>
        <UserSocial>
          {Boolean(socials.length) && (
            <SocialStaff>
              <SocialStaffTitle>Social staff</SocialStaffTitle>
              <SocialStaffList>
                {socials.map((social) => (
                  <SocialStaffItem key={social.id}>
                    <SocialLink href={social.link}>
                      <Avatar size="small" src={avatar || imgLogo} />
                      <SocialStaffItemText>@{social.username}</SocialStaffItemText>
                    </SocialLink>
                  </SocialStaffItem>
                ))}
              </SocialStaffList>
            </SocialStaff>
          )}
        </UserSocial>
        {/* FIXME: move to entities/user logic */}
        <UserLogo>
          <StAvatar size="large" src={avatar || imgLogo} />
          {isOnOwnedPage && false && (
            <ShowOnly when="authorized">
              <EditProfile theme="secondary" variant="outlined" icon={<IconEdit />}>
                Edit profile
              </EditProfile>
            </ShowOnly>
          )}
        </UserLogo>
      </UserHeader>
      <Main>
        <UserCards>
          <Tabs>
            <Tab label="User cards">
              <CardList cards={cards} loading={isLoading} />
            </Tab>
            <Tab label="Saved" isVisible={isOnOwnedPage}>
              <CardList cards={favoritesCards} loading={isLoading} />
            </Tab>
          </Tabs>
        </UserCards>
      </Main>
    </Container>
  );
};

const UserPageContent = variant({
  source: $isUserFound.map((isFound) => {
    if (!isFound) return 'notFound';
    return 'ready';
  }),
  cases: {
    notFound: () => (
      <ContentCenteredTemplate>
        <Empty text="Sorry, the page you visited does not exist." />
      </ContentCenteredTemplate>
    ),
    ready: () => <UserPageContentComponent />,
  },
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 2;
  margin-top: -6.25rem;
`;

const UserHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: var(${theme.palette.bnw1000});

  border: 1px solid var(${theme.palette.bnw900});
  box-shadow: ${theme.shadows[3]};
  border-radius: 12px;
  padding: 1.5rem 1.875rem;
  position: relative;

  & > *:not(:first-child) {
    align-self: start;
    justify-self: flex-end;

    ${breakpoints.devices.mobile} {
      justify-self: flex-start;
    }
  }

  ${breakpoints.devices.mobile} {
    grid-template-columns: unset;
    grid-auto-flow: row;
  }
`;

const UnderLay = styled.div<{ bg?: string }>`
  background: ${({ bg }) =>
    bg &&
    `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%), url("${bg}") no-repeat center`};
  background-size: cover;
  width: 100%;
  height: 8.75rem;
  margin-top: -1.875rem;
  z-index: 1;
`;

const UserSocial = styled.div`
  order: 1;

  ${breakpoints.devices.mobile} {
    order: 2;
  }
`;

const UserLogo = styled.div`
  display: flex;
  flex-direction: column;
  order: 2;

  ${breakpoints.devices.mobile} {
    order: 0;
  }
`;

const EditProfile = styled(Button)`
  display: flex;
  align-items: center;

  ${breakpoints.devices.mobile} {
    position: absolute;
    top: 1.5rem;
    right: 1.875rem;
  }
`;

const StAvatar = styled(Avatar)`
  background-color: var(${theme.palette.bnw1000});

  border: 1px solid var(${theme.palette.bnw850});
  border-radius: 3px;

  margin-bottom: 2.5rem;
  align-self: flex-end;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;

  & > *:last-child {
    margin-top: 6.25rem;
  }
`;

const UserFace = styled.div`
  display: flex;
  align-items: flex-start;
  order: 0;

  & > *:first-child {
    margin-right: 1.5rem;
  }

  ${breakpoints.devices.mobile} {
    order: 1;
  }
`;

const UserFaceContent = styled.div`
  & > *:first-child {
    margin-bottom: 0.375rem;
  }
`;

const UserFaceName = styled.div`
  font-size: 2.625rem;
  font-weight: 500;
  line-height: 3rem;
`;

const FontDescription = css`
  font-style: normal;
  font-weight: normal;
  font-size: 1.125rem;
  line-height: 1.5rem;
  max-width: 16.5rem;
  margin-top: 2.25rem;
`;

const UserFaceDescription = styled.div`
  ${FontDescription}
`;

const UserFacePosition = styled(UserFaceDescription)`
  color: var(${theme.palette.bnw500});
  margin-top: 0;
`;
const UserLocation = styled(UserFaceDescription)`
  color: var(${theme.palette.bnw600});
  margin-top: 0;
`;

const UserCards = styled.div`
  margin-bottom: 8.25rem;
`;

const SocialStaff = styled.div`
  & > *:first-child {
    margin-bottom: 1.125rem;
  }
`;

const SocialStaffTitle = styled.div`
  color: var(${theme.palette.bnw600});
  font-size: 0.9375rem;
`;

const SocialStaffList = styled.div`
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 0.9375rem;
  }
`;

const SocialStaffItem = styled.div`
  align-items: center;
  display: flex;

  & > a > *:first-child {
    margin-right: 12px;
  }
`;

const SocialStaffItemText = styled.span`
  color: var(${theme.palette.bnw0});
`;

const UserCardTitle = styled.div`
  font-size: 1.125rem;
  line-height: 1.375rem;
  color: var(${theme.palette.bnw0});
  padding: 0;
  margin-right: 1.875rem;
  margin-bottom: 20px;

  & > *:last-child {
    margin-right: 0;
  }
`;

const SocialLink = styled.a`
  ${FontDescription};
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-top: 0;
`;
