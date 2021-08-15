import React from 'react';
import { Button } from '@box/ui';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from '../../model';

interface Props {
  title?: string;
  _name: string;
}

/**
 * Сохранение изменений по карточке (edit)
 * @remark Сброс до изначального состояния модели
 */
export const SubmitChanges = ({ title = 'Submit', _name }: Props) => {
  const submitForm = useEvent(model.formSubmitted);
  const isValidDraft = useStore(model.$isValidDraft);

  return (
    <Button
      theme="primary"
      onClick={() => submitForm(_name)}
      disabled={!isValidDraft}
    >
      {title}
    </Button>
  );
};
