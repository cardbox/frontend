import { useQueryParam } from 'use-query-params';

export function useSearchQuery() {
  const [res] = useQueryParam<string>('query');
  return res;
}
