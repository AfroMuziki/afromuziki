// frontend/src/hooks/content/useTrending.ts
import { useQuery } from '@tanstack/react-query';
import { contentApi } from '../../services/api/content.api';
import { queryKeys } from '../../utils/queryKeys';

export const useTrending = (limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.content.trending(limit),
    queryFn: () => contentApi.getTrending(limit),
    staleTime: 10 * 60 * 1000,
  });
};
