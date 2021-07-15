import React from 'react';
import styled from 'styled-components';
import { Text, TextType } from '@box/ui';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from '../model';

/**
 * Редактирование заголовка карточки
 */
export const EditTitle = () => {
  const draft = useStore(model.$draft);
  const setDraftTitle = useEvent(model.setTitle);

  if (!draft) {
    return <Text type={TextType.header2}>Not Found</Text>;
  }

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
