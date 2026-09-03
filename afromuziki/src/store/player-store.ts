"use client";

import { create } from "zustand";
import type { Song } from "@/types";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Song[];
  isMinimized: boolean;
  setCurrentSong: (song: Song | null) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  addToQueue: (song: Song) => void;
  clearQueue: () => void;
  setMinimized: (value: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  queue: [],
  isMinimized: false,

  setCurrentSong: (song) =>
    set({ currentSong: song, progress: 0, isPlaying: !!song }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () =>
    set((s) => ({
      isMuted: !s.isMuted,
      volume: s.isMuted ? (s.volume || 0.8) : 0,
    })),

  addToQueue: (song) =>
    set((s) => ({
      queue: s.queue.some((q) => q.id === song.id)
        ? s.queue
        : [...s.queue, song],
    })),

  clearQueue: () => set({ queue: [] }),

  setMinimized: (value) => set({ isMinimized: value }),

  playNext: () => {
    const { queue, currentSong } = get();
    if (!currentSong || queue.length === 0) return;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    const next = queue[(idx + 1) % queue.length];
    set({ currentSong: next, progress: 0, isPlaying: true });
  },

  playPrevious: () => {
    const { queue, currentSong } = get();
    if (!currentSong || queue.length === 0) return;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    const prev = queue[(idx - 1 + queue.length) % queue.length];
    set({ currentSong: prev, progress: 0, isPlaying: true });
  },
}));
