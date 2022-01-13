import { useEvent, useStore } from 'effector-react/scope';
import React from 'react';
import styled from 'styled-components';

import * as model from '../../model';

/**
 * Редактирование заголовка карточки
 */
export const EditTitle = () => {
  const title = useStore(model.$title);
  const titleChange = useEvent(model.titleChanged);

  return (
    <Title placeholder="Card name" value={title} onChange={(e) => titleChange(e.target.value)} />
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
