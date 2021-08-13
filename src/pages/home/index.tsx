import styled from 'styled-components';
import React, { useCallback } from 'react';
import type { Card } from '@box/api';
import { CardList } from '@box/entities/card';
import { ContentCenteredTemplate, Text, Toast, button } from '@box/ui';
import { Helmet } from 'react-helmet-async';
import { useStore } from 'effector-react/ssr';
import { userModel } from '@box/entities/user';
import { withStart } from '@box/lib/page-routing';

import * as model from './model';
import { paths } from '../paths';

export const HomePage = () => {
  const isLoading = useStore(model.$pagePending);
  const topCards = useStore(model.$topCards);
  const latestCards = useStore(model.$latestCards);
  const usersMap = useStore(userModel.$usersMap);

  // FIXME: temp handlers
  const handleUser = useCallback(
    (card: Card) => {
      const user = usersMap[card.authorId];
      return user;
    },
    [usersMap],
  );

  const handleUserHref = useCallback(
    (card: Card) => {
      const user = usersMap[card.authorId];
      return paths.user(user.username);
    },
    [usersMap],
  );

  const handleCardHref = useCallback((card: Card) => {
    return paths.card(card.id);
  }, []);

  return (
    <>
      <Helmet title="Welcome to Cardbox" />
      <ContentCenteredTemplate>
        <Hero>
          <HeroCol>
            <PrimaryText type="h1">Cardbox</PrimaryText>
            <Text type="h1">Storage of all your ideas</Text>
            <p>
              The purpose of this product is to create a convenient repository
              of your ideas with the ability to share them with others and keep
              all the accumulated knowledge up to date.
            </p>
          </HeroCol>
          <HeroCol>
            <ToastContainer>
              <Toast extra={<button.Secondary>More...</button.Secondary>}>
                Help us make the best idea storage service!
              </Toast>
            </ToastContainer>
          </HeroCol>
        </Hero>
        <Content>
          <Main>
            {/* FIXME: simplify */}
            {/* FIXME: handle empty? */}
            <Section>
              <SectionTitle type="h2">Top</SectionTitle>
              <CardList
                cards={topCards}
                getUser={handleUser}
                getHref={handleCardHref}
                getUserHref={handleUserHref}
                loading={isLoading}
              />
            </Section>
            <Section>
              <SectionTitle type="h2">Latest</SectionTitle>
              <CardList
                cards={latestCards}
                getUser={handleUser}
                getHref={handleCardHref}
                getUserHref={handleUserHref}
                loading={isLoading}
              />
            </Section>
            {/* TODO: Process "empty" case correctly */}
          </Main>
        </Content>
      </ContentCenteredTemplate>
    </>
  );
};

withStart(model.pageStart, HomePage);

const Hero = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  margin-bottom: 60px;
`;

const HeroCol = styled.div``;

const ToastContainer = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  width: 100%;
`;

const PrimaryText = styled(Text)`
  color: var(--wizard500);
`;

const Content = styled.div`
  display: flex;
  padding-bottom: 3rem;
`;

const Main = styled.div`
  /* NOTE: Maybe return back later or delete permanently */
  // width: 74.5%; /* 1044 / 1404 * 100 */
  width: 100%;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled(Text)`
  margin-bottom: 1rem;
`;
