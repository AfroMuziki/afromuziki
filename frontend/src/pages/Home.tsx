// src/pages/Home.tsx
import { useQuery } from "@tanstack/react-query";
import { tracksApi } from "@/lib/api";
import TrackCard from "@/components/TrackCard";
import { Track } from "@/store/playerStore";

function mapTrack(t: any): Track {
  return {
    id: t.id,
    title: t.title,
    artist: t.artists?.stage_name || "Unknown Artist",
    coverUrl: t.cover_url || "",
    mediaUrl: t.media_url,
    mediaType: t.media_type,
    duration: t.duration_seconds,
  };
}

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => tracksApi.list({ limit: 30 }).then((r) => r.data.tracks),
  });

  const queue: Track[] = (data || []).map(mapTrack);

  return (
    <div className="px-4 py-6 pb-28">
      <div className="mb-6">
        <h1 className="text-cream text-2xl font-bold tracking-tight">Trending Now</h1>
        <p className="text-cream/40 text-sm mt-1">Fresh African music & video</p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse">
              <div className="w-[52px] h-[52px] rounded-lg bg-white/10 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/10 rounded w-3/4" />
                <div className="h-2.5 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-cream/40">
          <p className="text-4xl mb-3">🎵</p>
          <p className="text-sm">Could not load tracks. Check your connection.</p>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="text-center py-12 text-cream/40">
          <p className="text-4xl mb-3">🎵</p>
          <p className="text-sm">No tracks yet. Be the first to upload.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="space-y-2">
          {data.map((t: any) => (
            <TrackCard key={t.id} track={mapTrack(t)} queue={queue} />
          ))}
        </div>
      )}
    </div>
  );
}
