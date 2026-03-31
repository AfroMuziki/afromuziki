// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError("All fields required"); return; }
    setLoading(true); setError("");
    try {
      const { data } = await authApi.login(form);
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "20px",
    }}>
      {/* Bg glow */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,146,42,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="animate-fade-up" style={{ width: "100%", maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
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
          }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: "rgba(242,232,213,0.4)", fontWeight: 500 }}>
            Sign in to AfroMuziki
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(12,24,41,0.7)",
          border: "1px solid rgba(201,146,42,0.12)",
          borderRadius: 20, padding: 24,
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "rgba(242,232,213,0.45)", marginBottom: 8,
              }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={{ width: "100%", padding: "12px 16px", fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "rgba(242,232,213,0.45)", marginBottom: 8,
              }}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{ width: "100%", padding: "12px 16px", fontSize: 14 }}
              />
            </div>

            {error && (
              <div style={{
                background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.2)",
                borderRadius: 10, padding: "10px 14px",
                fontSize: 13, color: "#f08080",
              }}>{error}</div>
            )}

            <button className="btn-gold" onClick={handleSubmit} disabled={loading} style={{ marginTop: 4 }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(242,232,213,0.35)" }}>
          No account?{" "}
          <Link to="/register" style={{ color: "#e8ab3a", fontWeight: 700, textDecoration: "none" }}>
            Join AfroMuziki
          </Link>
        </p>
      </div>
    </div>
  );
}
