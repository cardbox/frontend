import React from 'react';
import styled from 'styled-components';
import { Can } from '@cardbox/entities/session';
import { Card, CardPreview } from '@cardbox/entities/card';
import { ContentCenteredTemplate, UserCard } from '@cardbox/ui';

export const CardPage = () => (
  <ContentCenteredTemplate>
    <Container>
      <Main>
        <CardPreview card={card} />
      </Main>
      <Sidebar>
        <UserCard user={user} />
        <Links>
          <Can action={{ name: 'edit' }} resource={card}>
            <LinkEdit href="#edit">Edit card</LinkEdit>
          </Can>
          <Can action={{ name: 'delete' }} resource={card}>
            <LinkDelete href="#delete">Delete card</LinkDelete>
          </Can>
        </Links>
      </Sidebar>
    </Container>
  </ContentCenteredTemplate>
);

const card: Card = {
  id: '1',
  content: '',
  type: 'card',
  title:
    'Manage map or Set in effector store. Manage map or Set in effector store. Manage map or Set in effector store.',
  updatedAt: '05:03 03.01.2',
  createdAt: '05:03 03.01.2',
  savedCount: 0,
  owner: { id: '2', type: 'user', displayName: '', active: true },
  previewContent:
    'Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)',
};

const user = {
  avatar:
    'https://images.pexels.com/photos/2927811/pexels-photo-2927811.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  name: 'LangCreator',
  role: 'Owner',
};

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
`;

const Sidebar = styled.div`
  flex-shrink: 0;
  width: 324px;

  & > *:first-child {
    margin-bottom: 1.625rem;
  }
`;

const Links = styled.div`
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 0.5625rem;
  }
`;

const Link = styled.a`
  font-size: 0.9375rem;
  line-height: 1.1875rem;

  &:not(:hover) {
    text-decoration: none;
  }
`;

const LinkEdit = styled(Link)`
  color: #683aef;
`;

const LinkDelete = styled(Link)`
  color: #ef3a5b;
`;
