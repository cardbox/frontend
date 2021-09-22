import styled from 'styled-components';
import React, { useCallback } from 'react';
import type { Card, User } from '@box/shared/api';
import { CardList } from '@box/entities/card';
import { ContentCenteredTemplate, IconArrowRight, Text, Toast } from '@box/shared/ui';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { createStore } from 'effector';
import { theme } from '@box/shared/lib/theme';
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
      <Toast
        extra={
          <MoreLink to={paths.home()}>
            More <IconArrowRight />
          </MoreLink>
        }
      >
        Help us make the best idea storage service!
      </Toast>
      <ContentCenteredTemplate>
        <Hero>
          <PrimaryText type="h1">Cardbox</PrimaryText>
          <Text type="h1">Storage of all your ideas</Text>
          <HeroText>
            The purpose of this product is to create a convenient repository of
            your ideas with the ability to share them with others and keep all
            the accumulated knowledge up to date.
          </HeroText>
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
  margin-top: 36px;
  margin-bottom: 66px;
`;

const PrimaryText = styled(Text)`
  color: var(${theme.palette.wizard500});
`;

const HeroText = styled.p`
  font-size: 18px;
  line-height: 24px;
  margin-bottom: 16px;
  margin-top: 16px;
  max-width: 800px;

  @media (max-width: 768px) {
    width: 100%;
  }
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

const MoreLink = styled(Link)`
  text-decoration: none;
  color: var(${theme.palette.bnw0});

  &:hover {
    opacity: 0.7;
  }

  svg {
    margin-left: 20px;
    vertical-align: middle;
  }
`;
