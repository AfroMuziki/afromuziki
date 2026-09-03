import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns the authenticated artist's own songs (any status).
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("songs")
      .select(
        `
        id, title, cover_url, audio_url, duration_seconds, genre,
        status, plays, downloads, likes, created_at, approved_at, rejection_reason,
        artist_id,
        profiles!songs_artist_id_fkey ( stage_name, avatar_url )
      `
      )
      .eq("artist_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const songs = (data || []).map((s: any) => ({
      ...s,
      artistName: s.profiles?.stage_name || "Unknown",
      artistAvatar: s.profiles?.avatar_url,
      duration: s.duration_seconds,
      coverUrl: s.cover_url,
      audioUrl: s.audio_url,
    }));

    return NextResponse.json({ songs });
  } catch (err) {
    console.error("[songs/mine]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
