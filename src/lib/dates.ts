export const createShortIntl = (locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  });

export function dateLocalShort(source: string | number | Date, intl: Intl.DateTimeFormat): string {
  const date = source instanceof Date ? source : new Date(source);
  return (
    intl
      .format(date)
      // Temporary fix for INTL changes — https://github.com/unicode-org/icu/commit/e618a1cc2db6ac067a829c3d472bb9db123d5ecc
      .replace(/\b(Sep)\b/gm, 'Sept')
  );
}
