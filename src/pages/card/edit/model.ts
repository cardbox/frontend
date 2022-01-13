import { attach, createDomain, createEvent, createStore, guard, merge, sample } from 'effector';
import { createHatch } from 'framework';

import { historyPush } from '@box/entities/navigation';
import * as sessionModel from '@box/entities/session';
import { cardDraftModel } from '@box/features/card/draft';
import { paths } from '@box/pages/paths';
import { Card, internalApi } from '@box/shared/api';

export const hatch = createHatch(createDomain('CardEditPage'));
const $currentCardId = hatch.$params.map((params) => params.cardId || null);

export const cardsGetFx = attach({ effect: internalApi.cardsGet });
export const cardUpdateFx = attach({ effect: internalApi.cardsEdit });

const $currentCard = createStore<Card | null>(null);

// FIXME: may be should be replace to "$errors" in future
export const $isCardFound = $currentCard.map((card) => Boolean(card));

// Подгружаем данные после монтирования страницы
const shouldLoadCard = sample({
  clock: [hatch.enter, hatch.update],
  fn: ({ params }) => params.cardId,
});

sample({
  clock: shouldLoadCard,
  fn: (cardId) => ({ body: { cardId } }),
  target: cardsGetFx,
});

$currentCard.on(cardsGetFx.doneData, (_, { answer }) => answer.card);

const cardCtxLoaded = sample({
  clock: cardsGetFx.doneData,
  source: sessionModel.$session,
  fn: (viewer, card) => ({ viewer, card }),
});

// Фактическая проверка прав на редактирование
const isAnotherViewing = guard({
  source: cardCtxLoaded,
  filter: ({ viewer, card }) => {
    if (!viewer) return false;
    return viewer.id !== card.answer.card.authorId;
  },
});
sample({
  clock: isAnotherViewing,
  fn: ({ card }) => paths.cardView(card.answer.card.id),
  target: historyPush,
});

const isAuthorViewing = guard({
  source: cardCtxLoaded,
  filter: ({ viewer, card }) => {
    if (!viewer) return false;
    return viewer.id === card.answer.card.authorId;
  },
});

sample({
  clock: isAuthorViewing,
  fn: ({ card }) => card.answer.card,
  target: cardDraftModel.setInitialState,
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
  source: $currentCardId,
  fn: (cardId) => (cardId ? paths.cardView(cardId) : paths.home()),
  target: historyPush,
});

// Сбрасываем форму при успешной отправке
sample({
  source: cardUpdateFx.done,
  target: cardDraftModel._formInit,
});
