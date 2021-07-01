import React from 'react';
import styled from 'styled-components';
import {
  Avatar,
  ContentCenteredTemplate,
  Tab,
  Tabs,
  iconUserBg,
  button,
  iconDeckArrow,
} from '@box/ui';
import { CardList, cardModel } from '@box/entities/card';
import { useStart, withStart } from '@box/lib/page-routing';
import { useStore } from 'effector-react/ssr';

import * as model from './model';
import { avatarUri } from '../../shared/constants';
import { paths } from '../paths';

export const UserPage = () => {
  useStart(model.pageLoaded);
  const cards = useStore(cardModel.$cards);
  const reversedCards = [...cards].reverse();
  const isLoading = useStore(model.$pagePending);

  return (
    <>
      <UnderLay bg={iconUserBg} />
      <ContentCenteredTemplate>
        <Container>
          <UserHeader>
            <UserFace>
              <UserFaceContent>
                <UserFaceName>LangCreator</UserFaceName>
                <UserFacePosition>
                  Frontend Lead at Yandex Music
                </UserFacePosition>
                <UserLocation>Saint-Petersburg, Russia</UserLocation>
                <UserFaceDescription>
                  Username description first row, second row
                </UserFaceDescription>
              </UserFaceContent>
            </UserFace>
            <UserSocial>
              <SocialStaff>
                <SocialStaffTitle>Social staff</SocialStaffTitle>
                <SocialStaffList>
                  <SocialStaffItem>
                    <Avatar size="small" src={avatarUri} />
                    <SocialStaffItemText>Usernamegit</SocialStaffItemText>
                  </SocialStaffItem>
                  <SocialStaffItem>
                    <Avatar size="small" src={avatarUri} />
                    <SocialStaffItemText>Usernamegit</SocialStaffItemText>
                  </SocialStaffItem>
                </SocialStaffList>
              </SocialStaff>
            </UserSocial>
            <UserLogo>
              <StAvatar size="large" src={avatarUri} />
            </UserLogo>
            <EditProfile disabled>
              <Icon src={iconDeckArrow} margin="0 1rem 0 0" />
              Edit profile
            </EditProfile>
          </UserHeader>
          <Main>
            <UserCards>
              <Tabs>
                <Tab label="My cards">
                  <CardList
                    cards={cards}
                    getHref={(card) => paths.card(card.id)}
                    loading={isLoading}
                  />
                  {/* TODO: Process "empty" case correctly */}
                </Tab>
                <Tab label="Saved">
                  <CardList
                    cards={reversedCards}
                    getHref={(card) => paths.card(card.id)}
                    loading={isLoading}
                  />
                  {/* TODO: Process "empty" case correctly */}
                </Tab>
              </Tabs>
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

const EditProfile = styled(button.Outline)`
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

const UserFaceFollowers = styled.div`
  font-size: 0.938rem;
  line-height: 1.125rem;
  margin-bottom: 1rem;
`;

const UserFaceDescription = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 1.125rem;
  line-height: 1.5rem;
  max-width: 16.5rem;
  margin-top: 2.25rem;
`;

const UserFacePosition = styled(UserFaceDescription)`
  color: #9b99ac;
  margin-top: 0;
`;
const UserLocation = styled(UserFaceDescription)`
  color: #9b99ac;
  margin-top: 0;
`;

const UserActions = styled.div`
  display: flex;
  margin-left: 3.375rem;
  & > *:first-child {
    margin-right: 0.938rem;
  }
`;

const Icon = styled.img<{ margin?: string }>`
  margin: ${({ margin }) => margin || 0};
`;

const UserCards = styled.div`
  margin-bottom: 8.25rem;
`;

const Sidebar = styled.div`
  flex-shrink: 0;
  width: 324px;
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

  & > *:first-child {
    margin-right: 12px;
  }
`;

const SocialStaffItemText = styled.div`
  font-size: 0.9375rem;
`;
