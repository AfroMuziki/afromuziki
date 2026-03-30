// frontend/src/services/supabase/auth.ts
import { supabase } from './client';
import { User } from '../../types/auth.types';

export const supabaseAuth = {
  signUp: async (email: string, password: string, metadata: any) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  },

  signIn: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  signOut: async () => {
    return supabase.auth.signOut();
  },

  resetPassword: async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email);
  },

  updatePassword: async (newPassword: string) => {
    return supabase.auth.updateUser({
      password: newPassword,
    });
  },

  getSession: async () => {
    return supabase.auth.getSession();
  },

  getUser: async () => {
    return supabase.auth.getUser();
  },
};// frontend/src/services/supabase/auth.ts
import { supabase } from './client';
import { User } from '../../types/auth.types';

export const supabaseAuth = {
  signUp: async (email: string, password: string, metadata: any) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  },

  signIn: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  signOut: async () => {
    return supabase.auth.signOut();
  },

  resetPassword: async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email);
  },

  updatePassword: async (newPassword: string) => {
    return supabase.auth.updateUser({
      password: newPassword,
    });
  },

  getSession: async () => {
    return supabase.auth.getSession();
  },

  getUser: async () => {
    return supabase.auth.getUser();
  },
};
