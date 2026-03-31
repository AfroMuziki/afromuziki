// src/pages/Upload.tsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const GENRES = ["Afrobeats","Afropop","Amapiano","Bongo Flava","Dancehall","Gospel","Highlife","Kwaito","RnB","Reggae","Hip Hop","Zouk","Other"];

const labelStyle = {
  display: "block" as const, fontSize: 11, fontWeight: 700,
  letterSpacing: "0.12em", textTransform: "uppercase" as const,
  color: "rgba(242,232,213,0.4)", marginBottom: 8,
};
const inputStyle = { width: "100%", padding: "12px 16px", fontSize: 14 };

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
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "70vh", padding: 24, textAlign: "center",
      }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🎤</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 22,
          color: "#f2e8d5", marginBottom: 8,
        }}>Artists Only</h2>
        <p style={{ fontSize: 13, color: "rgba(242,232,213,0.4)", lineHeight: 1.6 }}>
          Register as an artist to upload<br/>music and videos to AfroMuziki.
        </p>
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
      const interval = setInterval(() => setProgress((p) => Math.min(p + 6, 88)), 500);
      await uploadApi.track(fd);
      clearInterval(interval);
      setProgress(100);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1800);
    } catch (err: any) {
      setError(err.response?.data?.error || "Upload failed");
    } finally { setUploading(false); }
  };

  return (
    <div style={{ padding: "28px 20px 20px", maxWidth: 480, margin: "0 auto" }}>
      <div className="animate-fade-up" style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 11, fontWeight: 800, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "#c9922a", marginBottom: 8,
        }}>Artist Studio</div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 26, fontWeight: 700, color: "#f2e8d5", letterSpacing: "-0.02em",
        }}>Upload Track</h1>
        <p style={{ fontSize: 13, color: "rgba(242,232,213,0.4)", marginTop: 4 }}>
          Share your music with the world
        </p>
      </div>

      <div style={{
        background: "rgba(12,24,41,0.7)",
        border: "1px solid rgba(201,146,42,0.12)",
        borderRadius: 20, padding: 22,
        backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column", gap: 18,
      }}>
        {/* Cover art */}
        <div>
          <label style={labelStyle}>Cover Art</label>
          <div
            onClick={() => coverRef.current?.click()}
            style={{
              width: 90, height: 90, borderRadius: 14, cursor: "pointer",
              border: "1.5px dashed rgba(201,146,42,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", transition: "border-color 0.2s",
              background: "rgba(19,34,56,0.5)",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,146,42,0.6)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(201,146,42,0.3)")}
          >
            {coverPreview
              ? <img src={coverPreview} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>🖼</div>
                  <div style={{ fontSize: 9, color: "rgba(242,232,213,0.3)", fontWeight: 700, letterSpacing: "0.08em" }}>ADD ART</div>
                </div>
            }
          </div>
          <input ref={coverRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCoverChange} />
        </div>

        {/* Title */}
        <div>
          <label style={labelStyle}>Track Title *</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Jangu Wano" style={inputStyle} />
        </div>

        {/* Genre */}
        <div>
          <label style={labelStyle}>Genre</label>
          <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} style={inputStyle}>
            <option value="">Select genre</option>
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* File */}
        <div>
          <label style={labelStyle}>Audio or Video File *</label>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: "1.5px dashed rgba(201,146,42,0.25)",
              borderRadius: 14, padding: "22px 16px",
              textAlign: "center", cursor: "pointer",
              background: "rgba(19,34,56,0.4)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,146,42,0.5)";
              (e.currentTarget as HTMLDivElement).style.background = "rgba(201,146,42,0.04)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,146,42,0.25)";
              (e.currentTarget as HTMLDivElement).style.background = "rgba(19,34,56,0.4)";
            }}
          >
            {file ? (
              <>
                <div style={{ fontSize: 24, marginBottom: 6 }}>✅</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e8ab3a", wordBreak: "break-all" }}>{file.name}</div>
                <div style={{ fontSize: 11, color: "rgba(242,232,213,0.3)", marginTop: 4 }}>
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 30, marginBottom: 8 }}>🎵</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(242,232,213,0.6)", marginBottom: 4 }}>
                  Tap to choose file
                </div>
                <div style={{ fontSize: 11, color: "rgba(242,232,213,0.25)" }}>
                  MP3 · WAV · AAC · MP4 · WebM (max 500MB)
                </div>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="audio/*,video/*" style={{ display: "none" }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>

        {/* Progress */}
        {uploading && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(242,232,213,0.4)", marginBottom: 8 }}>
              <span>Uploading to Cloudinary…</span><span style={{ color: "#e8ab3a", fontWeight: 700 }}>{progress}%</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 4,
                background: "linear-gradient(90deg, #b8832a, #e8ab3a, #f5c842)",
                width: `${progress}%`, transition: "width 0.4s ease",
                boxShadow: "0 0 12px rgba(232,171,58,0.5)",
              }} />
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.2)",
            borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f08080",
          }}>{error}</div>
        )}

        {success && (
          <div style={{
            background: "rgba(50,200,100,0.1)", border: "1px solid rgba(50,200,100,0.2)",
            borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#6fdc9a",
            textAlign: "center", fontWeight: 600,
          }}>✅ Uploaded successfully! Redirecting…</div>
        )}

        <button className="btn-gold" onClick={handleSubmit} disabled={uploading || success}>
          {uploading ? "Uploading…" : "Publish Track"}
        </button>
      </div>
    </div>
  );
}
