// frontend/src/hooks/realtime/useRealtimeComments.ts
import { useEffect } from 'react';
import { supabase } from '../../services/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../utils/queryKeys';

export const useRealtimeComments = (contentId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!contentId) return;

    const channel = supabase
      .channel(`comments:${contentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `content_id=eq.${contentId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.engagement.comments(contentId),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contentId, queryClient]);
};
