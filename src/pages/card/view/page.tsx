import React from 'react';
import styled from 'styled-components';
import { Button, ContentCenteredTemplate } from '@box/ui';
import { Card, User } from '@box/api/index';
import { CardPreview } from '@box/entities/card';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { UserCard } from '@box/entities/user';
import { createEvent, createStore } from 'effector-root';
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

  const handleDeleteCard = useEvent(deleteCard);

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
              <Links>
                <LinkEdit to={paths.cardEdit(card.id)}>Edit card</LinkEdit>
                <ButtonDelete
                  type="button"
                  theme="danger"
                  variant="text"
                  onClick={() => {
                    // FIXME: replace to UIKit implementation later
                    if (!window.confirm(DELETE_WARN)) return;
                    handleDeleteCard();
                  }}
                >
                  Delete card
                </ButtonDelete>
              </Links>
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

const Links = styled.div`
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 0.5625rem;
  }
`;

const LinkBase = styled(Link).attrs(map)<{ disabled?: boolean }>`
  line-height: 1.1875rem;

  &:not(:hover) {
    text-decoration: none;
  }

  &[data-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.5;
    text-decoration: none;
  }
`;

// todo: change view for links (according to design from figma)
const LinkEdit = styled(LinkBase)`
  color: var(${theme.palette.wizard550});
`;

const ButtonDelete = styled(Button)`
  width: fit-content;
  height: auto;
  padding: 0;
`;
