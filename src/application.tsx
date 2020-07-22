import * as React from 'react';
import styled from 'styled-components';
import { Provider } from 'effector-react/ssr';
import { Scope } from 'effector/fork';
import { createGlobalStyle } from 'styled-components';

import { Pages } from './pages';
import { Searchbar } from './features/searchbar';

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

export const Application: React.FC<Props> = ({ root }) => (
  <Provider value={root}>
    <Container>
      <Globals />
      <Searchbar />
      <PagesContainer>
        <PagesContent>
          <Pages />
        </PagesContent>
      </PagesContainer>
    </Container>
  </Provider>
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
`;

//Чтобы скролл страницы не сдвигал ее по горизонтали влево, иначе страница будет отцентрована левее чем хедер.
const PagesContent = styled.div`
  width: 100vw;
`;
