// frontend/src/hooks/artist/useArtistProfile.ts
import { useQuery } from '@tanstack/react-query';
import { artistApi } from '../../services/api/artist.api';
import { queryKeys } from '../../utils/queryKeys';

export const useArtistProfile = (username: string) => {
  return useQuery({
    queryKey: queryKeys.artist.byUsername(username),
    queryFn: () => artistApi.getArtistByUsername(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
};
