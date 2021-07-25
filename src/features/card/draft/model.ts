import type { CardContent } from '@box/api';
import { cardModel } from '@box/entities/card';
import { combine, createDomain, createEvent } from 'effector-root';
import { every } from 'patronum/every';
import { isNonEmpty } from '@box/lib/fp';
import { spread } from 'patronum/spread';

export const titleChanged = createEvent<string>();
export const contentChanged = createEvent<CardContent>();
export const formSubmitted = createEvent();

// Need only for cross-draft reset
// FIXME: remove after converting to page-unique fabric

export const _formInit = createEvent();
export const formReset = createEvent();

const draft = createDomain();

export const $id = draft.createStore<string>('');
export const $title = draft.createStore<string>('');
export const $content = draft.createStore<CardContent>([]);
export const $tags = draft.createStore<string[]>([]);

export const $isValidId = $id.map(isNonEmpty);
export const $isValidTitle = $title.map(isNonEmpty);
// FIXME: add slate-specific validation later
export const $isValidContent = $content.map(isNonEmpty);
// TODO: impl later after tags logic implementing
// export const $isValidTags = $tags.map(isNonEmpty);

// FIXME: for editing (no create) maybe all fields (id, author, ...) should be validated
export const $isValidDraft = every({
  predicate: true,
  stores: [$isValidTitle, $isValidContent],
});

// FIXME: delete later
export const $draft = combine({
  id: $id,
  title: $title,
  content: $content,
  tags: $tags,
});
export type Draft = ReturnType<typeof $draft.getState>;

// Init
spread({
  source: cardModel.cardGetByIdFx.doneData.map(({ card }) => card),
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
  store.reset(formReset, _formInit);
});
