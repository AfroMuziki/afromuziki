"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SongCard } from "@/components/music/song-card";
import { Sidebar } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { fetchApprovedSongs, toPlayerSong, type ApiSong } from "@/lib/api";

const GENRES = [
  "Afrobeats",
  "Afro-soul",
  "Afro-fusion",
  "Highlife",
  "Amapiano",
  "Gospel",
  "Hip-Hop",
  "R&B",
];

export default function DiscoverPage() {
  const [songs, setSongs] = useState<ApiSong[]>([]);
  const [genre, setGenre] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const data = await fetchApprovedSongs({
          genre: genre || undefined,
          limit: 50,
        });
        if (!cancelled) setSongs(data);
      } catch {
        if (!cancelled) setError("Unable to load music.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [genre]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="flex gap-8">
        <Sidebar mode="discover" />
        <div className="min-w-0 flex-1 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Discover</h1>
            <p className="mt-1 text-white/60">
              Explore the best of African music
            </p>
          </div>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-white">Genres</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setGenre(null)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-premium ${
                  !genre
                    ? "border-blue-500 bg-blue-500/20 text-white"
                    : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                All
              </button>
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-premium ${
                    genre === g
                      ? "border-blue-500 bg-blue-500/20 text-white"
                      : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </section>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : error ? (
            <Card variant="glass" className="p-12 text-center text-white/60">
              {error}
            </Card>
          ) : songs.length === 0 ? (
            <Card variant="glass" className="p-12 text-center text-white/50">
              No approved tracks in this category yet.
            </Card>
          ) : (
            <>
              <section>
                <h2 className="mb-4 text-lg font-semibold text-white">
                  {genre || "All Tracks"}
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {songs.map((s) => (
                    <SongCard key={s.id} song={toPlayerSong(s)} />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-lg font-semibold text-white">
                  List view
                </h2>
                <Card variant="glass" className="divide-y divide-white/5 p-2">
                  {songs.map((s) => (
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
