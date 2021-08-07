import type { Card, CardContent } from '@box/api';
import { cardModel } from '@box/entities/card';
import { combine, createDomain, createEvent } from 'effector-root';
import { every } from 'patronum/every';
import { isNonEmpty } from '@box/lib/fp';
import { spread } from 'patronum/spread';

export type Draft = Pick<Card, 'id' | 'title' | 'content' | 'tags'>;

// FIXME: simplify to one event?
export const titleChanged = createEvent<string>();
export const contentChanged = createEvent<CardContent>();
export const formSubmitted = createEvent();
export const formReset = createEvent();

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

// FIXME: delete later
export const $draft = combine<Draft>({
  id: $id,
  title: $title,
  content: $content,
  tags: $tags,
});

// Init
spread({
  source: cardModel.getCardByIdFx.doneData,
  targets: {
    id: $id,
    title: $title,
    content: $content,
    tags: $tags,
  },
});

// Update
$title.on(titleChanged, (_, payload) => payload);
$content.on(contentChanged, (_, payload) => payload);

// Reset
draft.onCreateStore((store) => {
  store.reset(formReset);
});
