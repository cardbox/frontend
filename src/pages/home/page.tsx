import * as React from 'react';
import styled from 'styled-components';
import { CardList } from '@cardbox/entities/card';
import { ContentCenteredTemplate } from '@cardbox/ui';
import { createStart, withStart } from '@cardbox/lib/page-routing';
import { createStore } from 'effector-root';

import { Card } from './types';

export const start = createStart();
export const $cards = createStore<Card[]>([]);

export const HomePage = withStart(start, () => {
  return (
    <ContentCenteredTemplate>
      <Container>
        <Main>
          <CardList cards={cards} />
        </Main>
      </Container>
    </ContentCenteredTemplate>
  );
});

const cards = [
  {
    id: 1,
    title:
      'Manage map or Set in effector store. Manage map or Set in effector store. Manage map or Set in effector store.',
    updatedAt: '05:03 03.01.2',
    author: 'Sova',
    content:
      'Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)',
  },
  {
    id: 2,
    title: 'Manage map or Set in effector store',
    updatedAt: '05:03 03.01.2',
    author: 'Sova',
    content:
      'Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)',
  },
  {
    id: 3,
    title: 'Manage map or Set in effector store',
    updatedAt: '05:03 03.01.2',
    author: 'Sova',
    content:
      'Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)',
  },
  {
    id: 4,
    title:
      'Manage map or Set in effector store. Manage map or Set in effector store. Manage map or Set in effector store.',
    updatedAt: '05:03 03.01.2',
    author: 'Sova',
    content:
      'Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)',
  },
  {
    id: 5,
    title:
      'Manage map or Set in effector store. Manage map or Set in effector store. Manage map or Set in effector store.',
    updatedAt: '05:03 03.01.2',
    author: 'Sova',
    content:
      'Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)',
  },
];

const Container = styled.div`
  display: flex;
  padding-bottom: 3rem;
`;

const Main = styled.div`
  width: 74.5%; /* 1044 / 1404 * 100 */
`;