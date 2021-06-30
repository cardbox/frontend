import React from 'react';
import styled from 'styled-components';
import { Avatar, ContentCenteredTemplate } from '@box/ui';
import { CardList, cardModel } from '@box/entities/card';
import { useStart, withStart } from '@box/lib/page-routing';
import { useStore } from 'effector-react/ssr';

import * as model from './model';
import { paths } from '../paths';

export const UserPage = () => {
  useStart(model.pageLoaded);
  const cards = useStore(cardModel.$cards);
  const isLoading = useStore(model.$pagePending);

  return (
    <ContentCenteredTemplate>
      <Container>
        <Main>
          <UserFace>
            <Avatar
              size="large"
              src="https://images.pexels.com/photos/2927811/pexels-photo-2927811.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            />
            <UserFaceContent>
              <UserFaceName>LangCreator</UserFaceName>
              <UserFaceDescription>Username description</UserFaceDescription>
            </UserFaceContent>
          </UserFace>
          <CardList
            cards={cards}
            getHref={(card) => paths.card({ id: card.id })}
            loading={isLoading}
          />
          {/* TODO: Process "empty" case correctly */}
        </Main>
        <Sidebar>
          <SocialStaff>
            <SocialStaffTitle>Social staff</SocialStaffTitle>
            <SocialStaffList>
              <SocialStaffItem>
                <Avatar
                  size="small"
                  src="https://images.pexels.com/photos/2927811/pexels-photo-2927811.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                />
                <SocialStaffItemText>Usernamegit</SocialStaffItemText>
              </SocialStaffItem>
              <SocialStaffItem>
                <Avatar
                  size="small"
                  src="https://images.pexels.com/photos/2927811/pexels-photo-2927811.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                />
                <SocialStaffItemText>Usernamegit</SocialStaffItemText>
              </SocialStaffItem>
            </SocialStaffList>
          </SocialStaff>
        </Sidebar>
      </Container>
    </ContentCenteredTemplate>
  );
};

withStart(model.pageLoaded, UserPage);

const Container = styled.div`
  display: flex;

  & > *:first-child {
    margin-right: 2.25rem;
  }
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
  align-items: center;
  display: flex;

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

const UserFaceDescription = styled.div`
  font-size: 0.75rem;
  line-height: 0.9375rem;
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
