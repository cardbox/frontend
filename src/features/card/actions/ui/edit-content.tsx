import React from 'react';
import { Editor } from '@cardbox/editor';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from '../model';

/**
 * Редактирование контента карточки
 */
export const EditContent = () => {
  const draft = useStore(model.$draft);
  const setDraftContent = useEvent(model.setContent);

  if (!draft) return null;

  return (
    <Editor
      value={JSON.parse(draft.content)}
      onChange={(nextValue) => setDraftContent(JSON.stringify(nextValue))}
    />
  );
};
