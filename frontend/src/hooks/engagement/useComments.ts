// frontend/src/hooks/engagement/useComments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { engagementApi } from '../../services/api/engagement.api';
import { queryKeys } from '../../utils/queryKeys';
import { showToast } from '../../components/ui/Toast/Toast';

export const useComments = (contentId: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: queryKeys.engagement.comments(contentId, page),
    queryFn: () => engagementApi.getComments(contentId, page, limit),
    enabled: !!contentId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, body, parentId }: { contentId: string; body: string; parentId?: string }) =>
      engagementApi.addComment(contentId, body, parentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engagement.comments(variables.contentId) });
      showToast.success('Comment added');
    },
    onError: (error: any) => {
      showToast.error(error.message || 'Failed to add comment');
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => engagementApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engagement.all });
      showToast.success('Comment deleted');
    },
    onError: (error: any) => {
      showToast.error(error.message || 'Failed to delete comment');
    },
  });
};
