export type UserRole = "artist" | "admin";
export type SongStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  stage_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  genre: string;
  status: SongStatus;
  plays: number;
  downloads: number;
  likes: number;
  createdAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

/** Raw DB row shape */
export interface DbSong {
  id: string;
  title: string;
  artist_id: string;
  cover_url: string;
  audio_url: string;
  duration_seconds: number;
  genre: string;
  status: SongStatus;
  plays: number;
  downloads: number;
  likes: number;
  created_at: string;
  approved_at?: string;
  rejection_reason?: string;
  profiles?: { stage_name: string; avatar_url?: string };
}
