import React from 'react';
import { button } from '@box/ui';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from '../model';

// eslint-disable-next-line prettier/prettier
const CANCEL_WARN = 'Are you sure you want to undo the changes? The action is not reversible!';


/**
 * Сброс изменений по карточке
 * @remark Сброс до изначального состояния модели
 */
export const ResetChanges = () => {
  const draft = useStore(model.$draft);
  const resetChanges = useEvent(model.resetChanges);

  if (!draft) return null;

  return (
    <button.Base
      onClick={() => {
        // FIXME: replace to UIKit implementation later
        if (!window.confirm(CANCEL_WARN)) return;
        resetChanges(draft.id);
      }}
    >
      Cancel
    </button.Base>
  );
};
