import React from 'react';
import styled, { css } from 'styled-components';
import {
  Avatar,
  Button,
  ContentCenteredTemplate,
  iconDeckArrow,
  iconUserBg,
} from '@box/ui';
import { CardList, cardModel } from '@box/entities/card';
import { imgLogo } from '@box/shared/assets';
import { useStart, withStart } from '@box/lib/page-routing';
import { useStore } from 'effector-react/ssr';
import { userLib, userModel } from '@box/entities/user';

import * as model from './model';
import { SkeletonLayout } from './skeleton';
import { paths } from '../paths';

export const UserPage = () => {
  useStart(model.pageLoaded);
  const userInfo = useStore(userModel.$currentUser);
  const cards = useStore(cardModel.$cards);
  const isLoading = useStore(model.$pagePending);

  // FIXME: simplify logic
  if (isLoading || !userInfo) return <SkeletonLayout />;

  const { work, bio, socials, avatar } = userInfo;
  const fullName = userLib.getFullName(userInfo);

  return (
    <>
      <UnderLay bg={iconUserBg} />
      <ContentCenteredTemplate>
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
                          <SocialStaffItemText>
                            @{social.username}
                          </SocialStaffItemText>
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
            </UserLogo>
            <EditProfile disabled theme="outline">
              <Icon src={iconDeckArrow} margin="0 1rem 0 0" />
              Edit profile
            </EditProfile>
          </UserHeader>
          <Main>
            <UserCards>
              <UserCardTitle>User cards</UserCardTitle>
              <CardList
                cards={cards}
                // FIXME: optimize rerenders
                getUser={() => userInfo}
                getHref={(card) => paths.card(card.id)}
                getUserHref={() => paths.user(userInfo.username)}
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
  background: #ffffff;

  border: 1px solid #eeeef1;
  box-shadow: 0px 6px 9px #fbfafb;
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

const EditProfile = styled(Button)`
  position: absolute;
  display: flex;
  align-items: center;
  right: 1.875rem;
  bottom: 1.5rem;
`;

const StAvatar = styled(Avatar)`
  background-color: #ffffff;

  border: 1px solid #eeeef1;
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
  color: #9b99ac;
  margin-top: 0;
`;
const UserLocation = styled(UserFaceDescription)`
  color: #9b99ac;
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
  color: #a39bb2;
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
  color: #000;
`;

const UserCardTitle = styled.div`
  font-size: 1.125rem;
  line-height: 1.375rem;
  color: #000000;
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
