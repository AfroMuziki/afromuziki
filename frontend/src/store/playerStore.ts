// frontend/src/store/playerStore.ts
import { create } from 'zustand';
import { Content } from '../types/content.types';

interface PlayerStore {
  currentTrack: Content | null;
  queue: Content[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  setCurrentTrack: (track: Content | null) => void;
  setQueue: (queue: Content[]) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  addToQueue: (track: Content) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  next: () => void;
  previous: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setQueue: (queue) => set({ queue }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  
  removeFromQueue: (index) => set((state) => ({
    queue: state.queue.filter((_, i) => i !== index)
  })),
  
  clearQueue: () => set({ queue: [] }),
  
  next: () => {
    const { queue, currentTrack } = get();
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex < queue.length - 1) {
      set({ currentTrack: queue[currentIndex + 1], progress: 0 });
    }
  },
  
  previous: () => {
    const { queue, currentTrack, progress } = get();
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    if (progress > 3) {
      set({ progress: 0 });
    } else if (currentIndex > 0) {
      set({ currentTrack: queue[currentIndex - 1], progress: 0 });
    }
  },
}));
