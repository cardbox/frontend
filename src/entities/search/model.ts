import { createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

import { routes } from '@box/shared/routes';

// When user entered something into the search field
export const searchQueryEntered = createEvent<string>();

export const highlightSet = createEvent<string>();
export const highlightHide = createEvent();

export const $highlightQuery = createStore('');
export const $searchQuery = createStore('');

$highlightQuery.on(highlightSet, (_, query) => query).reset(highlightHide);

$searchQuery.on(searchQueryEntered, (_, search) => search);

sample({
  clock: searchQueryEntered,
  filter: not(routes.search.results.$isOpened),
  fn: (search) => ({ params: {}, query: { search } }),
  target: routes.search.results.navigate,
});

$searchQuery.reset(routes.search.results.closed);
