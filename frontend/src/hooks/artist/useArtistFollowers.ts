// frontend/src/hooks/artist/useArtistFollowers.ts
import { useQuery } from '@tanstack/react-query';
import { artistApi } from '../../services/api/artist.api';
import { queryKeys } from '../../utils/queryKeys';

export const useArtistFollowers = (artistId: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: queryKeys.artist.followers(artistId, page),
    queryFn: () => artistApi.getArtistFollowers(artistId, page, limit),
    enabled: !!artistId,
  });
};
