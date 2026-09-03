"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Trash2, Loader2 } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import type { SongStatus } from "@/types";

type AdminSong = {
  id: string;
  title: string;
  cover_url: string;
  status: SongStatus;
  duration_seconds: number;
  created_at: string;
  profiles?: { stage_name: string; email: string };
};

export default function AdminPage() {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const [songs, setSongs] = useState<AdminSong[]>([]);
  const [filter, setFilter] = useState<SongStatus | "all">("pending");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const q = filter === "all" ? "" : `?status=${filter}`;
      const res = await fetch(`/api/admin/songs${q}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load songs");
        if (res.status === 401 || res.status === 403) {
          router.push("/login");
        }
        return;
      }
      setSongs(data.songs || []);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [filter, router]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchSongs();
  }, [user, fetchSongs, router]);

  const moderate = async (
    songId: string,
    action: "approve" | "reject" | "delete",
    reason?: string
  ) => {
    if (action === "delete" && !confirm("Permanently delete this song?")) return;

    setActionLoading(songId);
    try {
      const res = await fetch("/api/admin/songs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId, action, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Action failed");
        return;
      }
      // Refresh list
      await fetchSongs();
    } catch {
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="flex gap-8">
        <Sidebar mode="admin" />
        <div className="min-w-0 flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Moderation</h1>
            <p className="mt-1 text-white/60">
              Approve, reject or remove songs according to Terms & Conditions
            </p>
            {profile && (
              <p className="mt-1 text-xs text-white/40">
                Signed in as {profile.stage_name || profile.email} ({profile.role})
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium capitalize transition-premium",
                  filter === f
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : songs.length === 0 ? (
            <Card variant="glass" className="p-12 text-center text-white/50">
              No songs in this category
            </Card>
          ) : (
            <div className="space-y-3">
              {songs.map((song) => (
                <Card
                  key={song.id}
                  variant="glass"
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/10">
                      {song.cover_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={song.cover_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">
                        {song.title}
                      </p>
                      <p className="truncate text-sm text-white/60">
                        {song.profiles?.stage_name || "Unknown artist"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                        song.status === "approved" &&
                          "bg-emerald-500/20 text-emerald-400",
                        song.status === "pending" &&
                          "bg-amber-500/20 text-amber-400",
                        song.status === "rejected" &&
                          "bg-red-500/20 text-red-400"
                      )}
                    >
                      {song.status}
                    </span>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    {song.status !== "approved" && (
                      <Button
                        size="sm"
                        variant="success"
                        className="gap-1.5"
                        disabled={actionLoading === song.id}
                        onClick={() => moderate(song.id, "approve")}
                      >
                        {actionLoading === song.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        Approve
                      </Button>
                    )}
                    {song.status !== "rejected" && (
                      <Button
                        size="sm"
                        variant="danger"
                        className="gap-1.5"
                        disabled={actionLoading === song.id}
                        onClick={() =>
                          moderate(
                            song.id,
                            "reject",
                            "Violates content guidelines"
                          )
                        }
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-red-400 hover:bg-red-500/10"
                      disabled={actionLoading === song.id}
                      onClick={() => moderate(song.id, "delete")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
