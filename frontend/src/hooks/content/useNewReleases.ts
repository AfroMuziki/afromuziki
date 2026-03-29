// frontend/src/hooks/content/useNewReleases.ts
import { useQuery } from '@tanstack/react-query';
import { contentApi } from '../../services/api/content.api';
import { queryKeys } from '../../utils/queryKeys';

export const useNewReleases = (limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.content.newReleases(limit),
    queryFn: () => contentApi.getNewReleases(limit),
    staleTime: 5 * 60 * 1000,
  });
};