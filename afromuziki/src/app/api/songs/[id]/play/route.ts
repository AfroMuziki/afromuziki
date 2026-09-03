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

    await supabase.from("play_events").insert({
      song_id: id,
      user_id: user?.id || null,
      ip_hash: ipHash,
    });

    // Atomic counter bump — see increment_song_plays in
    // supabase/migrations/001_initial_schema.sql. Using an RPC instead of a
    // read-then-write avoids a lost update when two plays land at once.
    const { error: rpcError } = await supabase.rpc("increment_song_plays", { p_song_id: id });
    if (rpcError) {
      console.error("[play] increment_song_plays failed", rpcError);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[play]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
