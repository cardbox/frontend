import React from 'react';
import { button } from '@box/ui';
import { useEvent } from 'effector-react/ssr';

import * as model from '../../model';

const CANCEL_WARN =
  'Are you sure you want to undo the changes? The action is not reversible!';

interface Props {
  _name: string;
}

/**
 * Сброс изменений по карточке
 * @remark Сброс до изначального состояния модели
 */
export const ResetChanges = ({ _name }: Props) => {
  const formReset = useEvent(model.formReset);

  return (
    <button.Base
      onClick={() => {
        // FIXME: replace to UIKit implementation later
        if (!window.confirm(CANCEL_WARN)) return;
        formReset(_name);
      }}
    >
      Cancel
    </button.Base>
  );
};
