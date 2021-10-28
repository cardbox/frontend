import { attach, createEffect, createEvent, guard, sample } from 'effector';
import { historyPush } from '@box/entities/navigation';
import { internalApi } from '@box/shared/api';

const authParamsFx = attach({ effect: internalApi.authParams });
export const sessionDeleteFx = attach({ effect: internalApi.sessionDelete });

export const loginClicked = createEvent();
export const logout = createEvent<void>();

const readStateFx = createEffect(() => {
  const url = new URL(document.location.toString());
  return `${url.pathname}${url.search}${url.hash}`;
});

const redirectToAccessoFx = createEffect(
  ({ accessoUrl }: { accessoUrl: string }) => {
    document.location = replaceRedirectWithLocal(accessoUrl);
  },
);

// In general host in redirect_uri is same with current host we login,
// but for local authorization we have to override it
function replaceRedirectWithLocal(accessoUrl: string): Location {
  const url = new URL(accessoUrl);
  const currentRedirect = url.searchParams.get('redirect_uri');
  if (!currentRedirect) {
    throw new Error('redirect_uri should be specified for accessoUrl');
  }
  const redirectUrl = new URL(currentRedirect);
  redirectUrl.host = document.location.host;
  if (document.location.port) {
    redirectUrl.port = document.location.port;
  }
  url.searchParams.set('redirect_uri', redirectUrl.toString());
  return url as unknown as Location;
}

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

sample({
  source: guard({
    source: logout,
    filter: sessionDeleteFx.pending.map((is) => !is),
  }),
  target: sessionDeleteFx,
  fn: (_) => ({ body: { deleteAllSessions: true } }),
});

sample({
  source: internalApi.sessionDelete.done,
  target: historyPush,
  fn: (_) => '/login',
});
