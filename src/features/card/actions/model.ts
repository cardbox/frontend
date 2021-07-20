import type { Card, CardContent } from '@box/api';
import { cardModel } from '@box/entities/card';
import {
  combine,
  createDomain,
  createEffect,
  createEvent,
  guard,
} from 'effector-root';
import { every } from 'patronum/every';
import { internalApi } from '@box/api';
import { isNonEmpty } from '@box/lib/fp';
import { spread } from 'patronum/spread';

type Draft = Pick<Card, 'id' | 'title' | 'content' | 'tags'>;

// FIXME: simplify to one event?
export const setTitle = createEvent<string>();
export const setContent = createEvent<CardContent>();
export const submitChanges = createEvent();
export const resetChanges = createEvent();

// FIXME: process response
export const submitChangesFx = createEffect((payload: Draft) => {
  return internalApi.cards.update({
    cardId: payload.id,
    title: payload.title,
    content: payload.content,
    tags: payload.tags,
  });
});

const draft = createDomain();

export const $id = draft.createStore<string>('');
export const $title = draft.createStore<string>('');
export const $content = draft.createStore<CardContent>([]);
export const $tags = draft.createStore<string[]>([]);

export const $isValidId = $id.map(isNonEmpty);
export const $isValidTitle = $title.map(isNonEmpty);
export const $isValidContent = $content.map(isNonEmpty);
// TODO: impl later after tags logic implementing
// export const $isValidTags = $tags.map(isNonEmpty);

export const $isValidDraft = every({
  predicate: true,
  stores: [$isValidId, $isValidTitle, $isValidContent],
});

// Init
spread({
  source: cardModel.getCardByIdFx.doneData.map(({ card }) => card),
  targets: {
    id: $id,
    title: $title,
    content: $content,
    tags: $tags,
  },
});

// Update
$title.on(setTitle, (_, payload) => payload);
$content.on(setContent, (_, payload) => payload);

// Reset
draft.onCreateStore((store) => {
  store.reset(submitChangesFx.done, resetChanges);
});

// Submit
guard({
  clock: submitChanges,
  source: {
    id: $id,
    title: $title,
    content: $content,
    tags: $tags,
  },
  filter: $isValidDraft,
  target: submitChangesFx,
});
