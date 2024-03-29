import { useEvent } from 'effector-react/scope';
import React from 'react';

import { Button } from '@box/shared/ui';

import * as model from '../../model';

const CANCEL_WARN = 'Are you sure you want to undo the changes? The action is not reversible!';

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
    <Button
      theme="secondary"
      variant="outlined"
      onClick={() => {
        // FIXME: replace to UIKit implementation later
        // eslint-disable-next-line no-alert
        if (!window.confirm(CANCEL_WARN)) return;
        formReset(_name);
      }}
    >
      Cancel
    </Button>
  );
};
