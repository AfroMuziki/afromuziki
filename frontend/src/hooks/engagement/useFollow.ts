// frontend/src/hooks/engagement/useFollow.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { engagementApi } from '../../services/api/engagement.api';
import { queryKeys } from '../../utils/queryKeys';

export const useFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ artistId, action }: { artistId: string; action: 'follow' | 'unfollow' }) =>
      engagementApi.toggleFollow(artistId, action),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.artist.profile(variables.artistId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.artist.all });
    },
  });
};
