"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Upload, Loader2 } from "lucide-react";
import { SongCard } from "@/components/music/song-card";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { fetchMySongs, toPlayerSong, type ApiSong } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function MySongsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [songs, setSongs] = useState<ApiSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMySongs();
        if (!cancelled) setSongs(data);
      } catch (e) {
        if (!cancelled) {
          if (e instanceof Error && e.message === "Unauthorized") router.push("/login");
          else setError("Could not load your songs.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="flex gap-8">
        <Sidebar mode="artist" />
        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">My Songs</h1>
              <p className="mt-1 text-white/60">Every track you've uploaded, in any status.</p>
            </div>
            <Link href="/artist/upload">
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload New Song
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : error ? (
            <Card variant="glass" className="p-8 text-center text-red-300">
              {error}
            </Card>
          ) : songs.length === 0 ? (
            <Card variant="glass" className="p-12 text-center">
              <p className="text-white/60">You haven&apos;t uploaded any songs yet.</p>
              <Link href="/artist/upload" className="mt-4 inline-block">
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload your first track
                </Button>
              </Link>
            </Card>
          ) : (
            <Card variant="glass" className="divide-y divide-white/5 p-2">
              {songs.map((s) => (
                <SongCard key={s.id} song={toPlayerSong(s)} variant="list" showStatus />
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
