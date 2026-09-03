import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: song, error } = await supabase
      .from("songs")
      .select(
        `
        id, title, cover_url, audio_url, duration_seconds, genre,
        status, plays, downloads, likes, created_at, approved_at, rejection_reason,
        artist_id,
        profiles!songs_artist_id_fkey ( stage_name, avatar_url )
      `
      )
      .eq("id", id)
      .single();

    if (error || !song) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Public can only see approved; owner or admin can see any
    if (song.status !== "approved") {
      if (!user || user.id !== song.artist_id) {
        // check admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user?.id || "")
          .maybeSingle();
        if (profile?.role !== "admin") {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
      }
    }

    const mapped = {
      ...song,
      artistName: (song as any).profiles?.stage_name || "Unknown",
      artistAvatar: (song as any).profiles?.avatar_url,
      duration: song.duration_seconds,
      coverUrl: song.cover_url,
      audioUrl: song.audio_url,
    };

    return NextResponse.json({ song: mapped });
  } catch (err) {
    console.error("[songs/id]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
