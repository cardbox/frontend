export const intlShortCreate = (locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  });

export const intlRelativeCreate = (locale: string) =>
  new Intl.RelativeTimeFormat(locale, {
    style: 'long',
    numeric: 'auto',
  });

export function dateLocalShort(source: string | number | Date, intl: Intl.DateTimeFormat): string {
  const date = toDate(source);
  return (
    intl
      .format(date)
      // Temporary fix for INTL changes — https://github.com/unicode-org/icu/commit/e618a1cc2db6ac067a829c3d472bb9db123d5ecc
      .replace(/\b(Sep)\b/gm, 'Sept')
  );
}

export const SEC_MINUTE = 60;
export const SEC_HOUR = SEC_MINUTE * 60;
export const SEC_DAY = SEC_HOUR * 24;
export const SEC_WEEK = SEC_DAY * 7;
export const SEC_MONTH = SEC_WEEK * 4;
export const SEC_YEAR = SEC_MONTH * 12;

export function dateRelative(
  source: string | number | Date,
  secondsUntilFull: number,
  intl: Intl.DateTimeFormat,
  relative: Intl.RelativeTimeFormat,
): string {
  const date = toDate(source);
  const now = new Date();
  const diff = Math.abs(toSeconds(date) - toSeconds(now));
  const sign = Math.sign(toSeconds(date) - toSeconds(now));
  if (diff > secondsUntilFull) {
    return dateLocalShort(date, intl);
  }
  if (diff > SEC_YEAR) {
    return relative.format(sign * Math.floor(diff / SEC_YEAR), 'year');
  }
  if (diff > SEC_MONTH) {
    return relative.format(sign * Math.floor(diff / SEC_MONTH), 'month');
  }
  if (diff > SEC_WEEK) {
    return relative.format(sign * Math.floor(diff / SEC_WEEK), 'week');
  }
  if (diff > SEC_DAY) {
    return relative.format(sign * Math.floor(diff / SEC_DAY), 'day');
  }
  if (diff > SEC_HOUR) {
    return relative.format(sign * Math.floor(diff / SEC_HOUR), 'hour');
  }
  if (diff > SEC_MINUTE) {
    return relative.format(sign * Math.floor(diff / SEC_MONTH), 'minute');
  }
  return relative.format(sign * diff, 'second');
}

function toDate(source: string | number | Date): Date {
  return source instanceof Date ? source : new Date(source);
}

export function toSeconds(source: string | number | Date): number {
  return Math.floor(toDate(source).valueOf() / 1000);
}
