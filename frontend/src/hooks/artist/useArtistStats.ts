// frontend/src/hooks/artist/useArtistStats.ts
import { useQuery } from '@tanstack/react-query';
import { artistApi } from '../../services/api/artist.api';
import { queryKeys } from '../../utils/queryKeys';
import { useAuthStore } from '../../store/authStore';

export const useArtistStats = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.artist.stats(user?.id || ''),
    queryFn: () => artistApi.getArtistStats(),
    enabled: !!user && user.role === 'artist',
    staleTime: 2 * 60 * 1000,
  });
};