import styled from 'styled-components';
import React, { useCallback } from 'react';
import { Editor } from '@cardbox/editor';
import type { EditorValue } from '@cardbox/editor';
import { Skeleton } from '@box/ui';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from '../model';

/**
 * Редактирование контента карточки
 */
export const EditContent = () => {
  const content = useStore(model.$content);
  const isValidContent = useStore(model.$isValidContent);
  const setDraftContent = useEvent(model.setContent);

  const handleChange = useCallback(
    (nextValue: EditorValue) => setDraftContent(nextValue),
    [],
  );

  if (!isValidContent) {
    return <Skeleton style={{ height: 500 }} />;
  }
  return (
    <Container>
      <Editor value={content} onChange={handleChange} />
    </Container>
  );
};

const Container = styled.div`
  /* Делаем отступ, из-за того что в Editor изначально заложен отступ для боковых действий над блоками */
  margin-left: -50px;
`;
