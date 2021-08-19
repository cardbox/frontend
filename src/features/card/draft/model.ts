import * as editorLib from '@box/lib/editor';
import type { CardContent } from '@box/api';
import {
  StoreValue,
  combine,
  createDomain,
  createEvent,
  guard,
  sample,
} from 'effector-root';
import { condition } from 'patronum/condition';
import { every } from 'patronum/every';
import { internalApi } from '@box/api';
import { isNonEmpty } from '@box/lib/fp';
import { spread } from 'patronum/spread';

export const titleChanged = createEvent<string>();
export const contentChanged = createEvent<CardContent>();
export const formSubmitted = createEvent<string>();
export const newTagChanged = createEvent<string>();
export const newTagSubmitted = createEvent();
export const existingTagRemoved = createEvent<string>();
export const lastTagRemoved = createEvent();

// Need only for cross-draft reset
// FIXME: remove after converting to page-unique fabric

export const _formInit = createEvent();
export const formReset = createEvent<string>();

const draft = createDomain();

export const $id = draft.createStore('');
export const $title = draft.createStore('');
export const $content = draft.createStore<CardContent>(editorLib.INITIAL_VALUE);
export const $tags = draft.createStore<string[]>([]);
export const $newTagInput = draft.createStore('');

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
$title.watch((title) => {
  console.log('title', title);
});
$draft.watch((data) => {
  console.log(data);
});
export type Draft = StoreValue<typeof $draft>;

// Init
spread({
  source: internalApi.cardsGet.doneData.map(({ answer }) => answer.card),
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
$newTagInput.on(newTagChanged, (_, payload) => payload);
const saveNewTag = guard({
  clock: newTagSubmitted,
  source: $newTagInput,
  filter: Boolean,
});
$tags
  .on(saveNewTag, (tags, newTag) => [...tags, newTag])
  .on(existingTagRemoved, (tags, tagToRemove) =>
    tags.filter((tag) => tag !== tagToRemove),
  )
  .on(lastTagRemoved, (tags) => tags.slice(0, -1));
$newTagInput.reset(saveNewTag);

// Reset
draft.onCreateStore((store) => {
  store.reset(formReset, _formInit);
});
