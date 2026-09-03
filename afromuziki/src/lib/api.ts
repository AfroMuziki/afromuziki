/**
 * Thin client helpers for AfroMuziki API routes.
 * All secrets stay on the server.
 */

import type { Song, SongStatus } from "@/types";

export type ApiSong = {
  id: string;
  title: string;
  artistName: string;
  artistId?: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  genre: string;
  status?: SongStatus;
  plays: number;
  downloads: number;
  likes: number;
  createdAt?: string;
};

function mapSong(s: any): ApiSong {
  return {
    id: s.id,
    title: s.title,
    artistName: s.artistName || s.profiles?.stage_name || "Unknown",
    artistId: s.artist_id || s.artistId,
    coverUrl: s.coverUrl || s.cover_url,
    audioUrl: s.audioUrl || s.audio_url,
    duration: s.duration ?? s.duration_seconds ?? 0,
    genre: s.genre || "Afrobeats",
    status: s.status,
    plays: s.plays ?? 0,
    downloads: s.downloads ?? 0,
    likes: s.likes ?? 0,
    createdAt: s.created_at || s.createdAt,
  };
}

export async function logPlay(songId: string) {
  try {
    await fetch(`/api/songs/${songId}/play`, { method: "POST" });
  } catch {
    // non-critical
  }
}

export async function logDownload(songId: string) {
  try {
    const res = await fetch(`/api/songs/${songId}/download`, { method: "POST" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.downloadUrl as string | undefined;
  } catch {
    return null;
  }
}

/** Public: approved songs only */
export async function fetchApprovedSongs(params?: {
  genre?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiSong[]> {
  const q = new URLSearchParams();
  if (params?.genre) q.set("genre", params.genre);
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.offset) q.set("offset", String(params.offset));
  const res = await fetch(`/api/songs?${q.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load songs");
  const data = await res.json();
  return (data.songs || []).map(mapSong);
}

/** Artist: own songs (any status) — requires auth cookie */
export async function fetchMySongs(): Promise<ApiSong[]> {
  const res = await fetch("/api/songs/mine", { cache: "no-store" });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized");
    throw new Error("Failed to load your songs");
  }
  const data = await res.json();
  return (data.songs || []).map(mapSong);
}

/** Single song by id (public if approved, or owner/admin) */
export async function fetchSongById(id: string): Promise<ApiSong | null> {
  const res = await fetch(`/api/songs/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load song");
  const data = await res.json();
  return data.song ? mapSong(data.song) : null;
}

export function toPlayerSong(s: ApiSong): Song {
  return {
    id: s.id,
    title: s.title,
    artistId: s.artistId || "",
    artistName: s.artistName,
    coverUrl: s.coverUrl,
    audioUrl: s.audioUrl,
    duration: s.duration,
    genre: s.genre,
    status: s.status || "approved",
    plays: s.plays,
    downloads: s.downloads,
    likes: s.likes,
    createdAt: s.createdAt || new Date().toISOString(),
  };
}
