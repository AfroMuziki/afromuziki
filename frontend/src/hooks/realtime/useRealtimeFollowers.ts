// frontend/src/hooks/realtime/useRealtimeFollowers.ts
import { useEffect } from 'react';
import { supabase } from '../../services/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../utils/queryKeys';

export const useRealtimeFollowers = (artistId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!artistId) return;

    const channel = supabase
      .channel(`follows:${artistId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'follows',
          filter: `following_id=eq.${artistId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.artist.profile(artistId),
          });
          queryClient.invalidateQueries({
            queryKey: queryKeys.artist.followers(artistId),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [artistId, queryClient]);
};
