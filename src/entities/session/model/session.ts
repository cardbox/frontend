import { attach, createEffect, createEvent, sample } from 'effector';
import { internalApi } from '@box/shared/api';

const authParamsFx = attach({ effect: internalApi.authParams });

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
