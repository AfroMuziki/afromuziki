// frontend/src/services/api/artist.api.ts
import { apiClient } from './axios';
import { Artist, ArtistStats } from '../../types/artist.types';
import { Content } from '../../types/content.types';

export const artistApi = {
  getArtistByUsername: async (username: string): Promise<Artist> => {
    return apiClient.get(`/artist/${username}`);
  },

  getArtistById: async (id: string): Promise<Artist> => {
    return apiClient.get(`/artist/id/${id}`);
  },

  getArtistContent: async (artistId: string): Promise<Content[]> => {
    return apiClient.get(`/artist/${artistId}/content`);
  },

  getArtistStats: async (): Promise<ArtistStats> => {
    return apiClient.get('/artist/stats');
  },

  getArtistAnalytics: async (period: string = 'week'): Promise<any> => {
    return apiClient.get('/artist/analytics', { params: { period } });
  },

  getArtistFollowers: async (artistId: string, page: number = 1, limit: number = 20): Promise<any> => {
    return apiClient.get(`/artist/${artistId}/followers`, { params: { page, limit } });
  },

  getRecentActivity: async (): Promise<any> => {
    return apiClient.get('/artist/recent-activity');
  },

  updateArtistProfile: async (data: Partial<Artist>): Promise<Artist> => {
    return apiClient.put('/artist/profile', data);
  },
};
