// frontend/src/services/cloudinary/upload.ts
import { env } from '../../config/env';

interface UploadOptions {
  onProgress?: (progress: number) => void;
}

export const cloudinaryUpload = {
  uploadFile: async (file: File, onProgress?: (progress: number) => void): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', env.cloudinaryUploadPreset);
    formData.append('cloud_name', env.cloudinaryCloudName);
    formData.append('resource_type', 'auto');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } else {
          reject(new Error('Upload failed'));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });
      
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/auto/upload`);
      xhr.send(formData);
    });
  },

  uploadImage: async (file: File, onProgress?: (progress: number) => void): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', env.cloudinaryUploadPreset);
    formData.append('cloud_name', env.cloudinaryCloudName);
    formData.append('resource_type', 'image');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } else {
          reject(new Error('Upload failed'));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });
      
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`);
      xhr.send(formData);
    });
  },
};

export const cloudinaryTransform = {
  getOptimizedUrl: (url: string, options?: { width?: number; height?: number; quality?: number }): string => {
    if (!url) return '';
    
    const transformations = [];
    if (options?.width) transformations.push(`w_${options.width}`);
    if (options?.height) transformations.push(`h_${options.height}`);
    if (options?.quality) transformations.push(`q_${options.quality}`);
    transformations.push('f_auto');
    transformations.push('c_limit');
    
    const parts = url.split('/upload/');
    if (transformations.length > 0) {
      return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
    }
    return url;
  },
  
  getThumbnailUrl: (url: string, width: number = 300, height: number = 300): string => {
    return cloudinaryTransform.getOptimizedUrl(url, { width, height, quality: 80 });
  },
  
  getAudioPlayerUrl: (url: string): string => {
    return cloudinaryTransform.getOptimizedUrl(url, { quality: 100 });
  },
  
  getVideoPlayerUrl: (url: string): string => {
    return cloudinaryTransform.getOptimizedUrl(url, { quality: 90 });
  },
};
