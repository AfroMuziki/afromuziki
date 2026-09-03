import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createHash } from "crypto";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);

    await supabase.from("download_events").insert({
      song_id: id,
      user_id: user?.id || null,
      ip_hash: ipHash,
    });

    const { data: song } = await supabase
      .from("songs")
      .select("audio_url, status")
      .eq("id", id)
      .single();

    if (!song || song.status !== "approved") {
      return NextResponse.json({ error: "Not available" }, { status: 404 });
    }

    // Atomic counter bump — see increment_song_downloads in
    // supabase/migrations/001_initial_schema.sql.
    const { error: rpcError } = await supabase.rpc("increment_song_downloads", { p_song_id: id });
    if (rpcError) {
      console.error("[download] increment_song_downloads failed", rpcError);
    }

    return NextResponse.json({
      ok: true,
      downloadUrl: song.audio_url,
    });
  } catch (err) {
    console.error("[download]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
