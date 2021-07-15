import React from 'react';
import { button } from '@box/ui';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from '../model';

/**
 * Сохранение изменений по карточке (edit)
 * @remark Сброс до изначального состояния модели
 */
export const UpdateChanges = () => {
  const draft = useStore(model.$draft);
  const submitChanges = useEvent(model.submitChanges);

  return (
    <button.Primary onClick={() => submitChanges(draft)} disabled={!draft}>
      Save
    </button.Primary>
  );
};
