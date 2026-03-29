// frontend/src/utils/validators/url.validator.ts
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  // Remove any potential XSS
  return url.replace(/[<>]/g, '');
};
