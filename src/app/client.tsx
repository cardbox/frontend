/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import { createInspector } from 'effector-inspector';
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Router } from 'react-router';
import { fork, hydrate } from 'effector/fork';
import { history } from '@box/entities/navigation';
import { root } from 'effector-root';

import { Application } from './application';

// import { LOGGER_DOMAIN_NAME } from 'effector-logger/attach';
// createInspector({ trimDomain: LOGGER_DOMAIN_NAME });

hydrate(root, { values: INITIAL_STATE });

const scope = fork(root);

ReactDOM.hydrate(
  <HelmetProvider>
    <Router history={history!}>
      <Application root={scope} />
    </Router>
  </HelmetProvider>,
  document.querySelector('#root'),
);

if (module.hot) {
  module.hot.accept();
}
