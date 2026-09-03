"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Library,
  Album,
  Mic2,
  Radio,
  Heart,
  Settings,
  Star,
  Upload,
  ListMusic,
  LayoutDashboard,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const discoverLinks = [
  { href: "/discover", label: "Popular", icon: Star },
  { href: "/discover?tab=new", label: "New Releases", icon: Album },
  { href: "/discover?tab=genres", label: "Genres", icon: Library },
];

const artistLinks = [
  { href: "/artist", label: "Dashboard", icon: LayoutDashboard },
  { href: "/artist/upload", label: "Upload Song", icon: Upload },
  { href: "/artist/songs", label: "My Songs", icon: ListMusic },
];

const adminLinks = [
  { href: "/admin", label: "Pending", icon: Clock },
  { href: "/admin?status=approved", label: "Approved", icon: CheckCircle },
  { href: "/admin?status=rejected", label: "Rejected", icon: XCircle },
];

interface SidebarProps {
  mode?: "discover" | "artist" | "admin";
}

export function Sidebar({ mode = "discover" }: SidebarProps) {
  const pathname = usePathname();
  const links =
    mode === "artist"
      ? artistLinks
      : mode === "admin"
      ? adminLinks
      : discoverLinks;

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="sticky top-24 space-y-6">
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            {mode === "artist"
              ? "Artist Hub"
              : mode === "admin"
              ? "Moderation"
              : "Browse"}
          </p>
          <nav className="space-y-0.5">
            {links.map((item) => {
              const active = pathname === item.href.split("?")[0];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-premium",
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
        </div>

        {mode === "discover" && (
          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
              Library
            </p>
            <nav className="space-y-0.5">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-premium hover:bg-white/5 hover:text-white"
              >
                <Heart className="h-4 w-4" />
                Favorites
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-premium hover:bg-white/5 hover:text-white"
              >
                <Radio className="h-4 w-4" />
                Radio
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-premium hover:bg-white/5 hover:text-white"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}
