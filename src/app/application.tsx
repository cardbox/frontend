import './custom-props.css';

import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Provider } from 'effector-react/ssr';
import { QueryParamProvider } from 'use-query-params';
import { Route } from 'react-router';
import { Scope } from 'effector/fork';
import { Searchbar } from '@box/features/search-bar';
import { viewer } from '@box/api/mock/fixtures';

import { Pages } from '../pages';

interface Props {
  root: Scope;
}

const Globals = createGlobalStyle`
  html {
    font-size: 16px;
  }

  body {
    margin: 0;
    overflow: hidden;
    padding: 0;
    font-family: sans-serif;
  }
`;

export const Application = ({ root }: Props) => (
  <QueryParamProvider ReactRouterRoute={Route}>
    <Provider value={root}>
      <Container>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          titleTemplate="%s | Cardbox"
          defaultTitle="Welcome to Cardbox"
        >
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        <Globals />
        {/* FIXME: научиться получать авторизированного пользователя и сюда прокидывать в поле user */}
        <Searchbar user={viewer} />
        <PagesContainer>
          <PagesContent>
            <Pages />
          </PagesContent>
        </PagesContainer>
      </Container>
    </Provider>
  </QueryParamProvider>
);

// Разметка для того, чтобы скроллился только PagesContainer
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const PagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding-top: 1.875rem;
`;

//Чтобы скролл страницы не сдвигал ее по горизонтали влево, иначе страница будет отцентрована левее чем хедер.
const PagesContent = styled.div`
  width: 100vw;
`;
