import React from 'react';
import styled, { css } from 'styled-components';
import {
  Avatar,
  ContentCenteredTemplate,
  button,
  iconDeckArrow,
  iconUserBg,
} from '@box/ui';
import { CardList, cardModel } from '@box/entities/card';
import { combine } from 'effector';
import { theme } from '@box/lib/theme';
import { useStart, withStart } from '@box/lib/page-routing';
import { useStore } from 'effector-react/ssr';
import { userModel } from '@box/entities/user';

import * as model from './model';
import { Skeleton } from './skeleton';
import { paths } from '../paths';

export const UserPage = () => {
  useStart(model.pageLoaded);
  const userInfo = useStore(userModel.$currentUser);
  const cards = useStore(cardModel.$cards);
  const isLoading = useStore(model.$pagePending);

  if (isLoading || !userInfo) return <Skeleton />;

  return (
    <>
      <UnderLay bg={iconUserBg} />
      <ContentCenteredTemplate>
        <Container>
          <UserHeader>
            <UserFace>
              <UserFaceContent>
                <UserFaceName>
                  {userInfo.firstName}&nbsp;
                  {userInfo.lastName}
                </UserFaceName>
                <UserFacePosition>{userInfo.work}</UserFacePosition>
                <UserLocation>Saint-Petersburg, Russia</UserLocation>
                <UserFaceDescription>{userInfo.bio}</UserFaceDescription>
              </UserFaceContent>
            </UserFace>
            <UserSocial>
              <SocialStaff>
                <SocialStaffTitle>Social staff</SocialStaffTitle>
                <SocialStaffList>
                  {userInfo.socials?.map(({ link, nickname }) => (
                    <SocialStaffItem key={`${nickname}`}>
                      <SocialLink href={link}>
                        <Avatar size="small" src={userInfo.avatar} />
                        <SocialStaffItemText>@{nickname}</SocialStaffItemText>
                      </SocialLink>
                    </SocialStaffItem>
                  ))}
                </SocialStaffList>
              </SocialStaff>
            </UserSocial>
            <UserLogo>
              <StAvatar size="large" src={userInfo.avatar} />
            </UserLogo>
            <EditProfile disabled>
              <Icon src={iconDeckArrow} margin="0 1rem 0 0" />
              Edit profile
            </EditProfile>
          </UserHeader>
          <Main>
            <UserCards>
              <UserCardTitle>User cards</UserCardTitle>
              <CardList
                cards={cards}
                getHref={(card) => paths.card(card.id)}
                getUserHref={(card) => paths.user(card.author.username)}
                loading={isLoading}
              />
            </UserCards>
          </Main>
        </Container>
      </ContentCenteredTemplate>
    </>
  );
};

withStart(model.pageLoaded, UserPage);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 2;
  margin-top: -6.25rem;
`;

const UserHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: var(${theme.palette.bnw0});

  border: 1px solid var(${theme.palette.bnw200});
  box-shadow: ${theme.shadows[2]};
  border-radius: 6px;
  padding: 1.5rem 1.875rem;
  position: relative;
  & > *:not(:first-child) {
    align-self: start;
    justify-self: flex-end;
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

const UserSocial = styled.div``;

const UserLogo = styled.div`
  display: flex;
  flex-direction: column;
`;

const EditProfile = styled(button.Outline)`
  position: absolute;
  display: flex;
  align-items: center;
  right: 1.875rem;
  bottom: 1.5rem;
`;

const StAvatar = styled(Avatar)`
  background-color: var(${theme.palette.bnw0});

  border: 1px solid var(${theme.palette.bnw200});
  border-radius: 3px;
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

  & > *:first-child {
    margin-right: 1.5rem;
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
  color: var(${theme.palette.bnw500});
  margin-top: 0;
`;

const Icon = styled.img<{ margin?: string }>`
  margin: ${({ margin }) => margin || 0};
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
  color: var(${theme.palette.unknown1});
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
  color: var(${theme.palette.bnw1000});
`;

const UserCardTitle = styled.div`
  font-size: 1.125rem;
  line-height: 1.375rem;
  color: var(${theme.palette.bnw1000});
  padding: 0;
  margin-right: 1.875rem;
  margin-bottom: 20px;
  & > *:last-child {
    margin-right: 0;
  }
`;

const SocialLink = styled.a`
  ${FontDescription}
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-top: 0;
`;
