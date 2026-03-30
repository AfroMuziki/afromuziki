// src/hooks/usePlayer.ts
import { useEffect, useRef, useCallback } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { tracksApi } from "@/lib/api";

export function usePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playCountedRef = useRef<string | null>(null);

  const { currentTrack, isPlaying, volume, isMuted, currentTime, setCurrentTime, setDuration, nextTrack, seek } = usePlayerStore();

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
  }, []);

  // Load source
  useEffect(() => {
    if (!currentTrack) return;
    const isVideo = currentTrack.mediaType === "video";
    const el = isVideo ? videoRef.current : audioRef.current;
    if (!el) return;
    const other = isVideo ? audioRef.current : videoRef.current;
    other?.pause();
    if (el.src !== currentTrack.mediaUrl) { el.src = currentTrack.mediaUrl; el.load(); }
  }, [currentTrack]);

  // Play / pause
  useEffect(() => {
    const el = currentTrack?.mediaType === "video" ? videoRef.current : audioRef.current;
    if (!el) return;
    if (isPlaying) el.play().catch(() => usePlayerStore.getState().pause());
    else el.pause();
  }, [isPlaying, currentTrack]);

  // Volume
  useEffect(() => {
    [audioRef.current, videoRef.current].forEach((el) => {
      if (!el) return;
      el.volume = volume;
      el.muted = isMuted;
    });
  }, [volume, isMuted]);

  // Seek
  useEffect(() => {
    const el = currentTrack?.mediaType === "video" ? videoRef.current : audioRef.current;
    if (!el) return;
    if (Math.abs(el.currentTime - currentTime) > 1) el.currentTime = currentTime;
  }, [currentTime, currentTrack]);

  // Events
  const attachEvents = useCallback((el: HTMLAudioElement | HTMLVideoElement | null) => {
    if (!el) return;
    const onTime = () => {
      setCurrentTime(el.currentTime);
      // Increment play count after 30s (once per track)
      if (el.currentTime > 30 && currentTrack && playCountedRef.current !== currentTrack.id) {
        playCountedRef.current = currentTrack.id;
        tracksApi.incrementPlay(currentTrack.id).catch(() => {});
      }
    };
    const onDuration = () => setDuration(el.duration || 0);
    const onEnded = () => nextTrack();
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("durationchange", onDuration);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("durationchange", onDuration);
      el.removeEventListener("ended", onEnded);
    };
  }, [setCurrentTime, setDuration, nextTrack, currentTrack]);

  useEffect(() => attachEvents(audioRef.current), [attachEvents]);

  const handleSeek = useCallback((time: number) => {
    seek(time);
    const el = currentTrack?.mediaType === "video" ? videoRef.current : audioRef.current;
    if (el) el.currentTime = time;
  }, [seek, currentTrack]);

  return { audioRef, videoRef, handleSeek };
}

export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
