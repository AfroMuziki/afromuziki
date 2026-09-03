import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Public endpoint — returns only approved songs.
 * Anonymous users can call this.
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");
    const limit = Math.min(Number(searchParams.get("limit") || 50), 100);
    const offset = Number(searchParams.get("offset") || 0);

    let query = supabase
      .from("songs")
      .select(
        `
        id, title, cover_url, audio_url, duration_seconds, genre,
        plays, downloads, likes, created_at, approved_at,
        profiles!songs_artist_id_fkey ( stage_name, avatar_url )
      `
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (genre) {
      query = query.eq("genre", genre);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Flatten artist name for frontend convenience
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
    console.error("[songs GET]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
