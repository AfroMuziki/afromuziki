// src/components/player/PlayerBar.tsx
import { useCallback } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { usePlayer, formatTime } from "@/hooks/usePlayer";

const Ico = ({ d, size = 20 }: { d: string; size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d={d}/></svg>
);
const PLAY  = "M8 5v14l11-7z";
const PAUSE = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";
const PREV  = "M6 6h2v12H6zm3.5 6 8.5 6V6z";
const NEXT  = "M6 18l8.5-6L6 6v12zm2.5-6 6-4.33v8.65L8.5 12zM16 6h2v12h-2z";
const VOL   = "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z";
const MUTE  = "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z";
const VID   = "M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z";
const CLOSE = "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z";

function IBtn({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button onClick={onClick} title={title} style={{
      background: "none", border: "none", cursor: "pointer",
      color: "rgba(242,232,213,0.5)", display: "flex", alignItems: "center",
      justifyContent: "center", padding: 7, borderRadius: 8,
      transition: "color 0.15s, background 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.color = "#e8ab3a"; e.currentTarget.style.background = "rgba(201,146,42,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "rgba(242,232,213,0.5)"; e.currentTarget.style.background = "none"; }}
    >{children}</button>
  );
}

export default function PlayerBar() {
  const { currentTrack, isPlaying, currentTime, duration, volume, isMuted, isVideoOpen, togglePlay, nextTrack, prevTrack, setVolume, toggleMute, clearPlayer, setIsVideoOpen } = usePlayerStore();
  const { handleSeek, videoRef } = usePlayer();

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleSeek(((e.clientX - rect.left) / rect.width) * duration);
  }, [duration, handleSeek]);

  if (!currentTrack) return null;

  return (
    <>
      {/* Video Modal */}
      {isVideoOpen && currentTrack.mediaType === "video" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.95)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)",
        }}>
          <button onClick={() => setIsVideoOpen(false)} style={{
            position: "absolute", top: 20, right: 20,
            width: 42, height: 42, borderRadius: "50%",
            background: "rgba(201,146,42,0.12)",
            border: "1px solid rgba(201,146,42,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#c9922a", cursor: "pointer",
            transition: "background 0.15s",
          }}>
            <Ico d={CLOSE} size={16}/>
          </button>
          <video ref={videoRef} style={{
            maxWidth: "92vw", maxHeight: "82vh",
            borderRadius: 14,
            boxShadow: "0 0 80px rgba(201,146,42,0.15)",
          }} />
        </div>
      )}

      {/* Player bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
        background: "rgba(6,13,26,0.96)",
        backdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(201,146,42,0.15)",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.6), 0 -1px 0 rgba(201,146,42,0.06)",
      }}>
        {/* Progress track */}
        <div
          onClick={handleProgressClick}
          style={{ height: 3, background: "rgba(255,255,255,0.04)", cursor: "pointer", position: "relative" }}
        >
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #b8832a, #e8ab3a, #f5c842)",
            borderRadius: 2,
            transition: "width 0.8s linear",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)",
              width: 9, height: 9, borderRadius: "50%",
              background: "#f5c842",
              boxShadow: "0 0 8px rgba(245,200,66,0.9)",
            }} />
          </div>
        </div>

        {/* Controls */}
        <div style={{
          display: "flex", alignItems: "center",
          padding: "9px 12px", gap: 8, minHeight: 66,
        }}>
          {/* Cover */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src={currentTrack.coverUrl || "https://placehold.co/46x46/0c1829/c9922a?text=♪"}
              alt={currentTrack.title}
              style={{
                width: 46, height: 46, borderRadius: 10, objectFit: "cover", display: "block",
                border: "1.5px solid rgba(201,146,42,0.25)",
              }}
            />
            {currentTrack.mediaType === "video" && (
              <button onClick={() => setIsVideoOpen(true)} style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", borderRadius: 10,
                border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#c9922a", cursor: "pointer",
              }}>
                <Ico d={VID} size={16}/>
              </button>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: "#f2e8d5",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              letterSpacing: "0.005em",
            }}>{currentTrack.title}</div>
            <div style={{
              fontSize: 11, fontWeight: 600, color: "#c9922a",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2,
            }}>{currentTrack.artist}</div>
          </div>

          {/* Time */}
          <div style={{
            color: "rgba(242,232,213,0.3)", fontSize: 11,
            fontVariantNumeric: "tabular-nums", flexShrink: 0,
            display: "flex", gap: 1, letterSpacing: "0.02em",
          }}>
            <span>{formatTime(currentTime)}</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Playback */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
            <IBtn onClick={prevTrack} title="Previous"><Ico d={PREV} size={18}/></IBtn>
            <button
              onClick={togglePlay}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "linear-gradient(135deg, #b8832a 0%, #d9a03a 55%, #c9922a 100%)",
                border: "none", color: "#060d1a",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
                boxShadow: "0 2px 18px rgba(201,146,42,0.45)",
                transition: "transform 0.1s, box-shadow 0.15s",
              }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.93)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <Ico d={isPlaying ? PAUSE : PLAY} size={20}/>
            </button>
            <IBtn onClick={nextTrack} title="Next"><Ico d={NEXT} size={18}/></IBtn>
          </div>

          {/* Volume — hidden on very small screens */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <IBtn onClick={toggleMute}><Ico d={isMuted || volume === 0 ? MUTE : VOL} size={17}/></IBtn>
            <input
              type="range" min={0} max={1} step={0.01}
              value={isMuted ? 0 : volume}
              onChange={e => setVolume(Number(e.target.value))}
              style={{ width: 64 }}
            />
          </div>

          <IBtn onClick={clearPlayer} title="Close"><Ico d={CLOSE} size={15}/></IBtn>
        </div>
      </div>
    </>
  );
}
