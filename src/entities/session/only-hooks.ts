import { $isAuthenticated } from '@box/entities/session/model';
import { Effect, Event, Store, createEvent, guard } from 'effector';

export function filterAuthenticated<T>(
  source: Event<T> | Store<T> | Effect<T, any, any>,
): Event<T> {
  const target = createEvent<T>();

  guard({
    source,
    filter: $isAuthenticated,
    target,
  });

  return target;
}

export function filterAnonymous<T>(
  source: Event<T> | Store<T> | Effect<T, any, any>,
): Event<T> {
  const target = createEvent<T>();

  guard({
    source,
    filter: $isAuthenticated.map((is) => !is),
    target,
  });

  return target;
}

export function filterOnly<T>(config: {
  when: 'anonymous' | 'authenticated';
  clock: Event<T> | Store<T> | Effect<T, any, any>;
}): Event<T> {
  if (config.when === 'anonymous') return filterAnonymous(config.clock);

  return filterAuthenticated(config.clock);
}
