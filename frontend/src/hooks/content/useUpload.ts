// frontend/src/hooks/content/useUpload.ts
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '../../services/api/content.api';
import { cloudinaryUpload } from '../../services/cloudinary/upload';
import { queryKeys } from '../../utils/queryKeys';
import { showToast } from '../../components/ui/Toast/Toast';
import { useUploadStore } from '../../store/uploadStore';

export const useUpload = () => {
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const resetUpload = useUploadStore((state) => state.resetUpload);

  const uploadMutation = useMutation({
    mutationFn: async (data: any) => {
      // Upload file to Cloudinary
      const fileUpload = await cloudinaryUpload.uploadFile(data.file, (p) => {
        setProgress(p);
      });
      
      // Upload thumbnail if exists
      let thumbnailUrl = '';
      if (data.thumbnail) {
        const thumbnailUpload = await cloudinaryUpload.uploadImage(data.thumbnail);
        thumbnailUrl = thumbnailUpload.secure_url;
      }
      
      // Create content record
      const contentData = {
        title: data.title,
        description: data.description,
        type: data.type,
        genre: data.genre,
        tags: data.tags,
        audio_url: data.type === 'audio' ? fileUpload.secure_url : null,
        video_url: data.type === 'video' ? fileUpload.secure_url : null,
        thumbnail_url: thumbnailUrl,
        duration: fileUpload.duration || '0:00',
        is_downloadable: data.isDownloadable,
        scheduled_at: data.scheduledAt,
      };
      
      return contentApi.createContent(contentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
      resetUpload();
      showToast.success('Content uploaded successfully');
    },
    onError: (error: any) => {
      showToast.error(error.message || 'Upload failed');
    },
  });

  return {
    upload: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    progress,
  };
};
