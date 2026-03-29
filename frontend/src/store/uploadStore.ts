// frontend/src/store/uploadStore.ts
import { create } from 'zustand';
import { ContentType } from '../types/content.types';

export interface UploadState {
  currentStep: number;
  file: File | null;
  fileType: ContentType | null;
  title: string;
  description: string;
  genre: string;
  tags: string[];
  thumbnail: File | null;
  thumbnailPreview: string | null;
  isDownloadable: boolean;
  scheduledAt: Date | null;
  isUploading: boolean;
  uploadProgress: number;
  
  setCurrentStep: (step: number) => void;
  setFile: (file: File | null, type: ContentType | null) => void;
  setMetadata: (data: { title: string; description: string; genre: string; tags: string[] }) => void;
  setThumbnail: (file: File | null, preview: string | null) => void;
  setSettings: (data: { isDownloadable: boolean; scheduledAt: Date | null }) => void;
  setIsUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  resetUpload: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  currentStep: 1,
  file: null,
  fileType: null,
  title: '',
  description: '',
  genre: '',
  tags: [],
  thumbnail: null,
  thumbnailPreview: null,
  isDownloadable: true,
  scheduledAt: null,
  isUploading: false,
  uploadProgress: 0,
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  setFile: (file, type) => set({ file, fileType: type }),
  
  setMetadata: (data) => set({
    title: data.title,
    description: data.description,
    genre: data.genre,
    tags: data.tags,
  }),
  
  setThumbnail: (file, preview) => set({ thumbnail: file, thumbnailPreview: preview }),
  
  setSettings: (data) => set({
    isDownloadable: data.isDownloadable,
    scheduledAt: data.scheduledAt,
  }),
  
  setIsUploading: (isUploading) => set({ isUploading }),
  
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  
  resetUpload: () => set({
    currentStep: 1,
    file: null,
    fileType: null,
    title: '',
    description: '',
    genre: '',
    tags: [],
    thumbnail: null,
    thumbnailPreview: null,
    isDownloadable: true,
    scheduledAt: null,
    isUploading: false,
    uploadProgress: 0,
  }),
}));
