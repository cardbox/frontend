import { createEvent, createStore } from 'effector-root';

export const highlightSet = createEvent<string>();
export const highlightHide = createEvent();

export const $highlightQuery = createStore('');

$highlightQuery.on(highlightSet, (_, query) => query).reset(highlightHide);
