import { Effect, Event, Store, Unit, createEffect, forward } from 'effector';

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
    return new Promise<P>((resolve) =>
      setTimeout(resolve, config.delay, payload),
    );
  }

  const pauseFx = createEffect<T, T>();

  pauseFx.use(abortable(timeout, config.abort));

  forward({ from: config.source, to: pauseFx });
  forward({ from: pauseFx.doneData, to: config.target });
}
