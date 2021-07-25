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
  return internalApi.cards.update({
    cardId: payload.id,
    title: payload.title,
    content: payload.content,
    tags: payload.tags,
  });
});

// FIXME: may be should be replace to "$errors" in future
export const $isCardFound = cardModel.$currentCard.map((card) => Boolean(card));

// Подгружаем данные после монтирования страницы
sample({
  source: pageLoaded,
  fn: ({ params }) => params.cardId,
  target: getCardByIdFx,
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
  clock: merge([submitChangesFx.done, cardDraftModel.formReset]),
  source: cardModel.$currentCardId,
  fn: (cardId) => (cardId ? paths.card(cardId) : paths.home()),
  target: historyPush,
});

// Сбрасываем форму при успешной отправке
sample({
  source: submitChangesFx.done,
  target: cardDraftModel.formReset,
});
