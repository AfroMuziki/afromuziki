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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-navy-dark">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-dark mb-4">
            <span className="text-navy-dark text-2xl font-bold font-display">A</span>
          </div>
          <h1 className="text-cream text-2xl font-bold tracking-tight">Join AfroMuziki</h1>
          <p className="text-cream/40 text-sm mt-1">African music, for everyone</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-cream/60 text-xs font-semibold uppercase tracking-wider block mb-1.5">Display Name</label>
            <input type="text" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="Your name or artist name" className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream/25 outline-none focus:border-gold/50 transition-colors" />
          </div>
          <div>
            <label className="text-cream/60 text-xs font-semibold uppercase tracking-wider block mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream/25 outline-none focus:border-gold/50 transition-colors" />
          </div>
          <div>
            <label className="text-cream/60 text-xs font-semibold uppercase tracking-wider block mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream/25 outline-none focus:border-gold/50 transition-colors" />
          </div>
          <div>
            <label className="text-cream/60 text-xs font-semibold uppercase tracking-wider block mb-1.5">I am a</label>
            <div className="grid grid-cols-2 gap-2">
              {["listener", "artist"].map((r) => (
                <button
                  key={r}
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-all capitalize ${
                    form.role === r ? "bg-gold/15 border-gold/40 text-gold" : "bg-white/[0.02] border-white/10 text-cream/50 hover:border-white/20"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

          <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-gold-dark to-gold text-navy-dark font-bold py-3 rounded-xl transition-opacity disabled:opacity-60 hover:opacity-90">
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </div>

        <p className="text-center text-cream/40 text-sm mt-6">
          Have an account?{" "}
          <Link to="/login" className="text-gold font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
