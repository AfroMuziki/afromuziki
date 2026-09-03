import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { sendSongApprovedEmail, sendSongRejectedEmail } from "@/lib/email/brevo";
import { deleteFromCloudinary } from "@/lib/cloudinary";

async function requireAdmin() {
  // Cookie-bound client: used only to establish who is calling and
  // whether their profile is an admin.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  // Service-role client: used for the actual moderation reads/writes below,
  // so admin actions don't depend on the "is this user an admin" RLS
  // subquery succeeding on every single query — we've already verified
  // that once, here.
  return { user, profile, db: createServiceClient() };
}

// List songs (optionally filtered by status)
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth && auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = auth.db!
    .from("songs")
    .select("*, profiles!songs_artist_id_fkey(stage_name, email)")
    .order("created_at", { ascending: false });

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ songs: data });
}

const actionSchema = z.object({
  songId: z.string().uuid(),
  action: z.enum(["approve", "reject", "delete"]),
  reason: z.string().max(500).optional(),
});

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth && auth.error) return auth.error;

  const body = await request.json();
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { songId, action, reason } = parsed.data;
  const supabase = auth.db!;

  // Fetch song + artist
  const { data: song, error: fetchErr } = await supabase
    .from("songs")
    .select("*, profiles!songs_artist_id_fkey(email, stage_name)")
    .eq("id", songId)
    .single();

  if (fetchErr || !song) {
    return NextResponse.json({ error: "Song not found" }, { status: 404 });
  }

  const artist = song.profiles as { email: string; stage_name: string } | null;

  if (action === "delete") {
    // Delete media from Cloudinary then row
    try {
      if (song.cloudinary_public_id_audio) {
        await deleteFromCloudinary(song.cloudinary_public_id_audio, "video");
      }
      if (song.cloudinary_public_id_cover) {
        await deleteFromCloudinary(song.cloudinary_public_id_cover, "image");
      }
    } catch (e) {
      console.warn("[admin] cloudinary delete warning", e);
    }

    const { error } = await supabase.from("songs").delete().eq("id", songId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: "Song deleted" });
  }

  if (action === "approve") {
    const { error } = await supabase
      .from("songs")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: auth.user!.id,
        rejection_reason: null,
      })
      .eq("id", songId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (artist?.email) {
      sendSongApprovedEmail(artist.email, artist.stage_name || "Artist", song.title).catch(console.error);
    }
    return NextResponse.json({ message: "Song approved" });
  }

  if (action === "reject") {
    const { error } = await supabase
      .from("songs")
      .update({
        status: "rejected",
        rejection_reason: reason || "Does not meet content guidelines",
        approved_at: null,
        approved_by: null,
      })
      .eq("id", songId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (artist?.email) {
      sendSongRejectedEmail(
        artist.email,
        artist.stage_name || "Artist",
        song.title,
        reason
      ).catch(console.error);
    }
    return NextResponse.json({ message: "Song rejected" });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
