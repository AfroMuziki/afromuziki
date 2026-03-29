// frontend/src/hooks/content/useEditContent.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '../../services/api/content.api';
import { queryKeys } from '../../utils/queryKeys';
import { showToast } from '../../components/ui/Toast/Toast';

export const useEditContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      contentApi.updateContent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
      showToast.success('Content updated successfully');
    },
    onError: (error: any) => {
      showToast.error(error.message || 'Failed to update content');
    },
  });
};
