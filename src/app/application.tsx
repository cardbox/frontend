import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Provider } from 'effector-react/ssr';
import { QueryParamProvider } from 'use-query-params';
import { Route } from 'react-router';
import { Scope } from 'effector/fork';
import { Searchbar } from '@box/features/search-bar';
import { paths } from '@box/pages/paths';

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

  :root {
    --wizard500: #4231ff;
    --wizard300: #b6Afff;
    --wizard100: #f7f6ff;

    --gray100: #fbfafb;

    --notice500: #ef3a5b;

    /* backgrounds */
    --bnw0: #fff;
    --bnw100: #fbfafb;
    --bnw200: #eeeef1;
    --bnw500: #9b99ac;
    --bnw700: #62616d;
    --bnw1000: #000;

    /* todo: in figma it presents as it is, without name of variable */
    --unknown-1: #a39bb2;
    --unknown-2: #683aef;
    --unknown-3: #007bff;
    --unknown-4: #f7f6f9;
    --unknown-5: #1a1e23;
    --unknown-6: #e7e5ee;
    --unknown-7: #f6f5f8;
    --unknown-8: #f4f2f7;
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
        <Searchbar getUserHref={(user) => paths.user(user.username)} />
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
