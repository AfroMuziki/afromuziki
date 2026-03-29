// frontend/src/hooks/artist/useArtistContent.ts
import { useQuery } from '@tanstack/react-query';
import { artistApi } from '../../services/api/artist.api';
import { queryKeys } from '../../utils/queryKeys';

export const useArtistContent = (artistId?: string) => {
  return useQuery({
    queryKey: queryKeys.artist.content(artistId || ''),
    queryFn: () => artistApi.getArtistContent(artistId!),
    enabled: !!artistId,
    staleTime: 3 * 60 * 1000,
  });
};
