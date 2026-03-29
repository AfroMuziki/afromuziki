// frontend/src/hooks/artist/useArtistRecentActivity.ts
import { useQuery } from '@tanstack/react-query';
import { artistApi } from '../../services/api/artist.api';
import { queryKeys } from '../../utils/queryKeys';
import { useAuthStore } from '../../store/authStore';

export const useArtistRecentActivity = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.artist.activity(user?.id || ''),
    queryFn: () => artistApi.getRecentActivity(),
    enabled: !!user && user.role === 'artist',
    staleTime: 3 * 60 * 1000,
  });
};