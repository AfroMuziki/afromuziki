// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "", displayName: "", role: "listener" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password || !form.displayName) { setError("All fields required"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true); setError("");
    try {
      const { data } = await authApi.register(form);
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", padding: "12px 16px", fontSize: 14 };
  const labelStyle = {
    display: "block" as const, fontSize: 11, fontWeight: 700,
    letterSpacing: "0.12em", textTransform: "uppercase" as const,
    color: "rgba(242,232,213,0.45)", marginBottom: 8,
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "20px",
    }}>
      <div style={{
        position: "fixed", top: "30%", right: "10%",
        width: 250, height: 250, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,146,42,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="animate-fade-up" style={{ width: "100%", maxWidth: 360 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, margin: "0 auto 14px",
            background: "linear-gradient(135deg, #b8832a, #e8ab3a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px rgba(201,146,42,0.35)",
          }}>
            <svg viewBox="0 0 24 24" fill="#060d1a" width="26" height="26">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 26, fontWeight: 700, color: "#f2e8d5",
            letterSpacing: "-0.02em", marginBottom: 4,
          }}>Join AfroMuziki</h1>
          <p style={{ fontSize: 13, color: "rgba(242,232,213,0.4)", fontWeight: 500 }}>
            African music, for everyone
          </p>
        </div>

        <div style={{
          background: "rgba(12,24,41,0.7)",
          border: "1px solid rgba(201,146,42,0.12)",
          borderRadius: 20, padding: 24,
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Display Name</label>
              <input type="text" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="Your name or artist name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" style={inputStyle} />
            </div>

            {/* Role selector */}
            <div>
              <label style={labelStyle}>I am a</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { value: "listener", label: "Listener", desc: "Discover music" },
                  { value: "artist", label: "Artist", desc: "Upload & share" },
                ].map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setForm({ ...form, role: r.value })}
                    style={{
                      padding: "12px 10px", borderRadius: 12, cursor: "pointer",
                      border: `1px solid ${form.role === r.value ? "rgba(201,146,42,0.45)" : "rgba(201,146,42,0.1)"}`,
                      background: form.role === r.value ? "rgba(201,146,42,0.12)" : "rgba(19,34,56,0.5)",
                      transition: "all 0.15s", fontFamily: "inherit", textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 15, marginBottom: 3 }}>{r.label}</div>
                    <div style={{ fontSize: 10, color: "rgba(242,232,213,0.4)", fontWeight: 600 }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{
                background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.2)",
                borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f08080",
              }}>{error}</div>
            )}

            <button className="btn-gold" onClick={handleSubmit} disabled={loading} style={{ marginTop: 4 }}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(242,232,213,0.35)" }}>
          Have an account?{" "}
          <Link to="/login" style={{ color: "#e8ab3a", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
