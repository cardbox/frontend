export function isEmpty<T>(value: T) {
  if (typeof value === 'string') return value.length === 0;
  if (typeof value === 'number') return value === 0;
  if (Array.isArray(value)) return value.length === 0;
  return !value;
}

export function isNonEmpty<T>(value: T) {
  return !isEmpty(value);
}
