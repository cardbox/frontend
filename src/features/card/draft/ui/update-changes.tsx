import React from 'react';
import { button } from '@box/ui';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from '../model';

/**
 * Сохранение изменений по карточке (edit)
 * @remark Сброс до изначального состояния модели
 */
export const UpdateChanges = () => {
  const submitChanges = useEvent(model.submitChanges);
  const isValidDraft = useStore(model.$isValidDraft);

  return (
    <button.Primary onClick={() => submitChanges()} disabled={!isValidDraft}>
      Save
    </button.Primary>
  );
};
