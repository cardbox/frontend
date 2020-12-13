import { Effect, Event, Store, Unit, createEffect, forward } from 'effector';

import { readConfig } from './effector-config';

type Node<T> = Event<T> | Store<T> | Effect<T, any, any>;

/**
 * Pause trigger from `source` on `delay` im ms before triggering `target`
 * It is like `forward`, but with delay
 */
export function postpone<T>(config: {
  source: Unit<T>;
  target: Unit<T>;
  delay: number;
  abort?: Node<any>;
}) {
  const { source, target, delay, abort, name, sid } = readConfig(config, [
    'source',
    'target',
    'delay',
    'abort',
  ]);
  function abortable<P>(
    handler: (params: P) => Promise<P>,
    cancel?: Node<any>,
  ) {
    return (params: P) =>
      new Promise<P>((resolve, reject) => {
        const unsubscribe = cancel
          ? cancel.watch(() => {
              unsubscribe();
              reject(new Error('aborted'));
            })
          : () => {};

        handler(params)
          .then((done) => {
            unsubscribe();
            resolve(done);
          })
          .catch((error) => {
            unsubscribe();
            reject(error);
          });
      });
  }

  function timeout<P>(payload: P) {
    return new Promise<P>((resolve) => setTimeout(resolve, delay, payload));
  }

  const pauseFx = createEffect<T, T>({ sid, name });

  pauseFx.use(abortable(timeout, abort));

  forward({ from: source, to: pauseFx });
  forward({ from: pauseFx.doneData, to: target });

  return pauseFx;
}
