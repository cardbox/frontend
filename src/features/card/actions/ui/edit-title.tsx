import React from 'react';
import styled from 'styled-components';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from '../model';

/**
 * Редактирование заголовка карточки
 */
export const EditTitle = () => {
  const draft = useStore(model.$draft);
  const setDraftTitle = useEvent(model.setTitle);

  if (!draft) return null;

  return (
    <Title
      placeholder="Card name"
      value={draft.title}
      onChange={(e) => setDraftTitle(e.target.value)}
    />
  );
};

const Title = styled.input`
  font-size: 42px;
  border: 0;
  width: 100%;

  &:focus-visible {
    outline: 0;
  }
`;
