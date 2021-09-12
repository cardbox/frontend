import React from 'react';
import styled from 'styled-components';
import {
  Button,
  ContentCenteredTemplate,
  iconDeckCheck,
  iconEdit,
} from '@box/ui';
import { Card, User } from '@box/api/index';
import { CardPreview } from '@box/entities/card';
import { Helmet } from 'react-helmet-async';
import { UserCard } from '@box/entities/user';
import { createEvent, createStore } from 'effector';
import { navigationModel } from '@box/entities/navigation';
import { theme } from '@box/lib/theme';
import { useEvent, useStore } from 'effector-react/ssr';

import { paths } from '../../paths';

// eslint-disable-next-line prettier/prettier
const DELETE_WARN = 'Are you sure you want to delete this card?';

export const $currentCard = createStore<Card | null>(null);
export const $pagePending = createStore(false);
export const $pageTitle = createStore('');
export const $cardAuthor = createStore<User | null>(null);
export const $isAuthorViewing = createStore(false);

export const deleteCard = createEvent();

export const CardViewPage = () => {
  const card = useStore($currentCard);
  const isLoading = useStore($pagePending);
  const pageTitle = useStore($pageTitle);
  const author = useStore($cardAuthor);
  const isAuthorViewing = useStore($isAuthorViewing);

  const historyPush = useEvent(navigationModel.historyPush);
  const handleDeleteCard = useEvent(deleteCard);
  const handleEditCard = (id: string) => historyPush(paths.cardEdit(id));

  return (
    <>
      <Helmet title={pageTitle} />
      <ContentCenteredTemplate>
        <Container>
          <Main>
            {card && author && (
              <CardPreview
                card={card}
                author={author}
                loading={isLoading}
                isCardInFavorite={false}
                size="large"
              />
            )}
            {/* TODO: Process "empty" case correctly */}
          </Main>
          <Sidebar>
            {author && (
              <UserCard
                user={author}
                getUserHref={(user) => paths.user(user.username)}
              />
            )}
            {card && isAuthorViewing && (
              <Buttons>
                <ButtonEdit
                  type="button"
                  theme="secondary"
                  variant="outlined"
                  icon={<img src={iconEdit} title="Edit card" />}
                  onClick={() => handleEditCard(card.id)}
                >
                  Edit card
                </ButtonEdit>
                <ButtonDelete
                  type="button"
                  theme="secondary"
                  variant="outlined"
                  icon={<img src={iconDeckCheck} title="Delete card" />}
                  onClick={() => {
                    // FIXME: replace to UIKit implementation later
                    if (!window.confirm(DELETE_WARN)) return;
                    handleDeleteCard();
                  }}
                >
                  Delete card
                </ButtonDelete>
              </Buttons>
            )}
          </Sidebar>
        </Container>
      </ContentCenteredTemplate>
    </>
  );
};

const map = (props: { disabled?: boolean }) => ({
  'data-disabled': props.disabled,
});

const Container = styled.div`
  display: flex;
  padding: 0 126px 126px 126px;

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

const Buttons = styled.div`
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 0.5625rem;
  }
`;

const ButtonEdit = styled(Button)`
  justify-content: flex-start;
`;

const ButtonDelete = styled(Button)`
  color: var(${theme.palette.notice550});
  justify-content: flex-start;
`;
