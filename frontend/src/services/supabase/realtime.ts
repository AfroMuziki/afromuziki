// frontend/src/services/supabase/realtime.ts
import { supabase } from './client';

export const realtimeHelpers = {
  subscribeToChannel: (channelName: string, onMessage: (payload: any) => void) => {
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: '*' }, (payload) => {
        onMessage(payload);
      })
      .subscribe();

    return channel;
  },

  subscribeToTable: (table: string, event: 'INSERT' | 'UPDATE' | 'DELETE' | '*', filter: string | null, onEvent: (payload: any) => void) => {
    const channel = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event, schema: 'public', table, filter: filter || undefined }, onEvent)
      .subscribe();

    return channel;
  },

  unsubscribeFromChannel: async (channel: any) => {
    await supabase.removeChannel(channel);
  },
};
