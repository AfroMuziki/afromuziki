// src/pages/Upload.tsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const GENRES = ["Afrobeats", "Afropop", "Amapiano", "Bongo Flava", "Dancehall", "Gospel", "Highlife", "Kwaito", "RnB", "Reggae", "Hip Hop", "Zouk", "Other"];

export default function Upload() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ title: "", genre: "" });
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!user || (user.role !== "artist" && user.role !== "admin")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <p className="text-5xl mb-4">🎤</p>
        <h2 className="text-cream text-xl font-bold mb-2">Artists only</h2>
        <p className="text-cream/40 text-sm">Register as an artist to upload music and videos.</p>
      </div>
    );
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCover(f);
    setCoverPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!file || !form.title) { setError("Title and media file are required"); return; }
    setError(""); setUploading(true); setProgress(0);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", form.title);
    if (form.genre) fd.append("genre", form.genre);
    if (cover) fd.append("cover", cover);

    try {
      // Simulate progress (real progress needs XMLHttpRequest)
      const interval = setInterval(() => setProgress((p) => Math.min(p + 8, 90)), 400);
      await uploadApi.track(fd);
      clearInterval(interval);
      setProgress(100);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Upload failed");
    } finally { setUploading(false); }
  };

  return (
    <div className="px-4 py-6 pb-28 max-w-lg mx-auto">
      <h1 className="text-cream text-2xl font-bold mb-1">Upload Track</h1>
      <p className="text-cream/40 text-sm mb-6">Share your music with AfroMuziki</p>

      <div className="space-y-5">
        {/* Cover art */}
        <div>
          <label className="text-cream/60 text-xs font-semibold uppercase tracking-wider block mb-2">Cover Art (optional)</label>
          <div
            onClick={() => coverRef.current?.click()}
            className="w-24 h-24 rounded-xl border border-dashed border-gold/30 flex items-center justify-center cursor-pointer hover:border-gold/60 transition-colors overflow-hidden"
          >
            {coverPreview
              ? <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
              : <span className="text-gold/40 text-3xl">+</span>
            }
          </div>
          <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
        </div>

        {/* Title */}
        <div>
          <label className="text-cream/60 text-xs font-semibold uppercase tracking-wider block mb-1.5">Track Title *</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Jangu Wano" className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream/25 outline-none focus:border-gold/50 transition-colors" />
        </div>

        {/* Genre */}
        <div>
          <label className="text-cream/60 text-xs font-semibold uppercase tracking-wider block mb-1.5">Genre</label>
          <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-cream text-sm outline-none focus:border-gold/50 transition-colors">
            <option value="">Select genre</option>
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Media file */}
        <div>
          <label className="text-cream/60 text-xs font-semibold uppercase tracking-wider block mb-1.5">Audio or Video File *</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border border-dashed border-gold/30 rounded-xl p-6 text-center cursor-pointer hover:border-gold/60 hover:bg-gold/5 transition-all"
          >
            {file ? (
              <div>
                <p className="text-gold font-semibold text-sm truncate">{file.name}</p>
                <p className="text-cream/40 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-4xl mb-2">🎵</p>
                <p className="text-cream/50 text-sm">Click to choose file</p>
                <p className="text-cream/25 text-xs mt-1">MP3, WAV, AAC, MP4, WebM (max 500MB)</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="audio/*,video/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>

        {/* Progress */}
        {uploading && (
          <div>
            <div className="flex justify-between text-xs text-cream/50 mb-1.5">
              <span>Uploading to Cloudinary…</span><span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full transition-[width] duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        {success && <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">Upload successful! Redirecting…</p>}

        <button onClick={handleSubmit} disabled={uploading || success} className="w-full bg-gradient-to-r from-gold-dark to-gold text-navy-dark font-bold py-3 rounded-xl transition-opacity disabled:opacity-60 hover:opacity-90">
          {uploading ? "Uploading…" : "Publish Track"}
        </button>
      </div>
    </div>
  );
}
