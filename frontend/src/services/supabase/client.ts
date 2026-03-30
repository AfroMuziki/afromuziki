// frontend/src/services/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env';

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
