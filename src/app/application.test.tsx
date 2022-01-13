import { fork } from 'effector';
import React from 'react';
import { render } from 'react-dom';
import { MemoryRouter } from 'react-router-dom';

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
