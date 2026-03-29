// frontend/src/hooks/content/useContentList.ts
import { useQuery } from '@tanstack/react-query';
import { contentApi } from '../../services/api/content.api';
import { queryKeys } from '../../utils/queryKeys';

interface UseContentListParams {
  page?: number;
  limit?: number;
  genre?: string;
  type?: string;
  sort?: string;
  search?: string;
}

export const useContentList = (params: UseContentListParams) => {
  return useQuery({
    queryKey: queryKeys.content.list(params),
    queryFn: () => contentApi.getContentList(params),
    staleTime: 2 * 60 * 1000,
  });
};
