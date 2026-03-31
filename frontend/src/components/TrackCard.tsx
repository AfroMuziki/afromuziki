// src/components/TrackCard.tsx
import { useState } from "react";
import { usePlayerStore, Track } from "@/store/playerStore";

interface Props { track: Track; queue: Track[]; }

const VideoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

function formatDuration(s?: number) {
  if (!s) return "";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function TrackCard({ track, queue }: Props) {
  const [hovered, setHovered] = useState(false);
  const { loadTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const isActive = currentTrack?.id === track.id;

  const handleClick = () => {
    if (isActive) togglePlay();
    else loadTrack(track, queue);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "12px 14px", borderRadius: 16, cursor: "pointer",
        background: isActive
          ? "linear-gradient(135deg, rgba(201,146,42,0.12), rgba(201,146,42,0.05))"
          : hovered
            ? "rgba(19,34,56,0.8)"
            : "rgba(12,24,41,0.5)",
        border: `1px solid ${isActive ? "rgba(201,146,42,0.3)" : hovered ? "rgba(201,146,42,0.12)" : "rgba(201,146,42,0.06)"}`,
        transition: "all 0.2s ease",
        boxShadow: isActive ? "0 4px 24px rgba(201,146,42,0.12)" : "none",
      }}
    >
      {/* Cover art */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img
          src={track.coverUrl || `https://placehold.co/56x56/0c1829/c9922a?text=♪`}
          alt={track.title}
          style={{
            width: 56, height: 56, borderRadius: 12, objectFit: "cover", display: "block",
            border: isActive ? "1.5px solid rgba(201,146,42,0.4)" : "1.5px solid rgba(255,255,255,0.04)",
            transition: "border-color 0.2s",
          }}
        />

        {/* Video badge */}
        {track.mediaType === "video" && !isActive && (
          <div style={{
            position: "absolute", bottom: 4, right: 4,
            background: "#c9922a", borderRadius: 4,
            padding: "2px 5px", display: "flex", alignItems: "center",
            color: "#060d1a",
          }}>
            <VideoIcon />
          </div>
        )}

        {/* Play overlay on hover or active */}
        {(hovered || isActive) && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: 12,
            background: isActive ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "opacity 0.15s",
          }}>
            {isActive && isPlaying ? (
              /* Sound bars animation */
              <div style={{ display: "flex", gap: 2.5, alignItems: "flex-end", height: 18 }}>
                {[0.8, 1.2, 0.9].map((spd, i) => (
                  <div key={i} style={{
                    width: 3, borderRadius: 2, background: "#e8ab3a",
                    transformOrigin: "bottom",
                    animation: `sound-bar ${spd}s ease-in-out infinite alternate`,
                    height: `${[60, 100, 75][i]}%`,
                  }} />
                ))}
              </div>
            ) : isActive && !isPlaying ? (
              <div style={{ color: "#e8ab3a" }}><PlayIcon /></div>
            ) : (
              <div style={{ color: "#f2e8d5" }}><PlayIcon /></div>
            )}
          </div>
        )}
      </div>

      {/* Track info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 700,
          color: isActive ? "#f2e8d5" : hovered ? "#f2e8d5" : "rgba(242,232,213,0.8)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          letterSpacing: "0.005em", marginBottom: 3,
          transition: "color 0.15s",
        }}>
          {track.title}
        </div>
        <div style={{
          fontSize: 12, fontWeight: 500,
          color: isActive ? "#c9922a" : "rgba(201,146,42,0.55)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          transition: "color 0.15s",
        }}>
          {track.artist}
        </div>
      </div>

      {/* Right side */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
        {track.mediaType === "video" && isActive && (
          <div style={{
            background: "rgba(201,146,42,0.15)", borderRadius: 5,
            padding: "2px 6px", display: "flex", alignItems: "center",
            color: "#c9922a", fontSize: 10, fontWeight: 700, gap: 3,
          }}>
            <VideoIcon /> <span>VIDEO</span>
          </div>
        )}
        {isActive && (
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#e8ab3a",
            boxShadow: "0 0 8px #e8ab3a",
            animation: isPlaying ? "pulse-dot 1.4s ease infinite" : "none",
          }} />
        )}
        {!isActive && track.duration && (
          <div style={{
            fontSize: 11, color: "rgba(242,232,213,0.25)",
            fontVariantNumeric: "tabular-nums",
          }}>
            {formatDuration(track.duration)}
          </div>
        )}
      </div>
    </div>
  );
}
