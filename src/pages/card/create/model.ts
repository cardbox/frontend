import { StartParams } from '@box/lib/page-routing';
import {
  attach,
  createEffect,
  createEvent,
  guard,
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

// Редиректим на страницу созданной карточки после сохранения изменений
sample({
  clock: submitChangesFx.done,
  fn: ({ result }) => paths.card(result.body.card.id),
  target: historyPush,
});
// Редиректим на home-страницу после отмены изменений
sample({
  clock: cardDraftModel.formReset,
  fn: () => paths.home(),
  target: historyPush,
});

// Сбрасываем форму при
// - инициализации страницы
// - успешной отправке
// FIXME: Позднее будет обеспечиваться фабриками модели для страницы
sample({
  clock: [submitChangesFx.done, pageLoaded],
  target: cardDraftModel._formInit,
});
