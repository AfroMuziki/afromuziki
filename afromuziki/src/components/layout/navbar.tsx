"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Compass,
  Music2,
  Upload,
  Shield,
  Search,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/artist", label: "Artist Hub", icon: Upload },
  { href: "/admin", label: "Admin", icon: Shield },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, logout } = useAuthStore();

  const handleLogout = async () => {
    // Clears the real Supabase session (cookies) — clearing only the local
    // Zustand cache would leave the session valid server-side.
    await createClient().auth.signOut();
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0b0f1a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
            <Music2 className="h-5 w-5 text-white" />
          </div>
          <span className="hidden text-lg font-bold tracking-tight text-white sm:block">
            Afro<span className="text-blue-400">Muziki</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            // Hide admin link for non-admins
            if (item.href === "/admin" && profile?.role !== "admin") return null;
            // Hide artist hub for non-artists (still show for guests so they can discover)
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-premium",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="search"
              placeholder="Search songs, artists..."
              className="h-9 w-48 rounded-full border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder:text-white/40 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 lg:w-64"
            />
          </div>

          {user && profile ? (
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 sm:flex">
                <User className="h-3.5 w-3.5 text-white/60" />
                <span className="max-w-[100px] truncate text-sm text-white/80">
                  {profile.stage_name || profile.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={handleLogout}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <LogIn className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Artist Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
