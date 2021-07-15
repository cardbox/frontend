import produce from 'immer';
import type { Card } from '@box/api';
import { cardModel } from '@box/entities/card';
import { createEffect, createEvent, createStore } from 'effector-root';
import { internalApi } from '@box/api';

// FIXME: simplify to one event?
export const setTitle = createEvent<string>();
export const setContent = createEvent<string>();
export const resetChanges = createEvent<string>();

// FIXME: simplify, get from store
export const submitChangesFx = createEffect((payload: Card) => {
  // FIXME: validate payload
  return internalApi.cards.update({
    cardId: payload.id,
    title: payload.title,
    content: payload.content,
    tags: payload.tags,
  });
});

export const $draft = createStore<Card | null>(null);

// Init
$draft.on(cardModel.getCardByIdFx.doneData, (_, payload) => payload.card);
// Update
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
// Reset
$draft.reset(submitChangesFx.done);
$draft.reset(resetChanges);
