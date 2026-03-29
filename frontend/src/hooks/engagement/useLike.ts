// frontend/src/hooks/engagement/useLike.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { engagementApi } from '../../services/api/engagement.api';
import { queryKeys } from '../../utils/queryKeys';

export const useLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, action }: { contentId: string; action: 'like' | 'unlike' }) =>
      engagementApi.toggleLike(contentId, action),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.detail(variables.contentId) });
    },
  });
};
