import {
  attach,
  createDomain,
  createEvent,
  guard,
  merge,
  sample,
} from 'effector';
import { cardDraftModel } from '@box/features/card/draft';
import { cardModel } from '@box/entities/card';
import { createHatch } from 'framework';
import { historyPush } from '@box/entities/navigation';
import { internalApi } from '@box/api';

import { paths } from '../../paths';

export const hatch = createHatch(createDomain('CardEditPage'));

export const cardsGetFx = attach({ effect: internalApi.cardsGet });
export const cardUpdateFx = attach({ effect: internalApi.cardsEdit });

// FIXME: may be should be replace to "$errors" in future
export const $isCardFound = cardModel.$currentCard.map((card) => Boolean(card));

// Подгружаем данные после монтирования страницы
sample({
  clock: [hatch.enter, hatch.update],
  fn: ({ params: { cardId } }) => ({ body: { cardId } }),
  target: cardsGetFx,
});

// Ивент, который сабмитит форму при отправке ее со страницы редактирования карточки
const formEditSubmitted = createEvent<string>();

// Реагируем на сабмит формы только если сабмит происходит на странице редактирования карточки
guard({
  source: cardDraftModel.formSubmitted,
  filter: (payload) => payload === 'edit',
  target: formEditSubmitted,
});

// Обрабатываем отправку формы
guard({
  clock: formEditSubmitted,
  source: cardDraftModel.$draft.map(({ id, ...data }) => ({
    body: {
      ...data,
      cardId: id,
    },
  })),
  filter: cardDraftModel.$isValidDraft,
  target: cardUpdateFx,
});

// Ивент, который ресетит форму при эмите его со страницы редактирования карточки
const formEditReset = createEvent<string>();

// Реагируем на ресетит формы только если ресет происходит на странице редактирования карточки
guard({
  source: cardDraftModel.formReset,
  filter: (payload) => payload === 'edit',
  target: formEditReset,
});

// Возвращаем на страницу карточки после сохранения/отмены изменений
sample({
  clock: merge([cardUpdateFx.done, formEditReset]),
  source: cardModel.$currentCardId,
  fn: (cardId) => (cardId ? paths.cardView(cardId) : paths.home()),
  target: historyPush,
});

// Сбрасываем форму при успешной отправке
sample({
  source: cardUpdateFx.done,
  target: cardDraftModel._formInit,
});
