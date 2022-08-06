import { createEvent, createStore } from 'effector';

// When user entered something into the search field
export const searchQueryEntered = createEvent<string>();

export const highlightSet = createEvent<string>();
export const highlightHide = createEvent();

export const $highlightQuery = createStore('');

$highlightQuery.on(highlightSet, (_, query) => query).reset(highlightHide);
