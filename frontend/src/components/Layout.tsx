// src/components/Layout.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { usePlayer } from "@/hooks/usePlayer";
import PlayerBar from "@/components/player/PlayerBar";
import { authApi } from "@/lib/api";

function GlobalPlayer() {
  usePlayer();
  return <PlayerBar />;
}

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? "url(#goldGrad)" : "currentColor"}>
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e8ab3a"/>
        <stop offset="100%" stopColor="#c9922a"/>
      </linearGradient>
    </defs>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

const UploadIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? "url(#goldGrad2)" : "currentColor"}>
    <defs>
      <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e8ab3a"/>
        <stop offset="100%" stopColor="#c9922a"/>
      </linearGradient>
    </defs>
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
  </svg>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    clearAuth();
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── Header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        padding: "0 20px",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(6, 13, 26, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(201,146,42,0.1)",
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: "linear-gradient(135deg, #b8832a, #e8ab3a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(201,146,42,0.35)",
            flexShrink: 0,
          }}>
            <svg viewBox="0 0 24 24" fill="#060d1a" width="18" height="18">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 19, fontWeight: 700,
              color: "#f2e8d5", letterSpacing: "-0.01em", lineHeight: 1.1,
            }}>AfroMuziki</div>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "rgba(201,146,42,0.7)",
              lineHeight: 1,
            }}>Stream</div>
          </div>
        </Link>

        {/* Auth actions */}
        {isAuthenticated ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(201,146,42,0.2), rgba(201,146,42,0.08))",
              border: "1px solid rgba(201,146,42,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#e8ab3a",
            }}>
              {user?.displayName?.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout} style={{
              background: "none", border: "none",
              color: "rgba(242,232,213,0.4)", fontSize: 12,
              cursor: "pointer", fontFamily: "inherit",
              transition: "color 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e8ab3a")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,232,213,0.4)")}
            >Sign out</button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link to="/login" style={{
              color: "rgba(242,232,213,0.55)", fontSize: 13, fontWeight: 500,
              textDecoration: "none", transition: "color 0.15s",
            }}>Sign in</Link>
            <Link to="/register" style={{
              background: "linear-gradient(135deg, #b8832a, #d9a03a)",
              color: "#060d1a", fontSize: 13, fontWeight: 800,
              padding: "8px 16px", borderRadius: 10, textDecoration: "none",
              boxShadow: "0 2px 12px rgba(201,146,42,0.3)",
              letterSpacing: "0.01em",
            }}>Join Free</Link>
          </div>
        )}
      </header>

      {/* ── Main ── */}
      <main style={{ flex: 1, paddingBottom: 148 }}>
        {children}
      </main>

      {/* ── Bottom Nav ── */}
      <nav style={{
        position: "fixed", bottom: 72, left: 0, right: 0, zIndex: 40,
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "10px 0",
        background: "rgba(6,13,26,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(201,146,42,0.08)",
      }}>
        {[
          { to: "/", icon: HomeIcon, label: "Home" },
          { to: "/upload", icon: UploadIcon, label: "Upload" },
        ].map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, padding: "4px 24px", textDecoration: "none",
              color: active ? "#e8ab3a" : "rgba(242,232,213,0.3)",
              transition: "color 0.15s",
            }}>
              <Icon active={active} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <GlobalPlayer />
    </div>
  );
}
