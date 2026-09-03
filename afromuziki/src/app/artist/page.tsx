"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  Music,
  BarChart3,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { SongCard } from "@/components/music/song-card";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { fetchMySongs, toPlayerSong, type ApiSong } from "@/lib/api";

export default function ArtistDashboard() {
  const router = useRouter();
  const { user, profile } = useAuthStore();
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

  const pending = songs.filter((s) => s.status === "pending").length;
  const approved = songs.filter((s) => s.status === "approved").length;
  const totalPlays = songs.reduce((acc, s) => acc + (s.plays || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="flex gap-8">
        <Sidebar mode="artist" />
        <div className="min-w-0 flex-1 space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Artist Dashboard</h1>
              <p className="mt-1 text-white/60">
                {profile?.stage_name
                  ? `Welcome back, ${profile.stage_name}`
                  : "Manage your music and track performance"}
              </p>
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
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card variant="glass" className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                      <Music className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{songs.length}</p>
                      <p className="text-xs text-white/50">Total Songs</p>
                    </div>
                  </div>
                </Card>
                <Card variant="glass" className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{approved}</p>
                      <p className="text-xs text-white/50">Approved</p>
                    </div>
                  </div>
                </Card>
                <Card variant="glass" className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
                      <Clock className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{pending}</p>
                      <p className="text-xs text-white/50">Pending</p>
                    </div>
                  </div>
                </Card>
                <Card variant="glass" className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
                      <BarChart3 className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {formatNumber(totalPlays)}
                      </p>
                      <p className="text-xs text-white/50">Total Plays</p>
                    </div>
                  </div>
                </Card>
              </div>

              <section>
                <h2 className="mb-4 text-lg font-semibold text-white">My Songs</h2>
                {songs.length === 0 ? (
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
                      <SongCard
                        key={s.id}
                        song={toPlayerSong(s)}
                        variant="list"
                        showStatus
                      />
                    ))}
                  </Card>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
