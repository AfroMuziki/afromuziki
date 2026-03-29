// frontend/src/hooks/artist/useArtistAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import { artistApi } from '../../services/api/artist.api';
import { queryKeys } from '../../utils/queryKeys';
import { useAuthStore } from '../../store/authStore';

export const useArtistAnalytics = (period: 'week' | 'month' | 'year' = 'week') => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.artist.analytics(user?.id || '', period),
    queryFn: () => artistApi.getArtistAnalytics(period),
    enabled: !!user && user.role === 'artist',
    staleTime: 5 * 60 * 1000,
  });
};
