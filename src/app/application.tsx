import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Provider } from 'effector-react/ssr';
import { QueryParamProvider } from 'use-query-params';
import { Route } from 'react-router';
import { Scope } from 'effector/fork';
import { Link } from 'react-router-dom';

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
        <Globals />
        <PagesContainer>
          <Link to={"card/18bc22a5-bf9b-409a-9913-fb42ef0fcfbe"}> </Link>
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
  width: 100%;
`;
