import fetch, { Headers } from 'node-fetch';

import { Request, queryToString, sendRequestFx } from './base';

sendRequestFx.use(requestServer);

const API_PREFIX = process.env.BACKEND_URL ?? 'http://localhost:9008';

async function requestServer({ path, method, ...options }: Request) {
  const headers = new Headers({
    ...options.headers,
    cookie: combineCookies(options.headers?.cookie, options.cookies),
  });
  contentSetDefault(headers, 'application/json; charset=utf-8');

  const query = queryToString(options.query);
  const body =
    contentIs(headers, 'application/json') && options.body
      ? JSON.stringify(options.body)
      : undefined;

  try {
    const response = await fetch(`${API_PREFIX}${path}${query}`, {
      method,
      headers,
      body,
    });

    const answer = contentIs(response.headers, 'application/json')
      ? await response.json()
      : await response.text();

    const responder = {
      ok: response.ok,
      body: answer,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };

    if (response.ok) {
      return responder;
    }
    throw responder;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw {
        ok: false,
        body: error,
        status: 900,
        headers: {},
      };
    }
    throw error;
  }
}

function combineCookies(...cookies: Array<string | undefined>): string {
  return cookies.filter(Boolean).join('; ');
}

/**
 * Check if content-type JSON
 */
function contentIs(headers: Headers, type: string): boolean {
  return headers.get('content-type')?.includes(type) ?? false;
}

function contentSetDefault(headers: Headers, type: string): Headers {
  if (!headers.has('content-type')) {
    headers.set('content-type', type);
  }
  return headers;
}
