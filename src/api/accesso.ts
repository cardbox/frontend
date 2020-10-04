import { createEffect } from 'effector-root';

import { Answer, requestFx } from './request';

interface AuthUrl {
  state: string;
}
interface AuthUrlDone {
  accessoUrl: string;
}

export const authUrlFx = createEffect<AuthUrl, AuthUrlDone, Answer>({
  async handler(body) {
    const answer = await requestFx({
      path: '/accesso/auth-url',
      method: 'POST',
      body,
    });
    return answer.body as AuthUrlDone;
  },
});

interface AuthFinish {
  authorizationCode: string;
}
interface AuthFinishDone {
  userInfo: { firstName: string; lastName: string };
}
interface AuthFinishFail {
  error: 'accesso_failed' | 'try_later' | 'unauthorized' | 'unexpected';
}

export const authFinishFx = createEffect<AuthFinish, AuthFinishDone, Answer>({
  async handler(body) {
    const answer = await requestFx({
      path: '/accesso/auth-done',
      method: 'POST',
      body,
    });
    return answer.body as AuthFinishDone;
  },
});
