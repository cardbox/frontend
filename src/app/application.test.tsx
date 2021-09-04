import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fork } from 'effector';
import { render } from 'react-dom';

import { Application } from './application';

describe('<Application />', () => {
  test('renders without exploding', () => {
    const div = document.createElement('div');
    const scope = fork();
    render(
      <MemoryRouter>
        <Application root={scope} />
      </MemoryRouter>,
      div,
    );
  });
});
