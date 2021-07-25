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

import { paths } from '../../paths';

export const pageLoaded = createEvent<StartParams>();

export const cardCreateFx = attach({ effect: cardModel.cardCreateFx });
export const getCardByIdFx = attach({ effect: cardModel.getCardByIdFx });

// Обрабатываем отправку формы
guard({
  clock: cardDraftModel.formSubmitted,
  source: cardDraftModel.$draft,
  filter: cardDraftModel.$isValidDraft,
  target: cardCreateFx,
});

// Редиректим на страницу созданной карточки после сохранения изменений
sample({
  clock: cardCreateFx.done,
  fn: ({ result }) => paths.card(result.card.id),
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
  clock: [cardCreateFx.done, pageLoaded],
  target: cardDraftModel._formInit,
});
