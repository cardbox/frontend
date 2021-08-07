import { StartParams } from '@box/lib/page-routing';
import { attach, createEvent, guard, sample } from 'effector-root';
import { cardDraftModel } from '@box/features/card/draft';
import { cardModel } from '@box/entities/card';
import { historyPush } from '@box/entities/navigation';

import { paths } from '../../paths';

export const pageLoaded = createEvent<StartParams>();

export const cardCreateFx = attach({ effect: cardModel.cardCreateFx });

const formCreateSubmitted = createEvent();

guard({
  source: cardDraftModel.formSubmitted,
  filter: (payload) => payload === 'edit',
  target: formCreateSubmitted,
});

// Обрабатываем отправку формы
guard({
  clock: formCreateSubmitted,
  // Убираем прокидывание заглушки для ID
  source: cardDraftModel.$draft.map(({ id, ...data }) => data),
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
