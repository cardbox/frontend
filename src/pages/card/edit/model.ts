import { StartParams } from '@box/lib/page-routing';
import { attach, createEvent, guard, merge, sample } from 'effector-root';
import { cardDraftModel } from '@box/features/card/draft';
import { cardModel } from '@box/entities/card';
import { historyPush } from '@box/entities/navigation';

import { paths } from '../../paths';

export const pageLoaded = createEvent<StartParams>();

export const getCardByIdFx = attach({ effect: cardModel.cardGetByIdFx });
export const cardUpdateFx = attach({ effect: cardModel.cardUpdateFx });

// FIXME: may be should be replace to "$errors" in future
export const $isCardFound = cardModel.$currentCard.map((card) => Boolean(card));

// Подгружаем данные после монтирования страницы
sample({
  source: pageLoaded,
  fn: ({ params }) => params.cardId,
  target: getCardByIdFx,
});

const formEditSubmitted = createEvent<string>();

guard({
  source: cardDraftModel.formSubmitted,
  filter: (payload) => payload === 'edit',
  target: formEditSubmitted,
});

// Обрабатываем отправку формы
guard({
  clock: formEditSubmitted,
  source: cardDraftModel.$draft.map(({ id, ...data }) => ({
    ...data,
    cardId: id,
  })),
  filter: cardDraftModel.$isValidDraft,
  target: cardUpdateFx,
});

const formEditReset = createEvent<string>();

guard({
  source: cardDraftModel.formReset,
  filter: (payload) => payload === 'edit',
  target: formEditReset,
});

// Возвращаем на страницу карточки после сохранения/отмены изменений
sample({
  clock: merge([cardUpdateFx.done, formEditReset]),
  source: cardModel.$currentCardId,
  fn: (cardId) => (cardId ? paths.card(cardId) : paths.home()),
  target: historyPush,
});

// Сбрасываем форму при успешной отправке
sample({
  source: cardUpdateFx.done,
  target: cardDraftModel._formInit,
});
