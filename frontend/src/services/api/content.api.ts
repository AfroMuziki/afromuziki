// frontend/src/services/api/content.api.ts
import { apiClient } from './axios';
import { Content, CreateContentDto, UpdateContentDto } from '../../types/content.types';

export const contentApi = {
  getContent: async (id: string): Promise<Content> => {
    return apiClient.get(`/content/${id}`);
  },

  getContentList: async (params: {
    page?: number;
    limit?: number;
    genre?: string;
    type?: string;
    sort?: string;
    search?: string;
  }): Promise<{ items: Content[]; page: number; limit: number; total: number; totalPages: number }> => {
    return apiClient.get('/content', { params });
  },

  getTrending: async (limit: number = 10): Promise<Content[]> => {
    return apiClient.get('/content/trending', { params: { limit } });
  },

  getNewReleases: async (limit: number = 10): Promise<Content[]> => {
    return apiClient.get('/content/new-releases', { params: { limit } });
  },

  createContent: async (data: CreateContentDto): Promise<Content> => {
    return apiClient.post('/content', data);
  },

  updateContent: async (id: string, data: UpdateContentDto): Promise<Content> => {
    return apiClient.put(`/content/${id}`, data);
  },

  deleteContent: async (id: string): Promise<void> => {
    return apiClient.delete(`/content/${id}`);
  },
};
