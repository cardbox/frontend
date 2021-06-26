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
import { useStart, withStart } from '@box/lib/page-routing';
import { useStore } from 'effector-react/ssr';

import * as model from './model';

export const HomePage = () => {
  useStart(model.pageLoaded);
  const cards = useStore(cardModel.$cards);
  const isLoading = useStore(model.$pagePending);

  return (
    <ContentCenteredTemplate>
      <Hero>
        <HeroCol>
          <PrimaryText type={TextType.header1}>Cardbox</PrimaryText>
          <Text type={TextType.header1}>Storage of all your ideas</Text>
          <p>
            The purpose of this product is to create a convenient repository of
            your ideas with the ability to share them with others and keep all
            the accumulated knowledge up to date.
          </p>
        </HeroCol>
        <HeroCol>
          <div>
            <Toast extra={<button.Secondary>More...</button.Secondary>}>
              Help us make the best idea storage service!
            </Toast>
          </div>
        </HeroCol>
      </Hero>
      <Content>
        <Main>
          <CardList
            cards={cards}
            getHref={(card) => `/card/${card.id}`}
            loading={isLoading}
          />
          {/* TODO: Process "empty" case correctly */}
        </Main>
      </Content>
    </ContentCenteredTemplate>
  );
};

withStart(model.pageLoaded, HomePage);

const Hero = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
`;

const HeroCol = styled.div``;

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
