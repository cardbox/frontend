import produce from 'immer';
import type { Card } from '@box/api';
import { cardModel } from '@box/entities/card';
import { createEffect, createEvent, createStore, forward } from 'effector-root';
import { internalApi } from '@box/api';

type Draft = Card | null;

// FIXME: simplify to one event?
export const setTitle = createEvent<string>();
export const setContent = createEvent<string>();
export const submitChanges = createEvent<Draft>();
export const resetChanges = createEvent();

// FIXME: process response
export const submitChangesFx = createEffect((payload: Draft) => {
  if (!payload || !payload.id || !payload.title || !payload.content) return;

  return internalApi.cards.update({
    cardId: payload.id,
    title: payload.title,
    content: payload.content,
    tags: payload.tags,
  });
});
export const $draft = createStore<Draft>(null);

// Combine
export const $draftContentNode = $draft.map((data) =>
  data ? JSON.parse(data.content) : null,
);

// On:Init
$draft.on(cardModel.getCardByIdFx.doneData, (_, payload) => payload.card);
// On:Update
$draft.on(setTitle, (state, payload) =>
  produce(state, (draft) => {
    if (!draft) return;
    draft.title = payload;
  }),
);
$draft.on(setContent, (state, payload) =>
  produce(state, (draft) => {
    if (!draft) return;
    draft.content = payload;
  }),
);
// On:Reset
$draft.reset(submitChangesFx.done);
$draft.reset(resetChanges);

forward({
  from: submitChanges,
  to: submitChangesFx,
});
