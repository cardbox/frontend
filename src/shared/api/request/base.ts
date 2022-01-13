import { attach, createEffect, createEvent, guard, merge, restore } from 'effector';
import { performance } from 'perf_hooks';
import queryString from 'query-string';

import { env } from '@box/shared/config';
import { logger } from '@box/shared/lib/logger';
import { measurement } from '@box/shared/lib/measure';

export interface Request {
  path: string;
  method: 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH';
  body?: Record<string, unknown> | null | void;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  cookies?: string;
}

export interface Answer {
  ok: boolean;
  body: unknown;
  status: number;
  headers: Record<string, string>;
}

export const setCookiesForRequest = createEvent<string>();
// WARNING: cookies should be sent only to an OUR backend
// Any other can steal the access token
export const $cookiesForRequest = restore(setCookiesForRequest, '');

export const setCookiesFromResponse = createEvent<string>();
export const $cookiesFromResponse = restore(setCookiesFromResponse, '');

export const sendRequestFx = createEffect<Request, Answer, Answer>();

export const requestFx = attach({
  effect: sendRequestFx,
  source: $cookiesForRequest,
  mapParams: (parameters: Request, cookies) => ({ ...parameters, cookies }),
});

if (env.BUILD_ON_SERVER) {
  // Pass cookies from the client to each request
  $cookiesForRequest.on(setCookiesForRequest, (_, cookies) => cookies);

  // Save cookies from the response to send to the client
  const respondedWithCookies = merge([
    sendRequestFx.doneData,
    sendRequestFx.failData,
    // TODO headers['set-cookie'] drops with set-cookie of undefined
  ]).map(({ headers }) => (headers ? headers['set-cookie'] : ''));

  guard({
    source: respondedWithCookies,
    // TODO headers['set-cookie'] drops with set-cookie of undefined
    filter: (setCookie) => (setCookie ? setCookie.trim() !== '' : false),
    target: setCookiesFromResponse,
  });
}

if (env.IS_DEBUG || env.IS_DEV_ENV) {
  const EffectTimingMap = new Map<unknown, ReturnType<typeof measurement>>();

  sendRequestFx.watch((params) => {
    const { method, path } = params;
    logger.info({ method, path }, `[requestInternal]`);
    EffectTimingMap.set(params, measurement(''));
  });

  sendRequestFx.finally.watch(({ status, params }) => {
    const { method, path } = params;
    const effectTime = EffectTimingMap.get(params);
    if (effectTime) {
      effectTime.measure(
        logger.info.bind(logger),
        `[requestInternal] ${method} ${path} — ${status.toUpperCase()}`,
      );
    } else {
      logger.warn(`Cannot find measurement for ${method} ${path}. Fx — ${status.toUpperCase()}`);
    }
  });

  sendRequestFx.done.watch(({ params: { path, method }, result: { status } }) => {
    logger.info({ method, path, status }, `[requestInternal.done]`);
  });

  sendRequestFx.fail.watch(({ params: { path, method }, error: { status } }) => {
    logger.info({ method, path, status }, `[requestInternal.fail]`);
  });
}

export function queryToString(query: Record<string, string> | undefined): string {
  return query ? `?${queryString.stringify(query)}` : '';
}
