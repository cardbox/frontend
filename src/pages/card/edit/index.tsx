import styled from 'styled-components';
import React, { useState } from 'react';
import { ContentCenteredTemplate, button } from '@box/ui';
import { Editor } from '@cardbox/editor';
import type { EditorValue } from '@cardbox/editor';
import { getValueNode } from '@box/lib/editor';

export const CardEditPage = () => {
  const [value, setValue] = useState<EditorValue>(getValueNode('Test'));

  return (
    <ContentCenteredTemplate>
      <Container>
        <Header>
          <Title placeholder="Card name" />
        </Header>
        <Content>
          <Editor value={value} onChange={setValue} />
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
