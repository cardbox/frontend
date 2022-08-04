import { attach, createEvent, createStore, sample } from 'effector';

import { cardDraftModel } from '@box/features/card/draft';

import * as sessionModel from '@box/entities/session';

import { Card, internalApi } from '@box/shared/api';
import { routes } from '@box/shared/routes';

const currentRoute = routes.card.edit;
const $currentCardId = currentRoute.$params.map((params) => params.cardId || null);

export const cardsGetFx = attach({ effect: internalApi.cardsGet });
export const cardUpdateFx = attach({ effect: internalApi.cardsEdit });

const $currentCard = createStore<Card | null>(null);

// FIXME: may be should be replace to "$errors" in future
export const $isCardFound = $currentCard.map((card) => Boolean(card));

// Подгружаем данные после монтирования страницы
const startLoadingCard = sample({
  clock: [currentRoute.opened, currentRoute.updated],
  fn: ({ params }) => params.cardId,
});

sample({
  clock: startLoadingCard,
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
const isAnotherViewing = sample({
  source: cardCtxLoaded,
  filter: ({ viewer, card }) => {
    if (!viewer) return false;
    return viewer.id !== card.answer.card.authorId;
  },
});
sample({
  clock: isAnotherViewing,
  fn: ({ card }) => ({ cardId: card.answer.card.id }),
  target: routes.card.view.open,
});

const isAuthorViewing = sample({
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
sample({
  source: cardDraftModel.formSubmitted,
  filter: (payload) => payload === 'edit',
  target: formEditSubmitted,
});

// Обрабатываем отправку формы
sample({
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
sample({
  source: cardDraftModel.formReset,
  filter: (payload) => payload === 'edit',
  target: formEditReset,
});

// Возвращаем на страницу карточки после сохранения/отмены изменений
const readyToRedirectBack = sample({
  clock: [cardUpdateFx.done, formEditReset],
  source: $currentCardId,
});

sample({
  clock: readyToRedirectBack,
  filter: Boolean,
  fn: (cardId) => ({ cardId }),
  target: routes.card.view.open,
});

sample({
  clock: readyToRedirectBack,
  filter: (cardId) => !cardId,
  fn: () => ({}),
  target: routes.home.open,
});

// Сбрасываем форму при успешной отправке
sample({
  source: cardUpdateFx.done,
  target: cardDraftModel._formInit,
});
