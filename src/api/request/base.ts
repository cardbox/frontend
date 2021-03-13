import queryString from 'query-string';
import { Effect, attach, createEffect, createEvent, guard, merge, restore } from 'effector-root';

export type Request = {
  path: string;
  method: string;
  body?: Record<string, unknown> | null | void;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  cookies?: string;
};

export type Answer<T = unknown> = {
  ok: boolean;
  body: T;
  status: number;
  headers: Record<string, string>;
};

export const setCookiesForRequest = createEvent<string>();
// WARNING: cookies should be sent only to an OUR backend
// Any other can steal the access token
export const $cookiesForRequest = restore(setCookiesForRequest, '');

export const setCookiesFromResponse = createEvent<string>();
export const $cookiesFromResponse = restore(setCookiesFromResponse, '');

export const sendRequestFx = createEffect<Request, Answer, Answer>();

export const requestFx: Effect<Request, Answer, Answer> = attach({
  effect: sendRequestFx,
  source: $cookiesForRequest,
  mapParams: (parameters, cookies) => ({ ...parameters, cookies }),
});

if (process.env.BUILD_TARGET === 'server') {
  // Pass cookies from the client to each request
  $cookiesForRequest.on(setCookiesForRequest, (_, cookies) => cookies);

  // Save cookies from the response to send to the client
  const respondedWithCookies = merge([sendRequestFx.doneData, sendRequestFx.failData]).map(
    ({ headers }) => headers['set-cookie'] ?? '',
  );

  guard({
    source: respondedWithCookies,
    filter: (setCookie) => setCookie.trim() !== '',
    target: setCookiesFromResponse,
  });
}

if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
  sendRequestFx.watch(({ path, method }) => {
    console.info(`[requestInternal] ${method} ${path}`);
  });

  sendRequestFx.done.watch(({ params: { path, method }, result: { status } }) => {
    console.info(`[requestInternal.done] ${method} ${path} : ${status}`);
  });

  sendRequestFx.fail.watch(({ params: { path, method }, error: { status } }) => {
    console.info(`[requestInternal.fail] ${method} ${path} : ${status}`);
  });
}

export function queryToString(query: Record<string, string> | undefined): string {
  return query ? `?${queryString.stringify(query)}` : '';
}
