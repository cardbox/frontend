import React from 'react';
import styled from 'styled-components';
import { Avatar, ContentCenteredTemplate } from '@cardbox/ui';
import { Card, CardList } from '@cardbox/entities/card';

export const UserPage = () => (
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
        <CardList cards={cards} />
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

const cards: Card[] = [
  {
    id: '1',
    previewContent: '',
    type: 'card',
    owner: { id: '123', type: 'user', displayName: '', active: true, avatarUrl: '' },
    title:
      'Manage map or Set in effector store. Manage map or Set in effector store. Manage map or Set in effector store.',
    updatedAt: '05:03 03.01.2',
    createdAt: '',
    savedCount: 1,
    content:
      'Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)',
  },
  {
    id: '2',
    previewContent: '',
    type: 'card',
    owner: { id: '123', type: 'user', displayName: '', active: true, avatarUrl: '' },
    title: 'Manage map or Set in effector store',
    updatedAt: '05:03 03.01.2',
    createdAt: '',
    savedCount: 0,
    content:
      'Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)',
  },
  {
    id: '3',
    previewContent: '',
    type: 'card',
    owner: { id: '123', type: 'user', displayName: '', active: true, avatarUrl: '' },
    title: 'Manage map or Set in effector store',
    updatedAt: '05:03 03.01.2',
    createdAt: '',
    savedCount: 1,
    content:
      'Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)',
  },
  {
    id: '4',
    previewContent: '',
    type: 'card',
    owner: { id: '123', type: 'user', displayName: '', active: true, avatarUrl: '' },
    title:
      'Manage map or Set in effector store. Manage map or Set in effector store. Manage map or Set in effector store.',
    updatedAt: '05:03 03.01.2',
    createdAt: '',
    savedCount: 1,
    content:
      'Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)',
  },
  {
    id: '5',
    previewContent: '',
    type: 'card',
    owner: { id: '123', type: 'user', displayName: '', active: true, avatarUrl: '' },
    title:
      'Manage map or Set in effector store. Manage map or Set in effector store. Manage map or Set in effector store.',
    updatedAt: '05:03 03.01.2',
    createdAt: '',
    savedCount: 1,
    content:
      'Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)',
  },
];

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
