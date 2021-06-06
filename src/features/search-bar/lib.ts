import { useQuery } from '../../lib/use-query';

export function useSearchQuery() {
  return useQuery().get('query') || '';
}
