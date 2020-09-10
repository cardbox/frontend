import { authUrlFx } from 'api/accesso';
import { createEffect } from 'effector-root';

export const authorizeFx = createEffect({
  async handler() {
    const answer = await authUrlFx({ state: 'DEMO' });
    const body = answer.body as { accesso_url: string };
    document.location = (body.accesso_url as any) as Location;
  },
});
