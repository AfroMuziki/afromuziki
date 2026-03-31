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

function SkeletonCard() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 16px", borderRadius: 16,
      background: "rgba(12,24,41,0.5)",
      border: "1px solid rgba(201,146,42,0.06)",
    }}>
      <div className="skeleton" style={{ width: 56, height: 56, borderRadius: 12, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="skeleton" style={{ height: 13, width: "65%" }} />
        <div className="skeleton" style={{ height: 11, width: "40%" }} />
      </div>
    </div>
  );
}

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => tracksApi.list({ limit: 30 }).then((r) => r.data.tracks),
  });

  const queue: Track[] = (data || []).map(mapTrack);

  return (
    <div>
      {/* Hero */}
      <div style={{
        padding: "36px 20px 28px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,146,42,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="animate-fade-up" style={{
          fontSize: 11, fontWeight: 800, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#c9922a", marginBottom: 8,
        }}>
          🔥 Now Streaming
        </div>
        <h1 className="animate-fade-up-1" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 30, fontWeight: 700, lineHeight: 1.15,
          color: "#f2e8d5", marginBottom: 6,
          letterSpacing: "-0.02em",
        }}>
          African Music<br />& Video
        </h1>
        <p className="animate-fade-up-2" style={{
          fontSize: 13, color: "rgba(242,232,213,0.45)",
          fontWeight: 500, lineHeight: 1.5,
        }}>
          Discover the freshest sounds from across the continent
        </p>
      </div>

      {/* Track list */}
      <div style={{ padding: "0 16px 20px" }}>
        {/* Section header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 14,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 800, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(242,232,213,0.35)",
          }}>
            Trending
          </div>
          <div style={{
            width: 40, height: 1,
            background: "linear-gradient(90deg, rgba(201,146,42,0.4), transparent)",
          }} />
        </div>

        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "rgba(242,232,213,0.3)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: "rgba(242,232,213,0.5)" }}>
              Connection failed
            </div>
            <div style={{ fontSize: 12 }}>Check your internet and try again</div>
          </div>
        )}

        {data && data.length === 0 && (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "rgba(242,232,213,0.3)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎵</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: "rgba(242,232,213,0.5)" }}>
              No tracks yet
            </div>
            <div style={{ fontSize: 12 }}>Be the first to upload music</div>
          </div>
        )}

        {data && data.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {data.map((t: any, i: number) => (
              <div key={t.id} style={{ animation: `fadeUp 0.35s ${i * 0.04}s ease both` }}>
                <TrackCard track={mapTrack(t)} queue={queue} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
