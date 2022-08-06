import { attach, guard, sample } from 'effector';

import { cardDraftModel } from '@box/features/card/draft';

import { chainAnonymous, chainAuthenticated } from '@box/entities/session';

import { internalApi } from '@box/shared/api';
import { routes } from '@box/shared/routes';

const anonymousRoute = chainAnonymous(routes.card.create);
const authenticatedRoute = chainAuthenticated(routes.card.create);

export const cardCreateFx = attach({ effect: internalApi.cardsCreate });

// Реагируем на сабмит формы только если сабмит происходит на странице создания
const formCreateSubmitted = guard({
  source: cardDraftModel.formSubmitted,
  filter: (payload) => payload === 'create',
});

// Обрабатываем отправку формы
sample({
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
  clock: [cardCreateFx.done, authenticatedRoute.opened],
  target: cardDraftModel._formInit,
});

sample({
  clock: anonymousRoute.opened,
  target: routes.home.open,
});
