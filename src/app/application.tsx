import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Provider } from 'effector-react/ssr';
import { QueryParamProvider } from 'use-query-params';
import { Route } from 'react-router';
import { Scope } from 'effector/fork';
import { Searchbar } from '@box/features/search-bar';
import { paths } from '@box/pages/paths';
// FIXME: replace later to usage of entities/viewer
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

  :root {
    --wizard1000: #FFF;
    --wizard950: #F6F5FF;
    --wizard900: #E8E6FE;
    --wizard850: #D6D2FE;
    --wizard800: #C0B9FE;
    --wizard750: #A59BFD;
    --wizard700: #8A7DFC;
    --wizard650: #6F5FFC;
    --wizard600: #5441FB;
    --wizard550: #3923FB;
    --wizard500: #1E05FA;
    --wizard450: #1A04DC;
    --wizard400: #1604BE;
    --wizard350: #1303A0;
    --wizard300: #0F0382;
    --wizard250: #0C0264;
    --wizard200: #080146;
    --wizard150: #05012D;
    --wizard100: #030119;
    --wizard50: #01000A;
    --wizard0: #000;

    --gray100: #fbfafb;

    --notice1000: #FFF;
    --notice950: #FEF6F7;
    --notice900: #FBE9EB;
    --notice850: #F9D8DB;
    --notice800: #F5C2C7;
    --notice750: #F1A7AF;
    --notice700: #EC8D97;
    --notice650: #E8737E;
    --notice600: #E45866;
    --notice550: #E03E4E;
    --notice500: #DB2436;
    --notice450: #C11F30;
    --notice400: #A71B29;
    --notice350: #8C1723;
    --notice300: #72131C;
    --notice250: #580E16;
    --notice200: #3D0A0F;
    --notice150: #27060A;
    --notice100: #160405;
    --notice50: #090102;
    --notice0: #000;

    --success1000: #FFF;
    --success950: #F7FDF9;
    --success900: #EBFAEF;
    --success850: #DAF6E3;
    --success800: #C6F1D3;
    --success750: #ADEBC0;
    --success700: #95E4AD;
    --success650: #7CDE9A;
    --success600: #64D887;
    --success550: #4BD274;
    --success500: #33CC61;
    --success450: #2DB455;
    --success400: #279B4A;
    --success350: #21833E;
    --success300: #1B6A32;
    --success250: #145227;
    --success200: #0E391B;
    --success150: #092511;
    --success100: #05140A;
    --success50: #020804;
    --success0: #000;

    /* black and white */
    --bnw1000: #FFF;
    --bnw950: #FAF9FA;
    --bnw900: #F1F1F3;
    --bnw850: #E6E6EA;
    --bnw800: #D9D8DF;
    --bnw750: #C8C7D1;
    --bnw700: #B8B7C3;
    --bnw650: #A8A6B5;
    --bnw600: #9795A7;
    --bnw550: #878599;
    --bnw500: #76748B;
    --bnw450: #68667A;
    --bnw400: #5A586A;
    --bnw350: #4C4A59;
    --bnw300: #3E3C48;
    --bnw250: #2F2E38;
    --bnw200: #212027;
    --bnw150: #151519;
    --bnw100: #0C0C0E;
    --bnw50: #050506;
    --bnw0: #000;

    /* todo: in figma it presents as it is, without name of variable */
    --unknown-2: #683aef;
    --unknown-3: #007bff;
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
        {/* FIXME:
          - научиться получать авторизированного пользователя и сюда прокидывать в поле user
          - или прокидывать в виджет напрямую фичи/сущности (Logo, SearchBar, UserAvatar, NewCard)
        */}
        <Searchbar
          logoHref={paths.home()}
          viewerHref={paths.user(viewer.username)}
          newCardHref={paths.cardCreate()}
        />
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
