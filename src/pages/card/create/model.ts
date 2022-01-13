import { attach, createDomain, guard, sample } from 'effector';
import { createHatch } from 'framework';

import { historyPush } from '@box/entities/navigation';
import { filterAnonymous, filterAuthenticated } from '@box/entities/session';
import { cardDraftModel } from '@box/features/card/draft';
import { paths } from '@box/pages/paths';
import { internalApi } from '@box/shared/api';

export const hatch = createHatch(createDomain('CardCreatePage'));
const anonymousEnter = filterAnonymous(hatch.enter);
const authenticatedEnter = filterAuthenticated(hatch.enter);

export const cardCreateFx = attach({ effect: internalApi.cardsCreate });

// Реагируем на сабмит формы только если сабмит происходит на странице создания
const formCreateSubmitted = guard({
  source: cardDraftModel.formSubmitted,
  filter: (payload) => payload === 'create',
});

// Обрабатываем отправку формы
guard({
  clock: formCreateSubmitted,
  // Убираем прокидывание заглушки для ID
  source: cardDraftModel.$draft.map(({ id, ...data }) => ({ body: data })),
  filter: cardDraftModel.$isValidDraft,
  target: cardCreateFx,
});

// Редиректим на страницу созданной карточки после сохранения изменений
sample({
  clock: cardCreateFx.done,
  fn: ({ result }) => paths.cardView(result.answer.card.id),
  target: historyPush,
});

// Реагируем на ресетит формы только если ресет происходит на странице создания
const formCreateReset = guard({
  source: cardDraftModel.formReset,
  filter: (payload) => payload === 'create',
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
  clock: [cardCreateFx.done, authenticatedEnter],
  target: cardDraftModel._formInit,
});

sample({
  clock: anonymousEnter,
  fn: paths.home,
  target: historyPush,
});
