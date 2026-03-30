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
    <div className="min-h-screen flex items-center justify-center px-4 bg-navy-dark">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-dark mb-4">
            <span className="text-navy-dark text-2xl font-bold font-display">A</span>
          </div>
          <h1 className="text-cream text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-cream/40 text-sm mt-1">Sign in to AfroMuziki</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-cream/60 text-xs font-semibold uppercase tracking-wider block mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream/25 outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-cream/60 text-xs font-semibold uppercase tracking-wider block mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream/25 outline-none focus:border-gold/50 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold-dark to-gold text-navy-dark font-bold py-3 rounded-xl transition-opacity disabled:opacity-60 hover:opacity-90"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>

        <p className="text-center text-cream/40 text-sm mt-6">
          No account?{" "}
          <Link to="/register" className="text-gold font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
