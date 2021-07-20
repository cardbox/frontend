import type { Card, CardContent } from '@box/api';
import { cardModel } from '@box/entities/card';
import {
  createDomain,
  createEffect,
  createEvent,
  forward,
} from 'effector-root';
import { internalApi } from '@box/api';
import { spread } from 'patronum/spread';

type Draft = Card | null;

// FIXME: simplify to one event?
export const setTitle = createEvent<string>();
export const setContent = createEvent<CardContent>();
export const submitChanges = createEvent<Draft>();
export const resetChanges = createEvent();

// FIXME: process response
export const submitChangesFx = createEffect((payload: Draft) => {
  if (
    !payload ||
    !payload.id ||
    !payload.title ||
    payload.content.length === 0
  ) {
    return;
  }

  return internalApi.cards.update({
    cardId: payload.id,
    title: payload.title,
    content: payload.content,
    tags: payload.tags,
  });
});

const draft = createDomain();

export const $title = draft.createStore<string>('');
export const $content = draft.createStore<CardContent>([]);
export const $tags = draft.createStore<string[]>([]);

// On:Init
spread({
  source: cardModel.getCardByIdFx.doneData.map(({ card }) => card),
  targets: {
    title: $title,
    content: $content,
    tags: $tags,
  },
});

// $title.on(
//   cardModel.getCardByIdFx.doneData,
//   (state, payload) => payload.card?.title || state,
// );
// $content.on(
//   cardModel.getCardByIdFx.doneData,
//   (state, payload) => payload.card?.content || state,
// );
// $tags.on(
//   cardModel.getCardByIdFx.doneData,
//   (state, payload) => payload.card?.tags || state,
// );

// On:Update
$title.on(setTitle, (_, payload) => payload);
$content.on(setContent, (_, payload) => payload);

// On:Reset
draft.onCreateStore((store) => {
  store.reset(submitChangesFx.done, resetChanges);
});

forward({
  from: submitChanges,
  to: submitChangesFx,
});
