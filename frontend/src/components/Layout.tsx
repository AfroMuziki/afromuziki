// src/components/Layout.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { usePlayer } from "@/hooks/usePlayer";
import PlayerBar from "@/components/player/PlayerBar";
import { authApi } from "@/lib/api";

// Initialise player hook at root so audio element lives globally
function GlobalPlayer() {
  usePlayer(); // side-effect only
  return <PlayerBar />;
}

const HomeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const UploadIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>;
const UserIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    clearAuth();
    navigate("/login");
  };

  const navItems = [
    { to: "/", icon: <HomeIcon />, label: "Home" },
    { to: "/upload", icon: <UploadIcon />, label: "Upload" },
  ];

  return (
    <div className="min-h-screen bg-navy-dark flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-navy-dark/95 backdrop-blur-sm border-b border-white/[0.05] px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
            <span className="text-navy-dark font-bold text-sm font-display">A</span>
          </div>
          <span className="text-cream font-bold text-lg tracking-tight">AfroMuziki</span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-cream/50 text-xs hidden sm:block">{user?.displayName}</span>
            <button onClick={handleLogout} className="text-cream/40 text-xs hover:text-gold transition-colors">Sign out</button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-cream/60 text-sm hover:text-cream transition-colors">Sign in</Link>
            <Link to="/register" className="bg-gold text-navy-dark text-sm font-bold px-3 py-1.5 rounded-lg hover:bg-gold-light transition-colors">Join</Link>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-[72px] left-0 right-0 z-40 flex justify-around items-center py-2 bg-navy-dark/95 backdrop-blur-sm border-t border-white/[0.05]">
        {navItems.map(({ to, icon, label }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors ${active ? "text-gold" : "text-cream/35 hover:text-cream/60"}`}>
              {icon}
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
        {isAuthenticated && (
          <div className="flex flex-col items-center gap-0.5 px-4 py-1 text-cream/35">
            <UserIcon />
            <span className="text-[10px] font-semibold">{user?.role}</span>
          </div>
        )}
      </nav>

      {/* Global Player */}
      <GlobalPlayer />
    </div>
  );
}
