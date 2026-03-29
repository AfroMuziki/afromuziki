// frontend/src/hooks/content/useInfiniteContent.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { contentApi } from '../../services/api/content.api';
import { queryKeys } from '../../utils/queryKeys';

interface UseInfiniteContentParams {
  genre?: string;
  type?: string;
  sort?: string;
  search?: string;
  limit?: number;
}

export const useInfiniteContent = (params: UseInfiniteContentParams) => {
  const limit = params.limit || 20;

  return useInfiniteQuery({
    queryKey: queryKeys.content.infinite(params),
    queryFn: ({ pageParam = 1 }) =>
      contentApi.getContentList({ ...params, page: pageParam, limit }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
};
