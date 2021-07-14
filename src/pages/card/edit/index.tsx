import React from 'react';
import styled from 'styled-components';
import { ContentCenteredTemplate, button } from '@box/ui';
import { Editor } from '@cardbox/editor';
import { useEvent, useStore } from 'effector-react/ssr';
import { useStart, withStart } from '@box/lib/page-routing';

import * as model from './model';

export const CardEditPage = () => {
  useStart(model.pageLoaded);
  const draft = useStore(model.$cardDraft);
  const isLoading = useStore(model.$pagePending);

  const setDraftTitle = useEvent(model.setDraftTitle);
  const setDraftContent = useEvent(model.setDraftContent);
  //   const pageTitle = useStore(model.$pageTitle);

  if (isLoading) return <>Loading...</>;
  if (!draft) return null;

  return (
    <ContentCenteredTemplate>
      <Container>
        <Header>
          <Title
            placeholder="Card name"
            value={draft.title}
            onChange={(e) => setDraftTitle(e.target.value)}
          />
        </Header>
        <Content>
          <Editor
            value={JSON.parse(draft.content)}
            onChange={(nextValue) => setDraftContent(JSON.stringify(nextValue))}
          />
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
