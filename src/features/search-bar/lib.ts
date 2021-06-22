import { StringParam, useQueryParam } from 'use-query-params';

export function useSearchQuery() {
  const [res] = useQueryParam('query', StringParam);
  return res || '';
}
