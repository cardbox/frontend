import React from 'react';
import { button } from '@box/ui';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from '../../model';

interface Props {
  title?: string;
}

/**
 * Сохранение изменений по карточке (edit)
 * @remark Сброс до изначального состояния модели
 */
export const SubmitChanges = ({ title = 'Submit' }: Props) => {
  const submitForm = useEvent(model.formSubmitted);
  const isValidDraft = useStore(model.$isValidDraft);

  return (
    <button.Primary onClick={() => submitForm()} disabled={!isValidDraft}>
      {title}
    </button.Primary>
  );
};
