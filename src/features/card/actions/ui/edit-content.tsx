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
  const draftNode = useStore(model.$draftContentNode);
  const setDraftContent = useEvent(model.setContent);

  const handleChange = useCallback(
    (nextValue: EditorValue) => setDraftContent(JSON.stringify(nextValue)),
    [],
  );

  if (!draftNode) {
    return <Skeleton style={{ height: 500 }} />;
  }
  // eslint-disable-next-line prettier/prettier
  return (
    <EditorAligned
      value={draftNode}
      // @ts-ignore
      // FIXME: Чет ТС начинает чудить, когда мы покрываем Editor стайледами,
      // Пока хз как быть, но обязон поправим
      onChange={handleChange}
    />
  );
};

const EditorAligned = styled(Editor)`
  margin-left: -50px;
`;
