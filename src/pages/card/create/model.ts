import { StartParams } from '@box/lib/page-routing';
import { attach, createEvent, guard, sample } from 'effector-root';
import { cardDraftModel } from '@box/features/card/draft';
import { historyPush } from '@box/entities/navigation';
import { internalApi } from '@box/api';

import { paths } from '../../paths';

export const pageLoaded = createEvent<StartParams>();

export const cardCreateFx = attach({ effect: internalApi.cardsCreate });

// Ивент, который сабмитит форму при отправке ее со страницы создания карточки
const formCreateSubmitted = createEvent<string>();

// Реагируем на сабмит формы только если сабмит происходит на странице создания
guard({
  source: cardDraftModel.formSubmitted,
  filter: (payload) => payload === 'create',
  target: formCreateSubmitted,
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
  fn: ({ result }) => paths.card(result.answer.card.id),
  target: historyPush,
});

// Ивент, который ресетит форму при эмите его со страницы создания карточки
const formCreaetReset = createEvent<string>();

// Реагируем на ресетит формы только если ресет происходит на странице создания
guard({
  source: cardDraftModel.formReset,
  filter: (payload) => payload === 'create',
  target: formCreaetReset,
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
