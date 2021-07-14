import styled from 'styled-components';
import React, { useState } from 'react';
import { ContentCenteredTemplate, button } from '@box/ui';
import { Editor } from '@cardbox/editor';
import type { EditorValue } from '@cardbox/editor';
import { cardModel } from '@box/entities/card';
import { getValueNode } from '@box/lib/editor';
import { useStart, withStart } from '@box/lib/page-routing';
import { useStore } from 'effector-react/ssr';

import * as model from './model';

export const CardEditPage = () => {
  const [value, setValue] = useState<EditorValue>(getValueNode('Test'));
  useStart(model.pageLoaded);
  const card = useStore(cardModel.$currentCard);
  const isLoading = useStore(model.$pagePending);
  //   const pageTitle = useStore(model.$pageTitle);

  if (isLoading) return <>Loading...</>;
  if (!card) return null;

  return (
    <ContentCenteredTemplate>
      <Container>
        <Header>
          <Title placeholder="Card name" value={card.title} />
        </Header>
        <Content>
          <Editor value={getValueNode(card.content)} onChange={setValue} />
        </Content>
        <Footer>
          <ButtonGroup>
            <button.Primary>Save</button.Primary>
            <button.Base>Cancel</button.Base>
          </ButtonGroup>
        </Footer>
      </Container>
    </ContentCenteredTemplate>
  );
};

withStart(model.pageLoaded, CardEditPage);

const Container = styled.div`
  margin: 30px 120px 0 120px;
`;

// Layout
// FIXME: move to @box/ui/layout
const Header = styled.div`
  margin-bottom: 50px;
`;

const Content = styled.div`
  margin-left: -50px;
  min-height: 500px;
`;

const Footer = styled.div`
  margin-top: 100px;
`;

// Widgets
const Title = styled.input`
  font-size: 42px;
  border: 0;
  width: 100%;

  &:focus-visible {
    outline: 0;
  }
`;

// FIXME: move to @box/ui
const ButtonGroup = styled.div`
  button + button {
    margin-left: 12px;
  }
`;
