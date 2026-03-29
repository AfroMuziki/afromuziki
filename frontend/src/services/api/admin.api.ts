// frontend/src/services/api/admin.api.ts
import { apiClient } from './axios';

export const adminApi = {
  getStats: async (): Promise<any> => {
    return apiClient.get('/admin/stats');
  },

  getAnalytics: async (period: string = 'week'): Promise<any> => {
    return apiClient.get('/admin/analytics', { params: { period } });
  },

  getUsers: async (page: number = 1, limit: number = 20, search?: string): Promise<any> => {
    return apiClient.get('/admin/users', { params: { page, limit, search } });
  },

  updateUserRole: async (userId: string, role: string): Promise<any> => {
    return apiClient.put(`/admin/users/${userId}/role`, { role });
  },

  suspendUser: async (userId: string): Promise<any> => {
    return apiClient.post(`/admin/users/${userId}/suspend`);
  },

  getContent: async (page: number = 1, limit: number = 20, status?: string): Promise<any> => {
    return apiClient.get('/admin/content', { params: { page, limit, status } });
  },

  moderateContent: async (contentId: string, status: string, reason?: string): Promise<any> => {
    return apiClient.put(`/admin/content/${contentId}/moderate`, { status, reason });
  },

  getReports: async (page: number = 1, limit: number = 20, status?: string): Promise<any> => {
    return apiClient.get('/admin/reports', { params: { page, limit, status } });
  },

  resolveReport: async (reportId: string, action: string): Promise<any> => {
    return apiClient.put(`/admin/reports/${reportId}/resolve`, { action });
  },
};
