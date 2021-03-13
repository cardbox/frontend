import React from 'react';
import acceptLanguage from 'accept-language-parser';
import { createEvent, createStore } from 'effector-root';
import { createShortIntl, dateLocalShort } from '@cardbox/lib/dates';
import { reflect } from '@effector/reflect/ssr';

export const localeLoadFromHeader = createEvent<string>();

const defaultLanguage =
  typeof navigator !== 'undefined' ? navigator.language || navigator['userLanguage'] : 'en-US';

export const $locale = createStore(defaultLanguage);

$locale.on(localeLoadFromHeader, (_, header) => {
  return acceptLanguage
    .parse(header)
    .sort((a, b) => b.quality - a.quality) // desc
    .map(createLocale)[0];
});

const $shortIntl = $locale.map((locale) => createShortIntl(locale));

export const ShortDate = reflect({
  view: ({ date, intl }: { date: string | number | Date; intl: Intl.DateTimeFormat }) => (
    <>{dateLocalShort(date, intl)}</>
  ),
  bind: {
    intl: $shortIntl,
  },
});

function createLocale(lang: { code: string; region?: string }): string {
  if (lang.region) return `${lang.code}-${lang.region}`;
  return `${lang.code}-{}`;
}
