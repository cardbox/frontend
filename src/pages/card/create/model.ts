import { attach, createDomain, guard, sample } from 'effector';
import { createHatch } from 'framework';

import { cardDraftModel } from '@box/features/card/draft';

import { filterAnonymous, filterAuthenticated } from '@box/entities/session';

import { internalApi } from '@box/shared/api';
import { routes } from '@box/shared/routes';

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
  fn: ({ result }) => ({ cardId: result.answer.card.id }),
  target: routes.card.view.open,
});

// Редиректим на home-страницу после отмены изменений
sample({
  clock: cardDraftModel.formReset,
  target: routes.home.open,
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
  target: routes.home.open,
});
