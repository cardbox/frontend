import * as React from 'react';
import { createGlobalStyle } from 'styled-components';

import { Scope } from 'effector/fork';
import { Provider } from 'effector-react/ssr';

import { Pages } from './pages';

interface Props {
  root: Scope;
}

const Globals = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }
`;

export const Application: React.FC<Props> = ({ root }) => (
  <Provider value={root}>
    <div>
      <Globals />
      <div>Heading of the app</div>
      <Pages />
    </div>
  </Provider>
);
