// frontend/src/services/uploadService.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class UploadService {
  constructor() {
    this.baseURL = API_URL;
  }

  async uploadTrack(formData, token) {
    try {
      const response = await fetch(`${this.baseURL}/upload/track`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async uploadCoverArt(formData, token, trackId) {
    try {
      formData.append('trackId', trackId);
      
      const response = await fetch(`${this.baseURL}/upload/cover`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Cover upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Cover upload error:', error);
      throw error;
    }
  }
}

export default new UploadService();