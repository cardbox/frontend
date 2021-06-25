import * as React from 'react';
import styled from 'styled-components';
import { CardList, content } from '@box/entities/card';
import { ContentCenteredTemplate } from '@box/ui';
import { useStart, withStart } from '@box/lib/page-routing';

import * as model from './model';

export const HomePage = () => {
  useStart(model.pageLoaded);

  return (
    <ContentCenteredTemplate>
      <Container>
        <Main>
          <CardList cards={cards} />
        </Main>
      </Container>
    </ContentCenteredTemplate>
  );
};

withStart(model.pageLoaded, HomePage);

const cards = [
  {
    id: 1,
    title: 'Manage map or Set in effector store.',
    updatedAt: '05:03 03.01.2',
    author: 'Sova',
    content,
  },
  {
    id: 2,
    title: 'Manage map or Set in effector store',
    updatedAt: '05:03 03.01.2',
    author: 'Sova',
    content,
  },
  {
    id: 3,
    title: 'Manage map or Set in effector store',
    updatedAt: '05:03 03.01.2',
    author: 'Sova',
    content,
  },
  {
    id: 4,
    title: 'Manage map or Set in effector store.',
    updatedAt: '05:03 03.01.2',
    author: 'Sova',
    content,
  },
  {
    id: 5,
    title: 'Manage map or Set in effector store.',
    updatedAt: '05:03 03.01.2',
    author: 'Sova',
    content,
  },
];

const Container = styled.div`
  display: flex;
  padding-bottom: 3rem;
`;

const Main = styled.div`
  width: 74.5%; /* 1044 / 1404 * 100 */
`;
