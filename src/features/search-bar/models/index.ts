import { ChangeEvent } from 'react';
import { createEvent, forward, guard, restore } from 'effector-root';
import { debounce } from 'patronum/debounce';
import { history } from '@cardbox/entities/navigation';

import { paths } from '../../../pages/paths';

type ChangeEv = ChangeEvent<HTMLInputElement>;
export const searchFieldChanged = createEvent<ChangeEv>();

export const searchValueChanged = createEvent<string>();
export const $searchValue = restore(searchValueChanged, '');

forward({
  from: searchFieldChanged.map((event) => event.target.value),
  to: searchValueChanged,
});

const searchDebounced = debounce({
  source: searchValueChanged,
  timeout: 350,
});

const searchSubmitted = guard({
  clock: searchDebounced,
  source: $searchValue,
  filter: (query) => Boolean(query.trim()),
});

const trimmedSearchSubmitted = searchSubmitted.map((query) => query.trim());

trimmedSearchSubmitted.watch((searchValue) => {
  if (history) history.push(paths.search(searchValue));
});
