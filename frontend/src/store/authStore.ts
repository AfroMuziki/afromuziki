// src/store/authStore.ts
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  displayName: string;
  role: "listener" | "artist" | "admin";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  })(),
  isAuthenticated: !!localStorage.getItem("accessToken"),

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.clear();
    set({ user: null, isAuthenticated: false });
  },
}));
