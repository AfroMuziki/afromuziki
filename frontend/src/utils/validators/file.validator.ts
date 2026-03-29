// frontend/src/utils/validators/file.validator.ts
export const validateAudioFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload MP3, WAV, OGG, or M4A.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Maximum size is 50MB.' };
  }
  
  return { valid: true };
};

export const validateVideoFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
  const maxSize = 500 * 1024 * 1024; // 500MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload MP4, MPEG, MOV, or AVI.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Maximum size is 500MB.' };
  }
  
  return { valid: true };
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload JPEG, PNG, WEBP, or GIF.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Maximum size is 5MB.' };
  }
  
  return { valid: true };
};
