import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Scope } from 'effector';
import { Provider } from 'effector-react/scope';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Route } from 'react-router';
import styled, { createGlobalStyle } from 'styled-components';
import { QueryParamProvider } from 'use-query-params';

import { EditorGlobalStyles } from '@cardbox/editor';

import { globalFonts } from '@box/app/styles/global-fonts';
import { ShowOnly } from '@box/entities/session';
import { Searchbar } from '@box/features/search-bar';
import { InvitePage } from '@box/pages/invite';
import { breakpoints } from '@box/shared/lib/breakpoints';
import { customProps } from '@box/shared/lib/theme';

import { Pages } from '../pages';
import './application.css';

dayjs.extend(relativeTime);

// FIXME: replace later to usage of entities/viewer

interface Props {
  root: Scope;
}

const Globals = createGlobalStyle`
  html {
    font-size: 16px;

    ${breakpoints.devices.tablet} {
      font-size: 80%;
    }
  }

  body {
    margin: 0;
    overflow: hidden;
    padding: 0;
    font-family: 'TT Hoves', sans-serif;
  }
  * {
    box-sizing: border-box;
  }

  ${globalFonts}
  ${customProps}
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
        <EditorGlobalStyles />
        <ShowOnly when="authorized">
          <Searchbar />
          <PagesContainer>
            <PagesContent>
              <Pages />
            </PagesContent>
          </PagesContainer>
        </ShowOnly>
        <ShowOnly when="anonymous">
          <InvitePage />
        </ShowOnly>
      </Container>
    </Provider>
  </QueryParamProvider>
);

// Разметка для того, чтобы скроллился только PagesContainer
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  ${breakpoints.devices.mobile} {
    overflow-y: auto;
  }
`;

const PagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding-top: 1.875rem;

  ${breakpoints.devices.mobile} {
    overflow-y: unset;
  }
`;

//Чтобы скролл страницы не сдвигал ее по горизонтали влево, иначе страница будет отцентрована левее чем хедер.
const PagesContent = styled.div`
  width: 100%;
`;
