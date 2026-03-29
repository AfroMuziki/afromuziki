// frontend/src/store/notificationStore.ts
import { create } from 'zustand';
import { Notification } from '../types/notification.types';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setUnreadCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  
  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter(n => !n.read_at).length,
  }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, read_at: new Date().toISOString() } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({
      ...n,
      read_at: n.read_at || new Date().toISOString(),
    })),
    unreadCount: 0,
  })),
  
  setUnreadCount: (count) => set({ unreadCount: count }),
  
  setIsLoading: (isLoading) => set({ isLoading }),
}));
