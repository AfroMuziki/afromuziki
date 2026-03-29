// frontend/src/hooks/content/useContent.ts
import { useQuery } from '@tanstack/react-query';
import { contentApi } from '../../services/api/content.api';
import { queryKeys } from '../../utils/queryKeys';

export const useContent = (id: string) => {
  return useQuery({
    queryKey: queryKeys.content.detail(id),
    queryFn: () => contentApi.getContent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
