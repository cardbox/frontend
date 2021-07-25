import { StartParams } from '@box/lib/page-routing';
import {
  attach,
  createEffect,
  createEvent,
  guard,
  merge,
  sample,
} from 'effector-root';
import { cardDraftModel } from '@box/features/card/draft';
import { cardModel } from '@box/entities/card';
import { historyPush } from '@box/entities/navigation';
import { internalApi } from '@box/api';

import { paths } from '../../paths';

export const getCardByIdFx = attach({ effect: cardModel.getCardByIdFx });
export const pageLoaded = createEvent<StartParams>();
export const submitChangesFx = createEffect((payload: cardDraftModel.Draft) => {
  return internalApi.cards.create({
    title: payload.title,
    content: payload.content,
    tags: payload.tags,
  });
});

// Обрабатываем отправку формы
guard({
  clock: cardDraftModel.formSubmitted,
  source: cardDraftModel.$draft,
  filter: cardDraftModel.$isValidDraft,
  target: submitChangesFx,
});

// Возвращаем на страницу карточки после сохранения/отмены изменений
sample({
  source: merge([submitChangesFx.done, cardDraftModel.formReset]),
  // TODO: if reset -> redirect to prevPage
  // TODO: if submit -> redirect to cardPage
  fn: () => paths.home(),
  target: historyPush,
});

// Сбрасываем форму при успешной отправке
sample({
  source: submitChangesFx.done,
  target: cardDraftModel.formReset,
});
