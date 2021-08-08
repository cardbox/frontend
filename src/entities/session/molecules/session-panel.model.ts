import * as api from '@box/api/generated';
import { attach, createEffect, createEvent, sample } from 'effector-root';

const authParamsFx = attach({ effect: api.authParams });

export const loginClicked = createEvent();

const readStateFx = createEffect(() => {
  const url = new URL(document.location.toString());
  return `${url.pathname}${url.search}${url.hash}`;
});

const redirectToAccessoFx = createEffect(
  ({ accessoUrl }: { accessoUrl: string }) => {
    document.location = accessoUrl as any;
  },
);

sample({
  clock: loginClicked,
  fn: () => ({}),
  target: readStateFx,
});

// TODO: handle error of authParamsFx.fail

sample({
  clock: readStateFx.doneData,
  fn: (state) => ({ body: { state } }),
  target: authParamsFx,
});

sample({
  clock: authParamsFx.doneData,
  fn: ({ answer }) => answer,
  target: redirectToAccessoFx,
});
