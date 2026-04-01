// frontend/src/hooks/useUpload.js

import { useState } from 'react';
import uploadService from '../services/uploadService';
import { validateAudioFile, validateImageFile } from '../utils/fileValidator';

export const useUpload = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const uploadTrack = async (trackData, audioFile, coverFile, token) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      // Validate files
      const audioValidation = validateAudioFile(audioFile);
      if (!audioValidation.valid) {
        throw new Error(audioValidation.error);
      }
      
      if (coverFile) {
        const coverValidation = validateImageFile(coverFile);
        if (!coverValidation.valid) {
          throw new Error(coverValidation.error);
        }
      }
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);
      
      // Prepare form data
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('title', trackData.title);
      formData.append('artist', trackData.artist);
      formData.append('genre', trackData.genre || '');
      
      // Upload track
      const result = await uploadService.uploadTrack(formData, token);
      
      // Upload cover art if provided
      if (coverFile && result.track?.id) {
        const coverFormData = new FormData();
        coverFormData.append('image', coverFile);
        await uploadService.uploadCoverArt(coverFormData, token, result.track.id);
      }
      
      clearInterval(progressInterval);
      setProgress(100);
      setSuccess({
        message: 'Track uploaded successfully',
        track: result.track
      });
      
      return result;
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };
  
  const reset = () => {
    setLoading(false);
    setProgress(0);
    setError(null);
    setSuccess(null);
  };
  
  return {
    uploadTrack,
    loading,
    progress,
    error,
    success,
    reset
  };
};