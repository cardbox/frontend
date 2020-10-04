import { Unit, createEffect, forward } from 'effector';

/**
 * Pause trigger from `source` on `delay` im ms before triggering `target`
 * It is like `forward`, but with delay
 */
export function postpone<T>(config: {
  source: Unit<T>;
  target: Unit<T>;
  delay: number;
}) {
  const pauseFx = createEffect<T, T>({
    async handler(payload) {
      return new Promise<T>((resolve) =>
        setTimeout(resolve, config.delay, payload),
      );
    },
  });

  forward({ from: config.source, to: pauseFx });
  forward({ from: pauseFx.doneData, to: config.target });
}
