import React, { useCallback } from 'react';
import { Editor } from '@cardbox/editor';
import type { EditorValue } from '@cardbox/editor';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from '../model';

/**
 * Редактирование контента карточки
 */
export const EditContent = () => {
  const draftNode = useStore(model.$draftContentNode);
  const setDraftContent = useEvent(model.setContent);

  const handleChange = useCallback(
    (nextValue: EditorValue) => setDraftContent(JSON.stringify(nextValue)),
    [],
  );

  if (!draftNode) return null;
  // eslint-disable-next-line prettier/prettier
  return (
    <Editor
      value={draftNode}
      onChange={handleChange}
    />
  );
};
