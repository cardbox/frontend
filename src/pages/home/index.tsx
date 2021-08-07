import React from 'react';
import styled from 'styled-components';
import { CardList, cardModel } from '@box/entities/card';
import {
  ContentCenteredTemplate,
  Text,
  TextType,
  Toast,
  button,
} from '@box/ui';
import { Helmet } from 'react-helmet-async';
import { useStart, withStart } from '@box/lib/page-routing';
import { useStore } from 'effector-react/ssr';

import * as model from './model';
import { paths } from '../paths';

export const HomePage = () => {
  useStart(model.pageLoaded);
  const cards = useStore(cardModel.$cards);
  const isLoading = useStore(model.$pagePending);

  return (
    <>
      <Helmet title="Welcome to Cardbox" />
      <ContentCenteredTemplate>
        <Hero>
          <HeroCol>
            <PrimaryText type={TextType.header1}>Cardbox</PrimaryText>
            <Text type={TextType.header1}>Storage of all your ideas</Text>
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
            <CardList
              cards={cards as any}
              getHref={(card) => paths.card(card.id)}
              getUserHref={(card) => paths.user(card.author.username)}
              loading={isLoading}
            />
            {/* TODO: Process "empty" case correctly */}
          </Main>
        </Content>
      </ContentCenteredTemplate>
    </>
  );
};

withStart(model.pageLoaded, HomePage);

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
