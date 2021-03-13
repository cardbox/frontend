export const createShortIntl = (locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  });

export function dateLocalShort(source: string | number | Date, intl: Intl.DateTimeFormat): string {
  const date = source instanceof Date ? source : new Date(source);
  return intl.format(date);
}
