// src/components/TrackCard.tsx
import { usePlayerStore, Track } from "@/store/playerStore";

interface Props {
  track: Track;
  queue: Track[];
}

const VideoIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>;

export default function TrackCard({ track, queue }: Props) {
  const { loadTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const isActive = currentTrack?.id === track.id;

  const handleClick = () => {
    if (isActive) togglePlay();
    else loadTrack(track, queue);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 border ${
        isActive
          ? "bg-gold/10 border-gold/30"
          : "bg-white/[0.02] border-white/[0.04] hover:bg-gold/5 hover:border-gold/15"
      }`}
    >
      {/* Cover */}
      <div className="relative flex-shrink-0">
        <img
          src={track.coverUrl || "https://placehold.co/52x52/0D1E38/D4A843?text=♪"}
          alt={track.title}
          className={`w-[52px] h-[52px] rounded-lg object-cover transition-opacity ${isActive ? "opacity-100" : "opacity-70"}`}
        />
        {track.mediaType === "video" && (
          <span className="absolute bottom-1 right-1 bg-gold text-navy-dark rounded px-1 flex items-center"><VideoIcon /></span>
        )}
        {isActive && (
          <div className={`absolute inset-0 rounded-lg flex items-center justify-center bg-black/40 ${isPlaying ? "" : ""}`}>
            <div className="flex gap-[3px] items-end h-4">
              {[1,2,3].map((i) => (
                <div
                  key={i}
                  className="w-[3px] bg-gold rounded-sm"
                  style={{
                    height: isPlaying ? `${[60, 100, 75][i-1]}%` : "40%",
                    animation: isPlaying ? `sound-bar ${[0.8, 0.6, 1.0][i-1]}s ease-in-out infinite alternate` : "none",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-bold truncate ${isActive ? "text-cream" : "text-cream/65"}`}>{track.title}</div>
        <div className={`text-xs font-medium truncate mt-0.5 ${isActive ? "text-gold" : "text-gold/55"}`}>{track.artist}</div>
      </div>

      {/* Active dot */}
      {isActive && (
        <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0 shadow-[0_0_6px_#D4A843]" style={{ animation: isPlaying ? "pulse-dot 1.4s ease infinite" : "none" }} />
      )}
    </div>
  );
}
