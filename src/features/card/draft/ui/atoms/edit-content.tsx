import { Editor, useExtendedEditor } from '@cardbox/editor';
import type { EditorValue } from '@cardbox/editor';
import { useEvent, useStore } from 'effector-react/scope';
import React, { useCallback } from 'react';
import styled from 'styled-components';

import * as model from '../../model';

/**
 * Редактирование контента карточки
 */
export const EditContent = () => {
  const editor = useExtendedEditor();
  const content = useStore(model.$content);
  const contentChange = useEvent(model.contentChanged);

  const handleChange = useCallback((nextValue: EditorValue) => contentChange(nextValue), []);

  return (
    <Container>
      <Editor editor={editor} value={content} onChange={handleChange} />
    </Container>
  );
};

const Container = styled.div`
  /* Делаем отступ, из-за того что в Editor изначально заложен отступ для боковых действий над блоками */
  margin-left: -50px;
`;
