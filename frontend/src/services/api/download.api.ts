// frontend/src/services/api/download.api.ts
import { apiClient } from './axios';

export const downloadApi = {
  getDownloadUrl: async (contentId: string): Promise<string> => {
    const response = await apiClient.get(`/download/${contentId}`);
    return response.url;
  },
};
