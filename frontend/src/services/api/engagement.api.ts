// frontend/src/services/api/engagement.api.ts
import { apiClient } from './axios';

export const engagementApi = {
  toggleLike: async (contentId: string, action: 'like' | 'unlike'): Promise<void> => {
    return apiClient.post(`/engagement/like/${contentId}`, { action });
  },

  getComments: async (contentId: string, page: number = 1, limit: number = 20): Promise<any> => {
    return apiClient.get(`/engagement/comments/${contentId}`, { params: { page, limit } });
  },

  addComment: async (contentId: string, body: string, parentId?: string): Promise<any> => {
    return apiClient.post(`/engagement/comments/${contentId}`, { body, parentId });
  },

  deleteComment: async (commentId: string): Promise<void> => {
    return apiClient.delete(`/engagement/comments/${commentId}`);
  },

  toggleFollow: async (artistId: string, action: 'follow' | 'unfollow'): Promise<void> => {
    return apiClient.post(`/engagement/follow/${artistId}`, { action });
  },

  reportContent: async (data: { targetType: string; targetId: string; reason: string }): Promise<void> => {
    return apiClient.post('/engagement/report', data);
  },

  recordPlay: async (contentId: string): Promise<void> => {
    return apiClient.post(`/engagement/play/${contentId}`);
  },
};
