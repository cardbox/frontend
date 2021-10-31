import styled from 'styled-components';
import React, { useCallback } from 'react';
import {
  Button,
  ContentCenteredTemplate,
  Empty,
  IconDeckCheck,
  IconEdit,
} from '@box/shared/ui';
import { Card, User } from '@box/shared/api/index';
import { CardPreview } from '@box/entities/card';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { UserCard } from '@box/entities/user';
import { createEvent, createStore } from 'effector';
import { theme } from '@box/shared/lib/theme';
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

  const handleDeleteCard = useEvent(deleteCard);

  if (!card && !isLoading) {
    return (
      <Empty text="Sorry, the page you visited does not exist.">
        <LinkHome to={paths.home()}>Back Home</LinkHome>
      </Empty>
    );
  }

  return (
    <>
      <Helmet title={pageTitle} />
      <ContentCenteredTemplate>
        <Container>
          <Main>
            {card && author && (
              <CardPreview card={card} loading={isLoading} size="large" />
            )}
            {/* TODO: Process "empty" case correctly */}
          </Main>
          <Sidebar>
            {author && <UserCard user={author} />}
            {card && isAuthorViewing && (
              <Buttons>
                <Link to={paths.cardEdit(card.id)}>
                  <ButtonCard
                    type="button"
                    theme="secondary"
                    variant="outlined"
                    icon={<IconEdit />}
                  >
                    Edit card
                  </ButtonCard>
                </Link>
                <ButtonCard
                  type="button"
                  theme="danger"
                  variant="outlined"
                  icon={<IconDeckCheck />}
                  onClick={() => {
                    // FIXME: replace to UIKit implementation later
                    // eslint-disable-next-line no-alert
                    if (!window.confirm(DELETE_WARN)) return;
                    handleDeleteCard();
                  }}
                >
                  Delete card
                </ButtonCard>
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

  a {
    text-decoration: none;
  }
`;

const ButtonCard = styled(Button)`
  justify-content: flex-start;
  width: 100%;
`;

const LinkHome = styled(Link)`
  --base-color: var(${theme.palette.wizard500});

  color: var(--base-color);
  margin-top: 2rem;
  &:hover {
    opacity: 0.7;
  }
`;
