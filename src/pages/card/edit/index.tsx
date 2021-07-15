import React from 'react';
import styled from 'styled-components';
import { ContentCenteredTemplate, button } from '@box/ui';
import { Editor } from '@cardbox/editor';
import { cardModel } from '@box/entities/card';
import { useEvent, useStore } from 'effector-react/ssr';
import { useStart, withStart } from '@box/lib/page-routing';

import * as model from './model';

const CANCEL_WARN =
  'Are you sure you want to undo the changes? The action is not reversible!';

export const CardEditPage = () => {
  useStart(model.pageLoaded);
  const draft = useStore(cardModel.draft.$draft);
  const isLoading = useStore(model.$pagePending);

  const setDraftTitle = useEvent(cardModel.draft.setTitle);
  const setDraftContent = useEvent(cardModel.draft.setContent);
  const resetChanges = useEvent(cardModel.draft.resetChanges);
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
            <button.Primary onClick={() => model.submitChangesFx(draft)}>
              Save
            </button.Primary>
            <button.Base
              onClick={() => {
                // FIXME: replace to UIKit implementation
                if (!window.confirm(CANCEL_WARN)) return;
                resetChanges(draft.id);
              }}
            >
              Cancel
            </button.Base>
          </ButtonGroup>
        </Footer>
      </Container>
    </ContentCenteredTemplate>
  );
};

withStart(model.pageLoaded, CardEditPage);

const Container = styled.div`
  margin: 30px 120px 120px 120px;
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
