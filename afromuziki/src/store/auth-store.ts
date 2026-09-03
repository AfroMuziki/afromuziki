"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, UserRole } from "@/types";

interface AuthState {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  isLoading: boolean;
  setAuth: (user: { id: string; email: string } | null, profile: Profile | null) => void;
  setLoading: (v: boolean) => void;
  logout: () => void;
  isArtist: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: false,
      setAuth: (user, profile) => set({ user, profile }),
      setLoading: (v) => set({ isLoading: v }),
      logout: () => set({ user: null, profile: null }),
      isArtist: () => {
        const role = get().profile?.role;
        return role === "artist" || role === "admin";
      },
      isAdmin: () => get().profile?.role === "admin",
    }),
    {
      name: "afromuziki-auth",
      partialize: (s) => ({ user: s.user, profile: s.profile }),
    }
  )
);
