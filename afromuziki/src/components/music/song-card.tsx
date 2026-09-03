"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import { Play, Pause, Heart, Download, MoreHorizontal } from "lucide-react";
import { cn, formatDuration, formatNumber } from "@/lib/utils";
import { usePlayerStore } from "@/store/player-store";
import type { Song } from "@/types";
import { Button } from "@/components/ui/button";
import { logDownload } from "@/lib/api";

interface SongCardProps {
  song: Song;
  variant?: "grid" | "list" | "compact";
  showStatus?: boolean;
}

export function SongCard({ song, variant = "grid", showStatus = false }: SongCardProps) {
  const { currentSong, isPlaying, setCurrentSong, togglePlay, addToQueue } =
    usePlayerStore();
  const isCurrent = currentSong?.id === song.id;
  const isThisPlaying = isCurrent && isPlaying;

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      setCurrentSong(song);
      addToQueue(song);
    }
  };

  const handleDownload = async (e: MouseEvent) => {
    e.stopPropagation();
    const url = await logDownload(song.id);
    if (url) window.open(url, "_blank");
    else if (song.audioUrl) window.open(song.audioUrl, "_blank");
  };

  if (variant === "list") {
    return (
      <div
        className={cn(
          "group flex items-center gap-4 rounded-xl px-3 py-2.5 transition-premium hover:bg-white/8",
          isCurrent && "bg-white/10"
        )}
      >
        <button
          onClick={handlePlay}
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg"
        >
          <Image
            src={song.coverUrl}
            alt={song.title}
            fill
            className="object-cover"
            sizes="48px"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
            {isThisPlaying ? (
              <Pause className="h-5 w-5 text-white" fill="white" />
            ) : (
              <Play className="h-5 w-5 text-white" fill="white" />
            )}
          </div>
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-white">{song.title}</p>
          <p className="truncate text-sm text-white/60">{song.artistName}</p>
        </div>

        <span className="hidden text-sm text-white/50 sm:block">
          {formatDuration(song.duration)}
        </span>

        {showStatus && (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
              song.status === "approved" && "bg-emerald-500/20 text-emerald-400",
              song.status === "pending" && "bg-amber-500/20 text-amber-400",
              song.status === "rejected" && "bg-red-500/20 text-red-400"
            )}
          >
            {song.status}
          </span>
        )}

        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <Button variant="ghost" size="icon-sm">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Grid / default
  return (
    <div className="group relative flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        <Image
          src={song.coverUrl}
          alt={song.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <button
          onClick={handlePlay}
          className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/40 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 hover:scale-105"
        >
          {isThisPlaying ? (
            <Pause className="h-5 w-5" fill="white" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" fill="white" />
          )}
        </button>
        {showStatus && song.status !== "approved" && (
          <span
            className={cn(
              "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              song.status === "pending" && "bg-amber-500/90 text-black",
              song.status === "rejected" && "bg-red-500/90 text-white"
            )}
          >
            {song.status}
          </span>
        )}
      </div>
      <div>
        <h3 className="truncate font-semibold text-white">{song.title}</h3>
        <p className="truncate text-sm text-white/60">{song.artistName}</p>
        <div className="mt-1 flex items-center gap-3 text-xs text-white/40">
          <span>{formatNumber(song.plays)} plays</span>
          <span>{formatDuration(song.duration)}</span>
        </div>
      </div>
    </div>
  );
}
