"use client";

import { useEffect, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Download,
  Maximize2,
  Minimize2,
  Shuffle,
  Repeat,
} from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logPlay } from "@/lib/api";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isMinimized,
    play,
    pause,
    setProgress,
    setDuration,
    setVolume,
    toggleMute,
    playNext,
    playPrevious,
    setMinimized,
  } = usePlayerStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (audio.src !== currentSong.audioUrl) {
      audio.src = currentSong.audioUrl;
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch(() => pause());
    } else {
      audio.pause();
    }
  }, [currentSong, isPlaying, pause]);

  // Log play event once when a new song starts playing
  useEffect(() => {
    if (currentSong && isPlaying) {
      logPlay(currentSong.id);
    }
  }, [currentSong?.id]); // only when song changes

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => playNext();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, [setProgress, setDuration, playNext]);

  if (!currentSong) return null;

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setProgress(value);
    if (audioRef.current) audioRef.current.currentTime = value;
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="glass-strong flex items-center gap-3 rounded-2xl p-2 pr-4 shadow-2xl glow-blue">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl">
            <Image
              src={currentSong.coverUrl}
              alt={currentSong.title}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {currentSong.title}
            </p>
            <p className="truncate text-xs text-white/60">
              {currentSong.artistName}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => (isPlaying ? pause() : play())}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" fill="currentColor" />
            ) : (
              <Play className="h-4 w-4" fill="currentColor" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMinimized(false)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <audio ref={audioRef} preload="metadata" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 md:px-6 md:pb-4">
      <div className="mx-auto max-w-5xl">
        <div className="glass-strong overflow-hidden rounded-2xl border border-white/10 shadow-2xl glow-blue">
          <div className="px-4 pt-3">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              className="player-progress w-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, #60a5fa ${(progress / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(progress / (duration || 1)) * 100}%)`,
              }}
            />
            <div className="mt-1 flex justify-between text-[10px] text-white/50">
              <span>{formatDuration(progress)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 pb-4 pt-1">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl md:h-16 md:w-16">
              <Image
                src={currentSong.coverUrl}
                alt={currentSong.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">
                {currentSong.title}
              </p>
              <p className="truncate text-sm text-white/60">
                {currentSong.artistName}
              </p>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <Button variant="ghost" size="icon-sm" className="hidden sm:flex">
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={playPrevious}>
                <SkipBack className="h-5 w-5" fill="currentColor" />
              </Button>
              <Button
                variant="default"
                size="icon-lg"
                className="h-12 w-12 shadow-lg shadow-blue-500/30"
                onClick={() => (isPlaying ? pause() : play())}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" fill="white" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" fill="white" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={playNext}>
                <SkipForward className="h-5 w-5" fill="currentColor" />
              </Button>
              <Button variant="ghost" size="icon-sm" className="hidden sm:flex">
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            <div className="hidden items-center gap-1 md:flex">
              <Button variant="ghost" size="icon-sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Download className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 pl-2">
                <button onClick={toggleMute} className="text-white/70 hover:text-white">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="player-progress w-20"
                />
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMinimized(true)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}
