import produce from 'immer';
import type { Card } from '@box/api';
import { attach, createEffect, createEvent, createStore } from 'effector-root';
import { cardModel } from '@box/entities/card';
import { internalApi } from '@box/api';

// FIXME: simplify to one event?
export const setTitle = createEvent<string>();
export const setContent = createEvent<string>();
export const resetChanges = createEvent();

// FIXME: process response
export const submitChangesFx = createEffect((payload: Card | null) => {
  if (!payload || !payload.id || !payload.title || !payload.content) return;

  return internalApi.cards.update({
    cardId: payload.id,
    title: payload.title,
    content: payload.content,
    tags: payload.tags,
  });
});
export const $draft = createStore<Card | null>(null);

// Combine
export const $draftContentNode = $draft.map((data) =>
  data ? JSON.parse(data.content) : null,
);
export const submitDraftChangesFx = attach({
  effect: submitChangesFx,
  source: $draft,
});

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
