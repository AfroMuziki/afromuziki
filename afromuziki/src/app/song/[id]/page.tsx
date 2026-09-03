"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Heart, Download, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration, formatNumber } from "@/lib/utils";
import { usePlayerStore } from "@/store/player-store";
import { SongCard } from "@/components/music/song-card";
import {
  fetchSongById,
  fetchApprovedSongs,
  logDownload,
  toPlayerSong,
  type ApiSong,
} from "@/lib/api";

export default function SongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [song, setSong] = useState<ApiSong | null>(null);
  const [related, setRelated] = useState<ApiSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { setCurrentSong, addToQueue } = usePlayerStore();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await fetchSongById(id);
        if (cancelled) return;
        if (!s) {
          setNotFound(true);
          return;
        }
        setSong(s);
        const others = await fetchApprovedSongs({ limit: 8 });
        if (!cancelled) {
          setRelated(others.filter((x) => x.id !== id).slice(0, 4));
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDownload = async () => {
    if (!song) return;
    const url = await logDownload(song.id);
    if (url) {
      window.open(url, "_blank");
    } else if (song.audioUrl) {
      window.open(song.audioUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
      </div>
    );
  }

  if (notFound || !song) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Song not found</h1>
        <p className="mt-2 text-white/60">
          This track may still be pending approval or does not exist.
        </p>
        <Link href="/discover" className="mt-6 inline-block">
          <Button>Back to Discover</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="relative mx-auto h-64 w-64 shrink-0 overflow-hidden rounded-3xl shadow-2xl glow-blue md:mx-0 md:h-80 md:w-80">
          <Image
            src={song.coverUrl}
            alt={song.title}
            fill
            className="object-cover"
            priority
            sizes="320px"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center space-y-4">
          <p className="text-sm font-medium uppercase tracking-widest text-blue-400">
            {song.genre}
          </p>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            {song.title}
          </h1>
          <p className="text-xl text-white/70">{song.artistName}</p>
          <div className="flex flex-wrap gap-4 text-sm text-white/50">
            <span>{formatNumber(song.plays)} plays</span>
            <span>{formatNumber(song.downloads)} downloads</span>
            <span>{formatDuration(song.duration)}</span>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => {
                const p = toPlayerSong(song);
                setCurrentSong(p);
                addToQueue(p);
              }}
            >
              <Play className="h-5 w-5" fill="white" />
              Play
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="ghost" size="icon-lg">
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: song.title,
                    text: `Listen to ${song.title} by ${song.artistName} on AfroMuziki`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-white">More like this</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((s) => (
              <SongCard key={s.id} song={toPlayerSong(s)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
