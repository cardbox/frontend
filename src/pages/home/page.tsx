import { createStore } from 'effector';
import { useStore } from 'effector-react/scope';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';

import { CardList } from '@box/entities/card';

import type { Card } from '@box/shared/api';
import { breakpoints } from '@box/shared/lib/breakpoints';
import { theme } from '@box/shared/lib/theme';
import { ContentCenteredTemplate, IconArrowRight, Text, Toast } from '@box/shared/ui';

export const $pagePending = createStore(false);
export const $topCards = createStore<Card[]>([]);
export const $latestCards = createStore<Card[]>([]);

export const HomePage: React.FC = () => {
  const isLoading = useStore($pagePending);
  // const topCards = useStore($topCards);
  const latestCards = useStore($latestCards);

  return (
    <>
      <Helmet title="Welcome to Cardbox" />
      <Toast
        extra={
          <MoreLink
            title="Telegram chat with support"
            href="https://t.me/joinchat/Zu-xxWESnbw0MmUy"
            target="_blank"
            rel="noopener"
          >
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
            The purpose of this product is to create a convenient repository of your ideas with the
            ability to share them with others and keep all the accumulated knowledge up to date.
          </HeroText>
        </Hero>
        <Content>
          <Main>
            {/* FIXME: simplify */}
            {/* FIXME: handle empty? */}
            {/*<Section>
              <SectionTitle type="h2">Top</SectionTitle>
              <CardList
                cards={topCards}
                getUser={handleUser}
                getUserHref={handleUserHref}
                loading={isLoading}
              />
            </Section>
            */}
            <Section>
              <SectionTitle type="h2">Latest</SectionTitle>
              <CardList cards={latestCards} loading={latestCards.length === 0 && isLoading} />
            </Section>
            {/* TODO: Process "empty" case correctly */}
          </Main>
        </Content>
      </ContentCenteredTemplate>
    </>
  );
};

const Hero = styled.div`
  margin-top: 2.25rem;
  margin-bottom: 4.125rem;
`;

const PrimaryText = styled(Text)`
  color: var(${theme.palette.wizard500});
`;

const HeroText = styled.p`
  font-size: 1.125rem;
  line-height: 1.5rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  max-width: 800px;

  ${breakpoints.devices.tablet} {
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

const MoreLink = styled.a`
  display: flex;
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
