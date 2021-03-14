import React from 'react';
import acceptLanguage from 'accept-language-parser';
import { createEvent, createStore } from 'effector-root';
import {
  dateLocalShort,
  dateRelative,
  intlRelativeCreate,
  intlShortCreate,
  toSeconds,
} from '@cardbox/lib/dates';
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

const $intlShort = $locale.map((locale) => intlShortCreate(locale));
const $intlRelative = $locale.map((locale) => intlRelativeCreate(locale));

interface DateShort {
  date: string | number | Date;
  intl: Intl.DateTimeFormat;
}

export const DateShort = reflect({
  view: ({ date, intl }: DateShort) => <span>{dateLocalShort(date, intl)}</span>,
  bind: {
    intl: $intlShort,
  },
});

interface DateRelative {
  date: string | number | Date;
  intl: Intl.DateTimeFormat;
  relative: Intl.RelativeTimeFormat;
  secondsUntilFull: number;
}

export const DateRelative = reflect({
  view: ({ date, secondsUntilFull, intl, relative }: DateRelative) => (
    <span title={dateLocalShort(date, intl)}>
      {dateRelative(date, secondsUntilFull, intl, relative)}
    </span>
  ),
  bind: {
    intl: $intlShort,
    relative: $intlRelative,
  },
});

function createLocale(lang: { code: string; region?: string }): string {
  if (lang.region) return `${lang.code}-${lang.region}`;
  return `${lang.code}-{}`;
}
