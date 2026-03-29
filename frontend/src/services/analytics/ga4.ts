// frontend/src/services/analytics/ga4.ts
import { env } from '../../config/env';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const initializeAnalytics = () => {
  if (!env.googleAnalyticsId || env.isProduction === false) return;
  
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${env.googleAnalyticsId}`;
  script.async = true;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', env.googleAnalyticsId);
};

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', env.googleAnalyticsId, { page_path: path });
  }
};

export const events = {
  PLAY_CONTENT: 'play_content',
  PAUSE_CONTENT: 'pause_content',
  COMPLETE_CONTENT: 'complete_content',
  LIKE_CONTENT: 'like_content',
  UNLIKE_CONTENT: 'unlike_content',
  DOWNLOAD_CONTENT: 'download_content',
  SHARE_CONTENT: 'share_content',
  FOLLOW_ARTIST: 'follow_artist',
  UNFOLLOW_ARTIST: 'unfollow_artist',
  SEARCH: 'search',
  UPLOAD_CONTENT: 'upload_content',
  REGISTER: 'register',
  LOGIN: 'login',
};
