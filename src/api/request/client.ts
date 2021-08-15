import { Request, queryToString, sendRequestFx } from './base';

sendRequestFx.use(requestClient);

export const API_PREFIX = process.env.CLIENT_BACKEND_URL ?? `/api/internal`;

export async function requestClient<Response = unknown>({
  path,
  method,
  ...options
}: Request) {
  const headers = new Headers(options.headers);
  contentDefault(headers, 'application/json; charset=utf-8');

  const query = queryToString(options.query);
  const body =
    contentIs(headers, 'application/json') && options.body
      ? JSON.stringify(options.body)
      : undefined;

  const response = await fetch(`${API_PREFIX}${path}${query}`, {
    method,
    headers,
    body,
    credentials: 'same-origin',
  });

  // TODO: rewrite error system

  const answer: Response = contentIs(response.headers, 'application/json')
    ? await response.json()
    : await response.text();

  const responder = {
    ok: response.ok,
    body: answer,
    status: response.status,
    headers: toObject(response.headers),
  };

  if (response.ok) {
    return responder;
  }
  throw responder;
}

/**
 * Check if content-type JSON
 */
function contentIs(headers: Headers, type: string): boolean {
  return headers.get('content-type')?.includes(type) ?? false;
}

function contentDefault(headers: Headers, type: string): Headers {
  if (!headers.has('content-type')) {
    headers.set('content-type', type);
  }
  return headers;
}

function toObject(headers: Headers): Record<string, string> {
  const target = {};
  headers.forEach((value, key) => {
    target[key] = value;
  });
  return target;
}
