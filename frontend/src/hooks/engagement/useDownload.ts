// frontend/src/hooks/engagement/useDownload.ts
import { useMutation } from '@tanstack/react-query';
import { downloadApi } from '../../services/api/download.api';

export const useDownload = () => {
  return useMutation({
    mutationFn: (contentId: string) => downloadApi.getDownloadUrl(contentId),
  });
};
