// src/store/playerStore.ts
import { create } from "zustand";

export type MediaType = "audio" | "video";

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  mediaUrl: string;
  mediaType: MediaType;
  duration?: number;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isVideoOpen: boolean;

  loadTrack: (track: Track, queue?: Track[]) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsVideoOpen: (open: boolean) => void;
  clearPlayer: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  isVideoOpen: false,

  loadTrack: (track, queue = []) => {
    const idx = queue.findIndex((t) => t.id === track.id);
    set({ currentTrack: track, queue: queue.length ? queue : [track], currentIndex: idx >= 0 ? idx : 0, currentTime: 0, isPlaying: true });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  seek: (time) => set({ currentTime: time }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),

  nextTrack: () => {
    const { queue, currentIndex } = get();
    const nextIdx = (currentIndex + 1) % queue.length;
    set({ currentTrack: queue[nextIdx], currentIndex: nextIdx, currentTime: 0, isPlaying: true });
  },

  prevTrack: () => {
    const { queue, currentIndex, currentTime } = get();
    if (currentTime > 3) { set({ currentTime: 0 }); return; }
    const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
    set({ currentTrack: queue[prevIdx], currentIndex: prevIdx, currentTime: 0, isPlaying: true });
  },

  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setIsVideoOpen: (isVideoOpen) => set({ isVideoOpen }),
  clearPlayer: () => set({ currentTrack: null, queue: [], currentIndex: 0, isPlaying: false, currentTime: 0, duration: 0, isVideoOpen: false }),
}));
