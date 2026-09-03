"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";

/**
 * The Supabase session lives in cookies (managed by middleware.ts) and is
 * the actual source of truth for auth — that's what every API route checks.
 * The Zustand store in auth-store.ts is just a client-side cache of that
 * session so the UI (navbar, dashboards) can render without an extra
 * round-trip. Without this component, that cache is only ever written by
 * the login/register forms, so a page refresh, a new tab, or a session
 * that expires server-side would leave the UI showing stale auth state.
 * This component keeps the two in sync.
 */
export function AuthHydrator() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function syncFromSession() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) {
          setAuth(null, null);
          setLoading(false);
        }
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, email, full_name, stage_name, avatar_url, bio, role, is_verified, created_at")
        .eq("id", user.id)
        .single();

      if (!cancelled) {
        setAuth({ id: user.id, email: user.email || "" }, profile || null);
        setLoading(false);
      }
    }

    syncFromSession();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      syncFromSession();
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
