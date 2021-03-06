import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fork } from 'effector/fork';
import { render } from 'react-dom';
import { root } from 'effector-root';

import { Application } from './application';

describe('<Application />', () => {
  test('renders without exploding', () => {
    const div = document.createElement('div');
    const scope = fork(root);
    render(
      <MemoryRouter>
        <Application root={scope} />
      </MemoryRouter>,
      div,
    );
  });
});
