import styled from 'styled-components';
import React, { useCallback } from 'react';
import { Button, ContentCenteredTemplate, Text, Toast } from '@box/ui';
import type { Card, User } from '@box/api';
import { CardList } from '@box/entities/card';
import { Helmet } from 'react-helmet-async';
import { createStore } from 'effector';
import { theme } from '@box/lib/theme';
import { useStore } from 'effector-react/ssr';

import { paths } from '../paths';

export const $pagePending = createStore(false);
export const $topCards = createStore<Card[]>([]);
export const $latestCards = createStore<Card[]>([]);
export const $usersMap = createStore<Record<string, User>>({});

export const HomePage: React.FC = () => {
  const isLoading = useStore($pagePending);
  const topCards = useStore($topCards);
  const latestCards = useStore($latestCards);
  const usersMap = useStore($usersMap);

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
    return paths.cardView(card.id);
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
              <Toast extra={<Button theme="secondary">More...</Button>}>
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
  color: var(${theme.palette.wizard500});
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
