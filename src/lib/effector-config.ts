/* eslint-disable no-param-reassign */

function readProperties<P extends string[]>(
  part: any,
  target: any,
  properties: P,
) {
  properties
    .filter((name) => Boolean(part[name]))
    .forEach((name) => {
      target[name] = part[name];
    });
}

interface Config {
  sid?: string;
  name?: string;
  loc?: unknown;
}

export function readConfig<T extends Record<string, unknown>>(
  part: T,
  properties: Array<Exclude<keyof T, number | symbol> | 'sid' | 'name' | 'loc'>,
  target = {},
): T & Config {
  if (typeof part !== 'object' || part === null) return target as T;

  if (part.config) readConfig(part.config as any, properties, target);

  readProperties(part, target, properties);

  if (part.ɔ) readConfig(part.ɔ as any, properties, target);

  return target as T;
}
