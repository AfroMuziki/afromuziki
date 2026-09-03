"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, TrendingUp, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { SongCard } from "@/components/music/song-card";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePlayerStore } from "@/store/player-store";
import { fetchApprovedSongs, toPlayerSong, type ApiSong } from "@/lib/api";

export default function HomePage() {
  const [songs, setSongs] = useState<ApiSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { setCurrentSong, addToQueue } = usePlayerStore();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchApprovedSongs({ limit: 20 });
        if (!cancelled) setSongs(data);
      } catch {
        if (!cancelled) setError("Unable to load music. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = songs[0];
  const popular = songs.slice(0, 5);
  const recent = songs;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="flex gap-8">
        <Sidebar mode="discover" />

        <div className="min-w-0 flex-1 space-y-10">
          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
            </div>
          ) : error ? (
            <Card variant="glass" className="p-12 text-center text-white/60">
              {error}
            </Card>
          ) : songs.length === 0 ? (
            <Card variant="glass" className="p-12 text-center">
              <h2 className="text-xl font-semibold text-white">No music yet</h2>
              <p className="mt-2 text-white/60">
                Approved tracks will appear here. Artists can upload from the Artist Hub.
              </p>
              <Link href="/artist/upload" className="mt-6 inline-block">
                <Button>Upload a song</Button>
              </Link>
            </Card>
          ) : (
            <>
              {/* Hero */}
              {featured && (
                <section className="relative overflow-hidden rounded-3xl">
                  <div className="absolute inset-0 gradient-primary opacity-90" />
                  <div
                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40"
                    style={{ backgroundImage: `url(${featured.coverUrl})` }}
                  />
                  <div className="relative flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:p-12">
                    <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl shadow-2xl md:h-52 md:w-52">
                      <Image
                        src={featured.coverUrl}
                        alt={featured.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="208px"
                      />
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm font-medium uppercase tracking-widest text-white/70">
                        Featured
                      </p>
                      <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                        {featured.title}
                      </h1>
                      <p className="text-lg text-white/80">{featured.artistName}</p>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          size="lg"
                          className="gap-2 shadow-xl shadow-black/20"
                          onClick={() => {
                            const song = toPlayerSong(featured);
                            setCurrentSong(song);
                            addToQueue(song);
                          }}
                        >
                          <Play className="h-5 w-5" fill="white" />
                          Play Now
                        </Button>
                        <Link href="/discover">
                          <Button variant="secondary" size="lg" className="gap-2">
                            Explore All
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Quick categories */}
              <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "New Releases", sub: "Latest drops", icon: Sparkles },
                  { label: "Popular", sub: "Most played", icon: TrendingUp },
                  { label: "Afrobeats", sub: "Genre", icon: Play },
                  { label: "Discover", sub: "Browse all", icon: TrendingUp },
                ].map((item) => (
                  <Link key={item.label} href="/discover">
                    <Card
                      variant="glass"
                      className="flex flex-col items-start gap-2 p-4 transition-premium hover:bg-white/10"
                    >
                      <item.icon className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-white/50">{item.sub}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </section>

              {/* Popular grid */}
              <section>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Popular</h2>
                  <Link
                    href="/discover"
                    className="text-sm font-medium text-blue-400 hover:text-blue-300"
                  >
                    See all
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {popular.map((s) => (
                    <SongCard key={s.id} song={toPlayerSong(s)} />
                  ))}
                </div>
              </section>

              {/* List */}
              <section>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">New Releases</h2>
                </div>
                <Card variant="glass" className="divide-y divide-white/5 p-2">
                  {recent.map((s) => (
                    <SongCard key={s.id} song={toPlayerSong(s)} variant="list" />
                  ))}
                </Card>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
