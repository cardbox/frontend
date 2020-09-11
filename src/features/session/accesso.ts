import { authUrlFx } from 'api/accesso';
import { createEffect } from 'effector-root';

export const authorizeFx = createEffect({
  async handler() {
    const { accessoUrl } = await authUrlFx({ state: getState() });

    document.location = (accessoUrl as any) as Location;
  },
});

function getState(): string {
  return [
    document.location.pathname,
    document.location.search,
    document.location.hash,
  ].join('');
}
