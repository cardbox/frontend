// import { createInspector } from 'effector-inspector';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { fork, hydrate } from 'effector/fork';

import { root } from 'effector-root';
import { Application } from './application';

// import { LOGGER_DOMAIN_NAME } from 'effector-logger/attach';
// createInspector({ trimDomain: LOGGER_DOMAIN_NAME });

hydrate(root, { values: INITIAL_STATE });

const scope = fork(root);

ReactDOM.hydrate(
  <BrowserRouter>
    <Application root={scope} />
  </BrowserRouter>,
  document.querySelector('#root'),
);

if (module.hot) {
  module.hot.accept();
}
