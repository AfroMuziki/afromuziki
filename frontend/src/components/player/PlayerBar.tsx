// src/components/player/PlayerBar.tsx
import { useCallback } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { usePlayer, formatTime } from "@/hooks/usePlayer";

const PlayIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const PrevIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>;
const NextIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 18l8.5-6L6 6v12zm2.5-6 6-4.33v8.65L8.5 12zM16 6h2v12h-2z"/></svg>;
const VolumeHighIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>;
const VolumeMuteIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>;
const VideoIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>;
const CloseIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;

function IconBtn({ onClick, title, children }: { onClick: () => void; title?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="bg-transparent border-none text-cream/55 hover:text-gold cursor-pointer flex items-center justify-center p-1.5 rounded-md transition-colors duration-150"
    >
      {children}
    </button>
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
        <div className="fixed inset-0 z-[9998] bg-black/92 flex items-center justify-center">
          <button onClick={() => setIsVideoOpen(false)} className="absolute top-5 right-5 w-10 h-10 rounded-full border border-gold/35 bg-gold/10 flex items-center justify-center text-gold cursor-pointer hover:bg-gold/20 transition-colors">
            <CloseIcon />
          </button>
          <video ref={videoRef} className="max-w-[90vw] max-h-[80vh] rounded-xl shadow-[0_0_60px_rgba(212,168,67,0.2)]" />
        </div>
      )}

      {/* Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-gradient-to-r from-navy to-navy-dark border-t border-gold/20 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
        {/* Progress */}
        <div onClick={handleProgressClick} className="h-[3px] bg-white/5 cursor-pointer relative group">
          <div className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-sm transition-[width] duration-300 ease-linear relative" style={{ width: `${progress}%` }}>
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold-light shadow-[0_0_6px_rgba(240,200,102,0.8)]" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center px-3 py-2.5 gap-3 min-h-[68px]">
          {/* Cover */}
          <div className="relative flex-shrink-0">
            <img src={currentTrack.coverUrl || "https://placehold.co/46x46/0D1E38/D4A843?text=♪"} alt={currentTrack.title} className="w-[46px] h-[46px] rounded-lg object-cover border border-gold/30" />
            {currentTrack.mediaType === "video" && (
              <button onClick={() => setIsVideoOpen(true)} className="absolute inset-0 bg-black/55 rounded-lg border-none flex items-center justify-center text-gold cursor-pointer hover:bg-black/70 transition-colors">
                <VideoIcon />
              </button>
            )}
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <div className="text-cream text-[13px] font-bold truncate tracking-[0.01em]">{currentTrack.title}</div>
            <div className="text-gold text-[11px] font-semibold truncate mt-0.5">{currentTrack.artist}</div>
          </div>

          {/* Time */}
          <div className="text-cream/40 text-[11px] tabular-nums flex-shrink-0 flex gap-0.5">
            <span>{formatTime(currentTime)}</span><span className="opacity-50">/</span><span>{formatTime(duration)}</span>
          </div>

          {/* Playback */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <IconBtn onClick={prevTrack} title="Previous"><PrevIcon /></IconBtn>
            <button
              onClick={togglePlay}
              className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-gold via-gold to-gold-dark border-none text-navy-dark flex items-center justify-center cursor-pointer flex-shrink-0 shadow-[0_2px_16px_rgba(212,168,67,0.4)] active:scale-95 transition-transform"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <IconBtn onClick={nextTrack} title="Next"><NextIcon /></IconBtn>
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
            <IconBtn onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
              {isMuted || volume === 0 ? <VolumeMuteIcon /> : <VolumeHighIcon />}
            </IconBtn>
            <input type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-[68px] cursor-pointer" />
          </div>

          <IconBtn onClick={clearPlayer} title="Close"><CloseIcon /></IconBtn>
        </div>
      </div>
    </>
  );
}
