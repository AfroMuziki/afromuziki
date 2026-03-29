// frontend/src/types/content.types.ts
export type ContentType = 'audio' | 'video';
export type ContentStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published';

export interface Content {
  id: string;
  artist_id: string;
  title: string;
  description: string | null;
  type: ContentType;
  genre: string;
  tags: string[];
  audio_url: string | null;
  video_url: string | null;
  thumbnail_url: string;
  duration: string;
  status: ContentStatus;
  plays: number;
  likes_count: number;
  comments_count: number;
  downloads_count: number;
  is_downloadable: boolean;
  is_featured: boolean;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  artist?: {
    id: string;
    username: string;
    avatar_url: string | null;
    is_verified: boolean;
  };
  is_liked?: boolean;
  is_downloaded?: boolean;
}

export interface CreateContentDto {
  title: string;
  description?: string;
  type: ContentType;
  genre: string;
  tags: string[];
  thumbnail_url: string;
  audio_url?: string;
  video_url?: string;
  duration: string;
  is_downloadable: boolean;
  scheduled_at?: string;
}

export interface UpdateContentDto extends Partial<CreateContentDto> {
  status?: ContentStatus;
}
