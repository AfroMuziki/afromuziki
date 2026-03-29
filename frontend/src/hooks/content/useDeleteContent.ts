// frontend/src/hooks/content/useDeleteContent.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '../../services/api/content.api';
import { queryKeys } from '../../utils/queryKeys';
import { showToast } from '../../components/ui/Toast/Toast';

export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentApi.deleteContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
      showToast.success('Content deleted successfully');
    },
    onError: (error: any) => {
      showToast.error(error.message || 'Failed to delete content');
    },
  });
};
