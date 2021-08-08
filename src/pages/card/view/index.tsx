import React from 'react';
import styled from 'styled-components';
import { CardPreview, cardModel } from '@box/entities/card';
import { ContentCenteredTemplate, UserCard, button } from '@box/ui';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { isViewerById } from '@box/entities/viewer/lib';
import { useEvent, useStore } from 'effector-react/ssr';
import { useStart, withStart } from '@box/lib/page-routing';
//FIXME
import { viewer } from '@box/api/mock/fixtures';

import * as model from './model';
import { paths } from '../../paths';

/**
 * Страница просмотра карточки
 */
// eslint-disable-next-line prettier/prettier
const DELETE_WARN = 'Are you sure you want to delete this card?';

export const CardViewPage = () => {
  useStart(model.pageLoaded);
  const card = useStore(cardModel.$currentCard);
  const isLoading = useStore(model.$pagePending);
  const pageTitle = useStore(model.$pageTitle);
  const deleteCard = useEvent(model.deleteCard);

  return (
    <>
      <Helmet title={pageTitle} />
      <ContentCenteredTemplate>
        <Container>
          <Main>
            <CardPreview
              card={card as any}
              loading={isLoading}
              isCardInFavorite={false}
              size="large"
            />
            {/* TODO: Process "empty" case correctly */}
          </Main>
          <Sidebar>
            <UserCard
              user={viewer}
              getUserHref={(user) => paths.user(user.username)}
            />
            <Links>
              {card && (
                <LinkEdit to={paths.cardEdit(card.id)}>Edit card</LinkEdit>
              )}
              {card && isViewerById(card.author.id as string) && (
                <ButtonDelete
                  type="button"
                  onClick={() => {
                    // FIXME: replace to UIKit implementation later
                    if (!window.confirm(DELETE_WARN)) return;
                    deleteCard();
                  }}
                >
                  Delete card
                </ButtonDelete>
              )}
            </Links>
          </Sidebar>
        </Container>
      </ContentCenteredTemplate>
    </>
  );
};

withStart(model.pageLoaded, CardViewPage);

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
  font-size: 0.9375rem;
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

const LinkEdit = styled(LinkBase)`
  color: #683aef;
`;

const ButtonDelete = styled(button.Text)`
  color: #ef3a5b;
  width: fit-content;
  height: auto;
  padding: 0;
`;
