// frontend/src/utils/formatters/number.ts
export const formatNumber = (num: number): string => {
  if (num === 0) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDuration = (duration: string): string => {
  if (!duration) return '0:00';
  
  // If duration is already formatted as mm:ss or hh:mm:ss
  if (duration.includes(':')) {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return `${parseInt(parts[0])}:${parts[1].padStart(2, '0')}`;
    }
    if (parts.length === 3) {
      return `${parseInt(parts[0])}:${parts[1].padStart(2, '0')}:${parts[2].padStart(2, '0')}`;
    }
    return duration;
  }
  
  // If duration is in seconds
  const seconds = parseInt(duration);
  if (isNaN(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
