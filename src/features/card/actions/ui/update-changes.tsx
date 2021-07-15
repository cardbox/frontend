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

  return (
    <button.Primary
      onClick={() => model.submitChangesFx(draft)}
      disabled={!draft}
    >
      Save
    </button.Primary>
  );
};
