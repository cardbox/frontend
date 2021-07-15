import React from 'react';
import { button } from '@box/ui';
import { useStore } from 'effector-react/ssr';

import * as model from '../model';

/**
 * Сохранение изменений по карточке (edit)
 * @remark Сброс до изначального состояния модели
 */
export const UpdateChanges = () => {
  const draft = useStore(model.$draft);

  if (!draft) return null;

  return (
    <button.Primary onClick={() => model.submitChangesFx(draft)}>
      Save
    </button.Primary>
  );
};
