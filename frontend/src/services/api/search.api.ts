// frontend/src/services/api/search.api.ts
import { apiClient } from './axios';

export const searchApi = {
  search: async (params: {
    query: string;
    type?: string;
    genre?: string;
    page?: number;
    limit?: number;
  }): Promise<any> => {
    return apiClient.get('/search', { params });
  },

  getSuggestions: async (query: string): Promise<string[]> => {
    return apiClient.get('/search/suggestions', { params: { query } });
  },
};
