import React from 'react';
import styled from 'styled-components';
import { CardPreview, cardModel } from '@box/entities/card';
import { ContentCenteredTemplate, UserCard } from '@box/ui';
import { useStart, withStart } from '@box/lib/page-routing';
import { useStore } from 'effector-react/ssr';

import * as model from './model';

export const CardPage = () => {
  useStart(model.pageLoaded);
  const card = useStore(cardModel.$currentCard);
  const isLoading = useStore(model.$pagePending);

  return (
    <ContentCenteredTemplate>
      <Container>
        <Main>
          <CardPreview
            card={card}
            loading={isLoading}
            isCardInFavorite={false}
          />
          {/* TODO: Process "empty" case correctly */}
        </Main>
        <Sidebar>
          <UserCard user={user} href="/user" />
          <Links>
            <LinkEdit href="#edit">Edit card</LinkEdit>
            <LinkDelete href="#delete">Delete card</LinkDelete>
          </Links>
        </Sidebar>
      </Container>
    </ContentCenteredTemplate>
  );
};

withStart(model.pageLoaded, CardPage);

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
