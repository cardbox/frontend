import React from 'react';
import styled from 'styled-components';
import { CardPreview, cardModel } from '@box/entities/card';
import { ContentCenteredTemplate, UserCard } from '@box/ui';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { avatarUri } from '@box/shared/constants';
import { useStart, withStart } from '@box/lib/page-routing';
import { useStore } from 'effector-react/ssr';

import * as model from './model';
import { paths } from '../../paths';

export const CardViewPage = () => {
  useStart(model.pageLoaded);
  const card = useStore(cardModel.$currentCard);
  const isLoading = useStore(model.$pagePending);
  const pageTitle = useStore(model.$pageTitle);

  return (
    <>
      <Helmet title={pageTitle} />
      <ContentCenteredTemplate>
        <Container>
          <Main>
            <CardPreview
              card={card}
              loading={isLoading}
              isCardInFavorite={false}
              type="details"
            />
            {/* TODO: Process "empty" case correctly */}
          </Main>
          <Sidebar>
            <UserCard user={user} />
            <Links>
              {card && (
                <LinkEdit to={paths.cardEdit(card.id)}>Edit card</LinkEdit>
              )}
              {card && (
                <LinkDelete disabled to="#delete">
                  Delete card
                </LinkDelete>
              )}
            </Links>
          </Sidebar>
        </Container>
      </ContentCenteredTemplate>
    </>
  );
};

withStart(model.pageLoaded, CardViewPage);

const user = {
  avatar: avatarUri,
  name: 'LangCreator',
  role: 'Owner',
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

const LinkDelete = styled(LinkBase)`
  color: #ef3a5b;
`;
