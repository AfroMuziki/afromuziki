import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_AUDIO_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_COVER_BYTES = 5 * 1024 * 1024;  // 5 MB
const ALLOWED_AUDIO = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/flac", "audio/aac", "audio/ogg"];
const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify artist/admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role, stage_name")
      .eq("id", user.id)
      .single();

    if (!profile || !["artist", "admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Only artists can upload" }, { status: 403 });
    }

    const formData = await request.formData();
    const title = String(formData.get("title") || "").trim();
    const genre = String(formData.get("genre") || "Afrobeats").trim();
    const audioFile = formData.get("audio") as File | null;
    const coverFile = formData.get("cover") as File | null;

    if (!title || title.length < 1) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!audioFile || !coverFile) {
      return NextResponse.json({ error: "Audio and cover are required" }, { status: 400 });
    }

    if (!ALLOWED_AUDIO.includes(audioFile.type) && !audioFile.name.match(/\.(mp3|wav|flac|aac|ogg)$/i)) {
      return NextResponse.json({ error: "Invalid audio format" }, { status: 400 });
    }
    if (!ALLOWED_IMAGE.includes(coverFile.type)) {
      return NextResponse.json({ error: "Cover must be JPG, PNG or WebP" }, { status: 400 });
    }
    if (audioFile.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: "Audio file too large (max 50 MB)" }, { status: 400 });
    }
    if (coverFile.size > MAX_COVER_BYTES) {
      return NextResponse.json({ error: "Cover file too large (max 5 MB)" }, { status: 400 });
    }

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const coverBuffer = Buffer.from(await coverFile.arrayBuffer());

    // Upload to Cloudinary in parallel
    const [audioResult, coverResult] = await Promise.all([
      uploadToCloudinary(audioBuffer, {
        folder: `afromuziki/audio/${user.id}`,
        resource_type: "video", // Cloudinary uses "video" for audio files
      }),
      uploadToCloudinary(coverBuffer, {
        folder: `afromuziki/covers/${user.id}`,
        resource_type: "image",
      }),
    ]);

    const duration = Math.round(audioResult.duration || 0);

    // Insert pending song
    const { data: song, error } = await supabase
      .from("songs")
      .insert({
        title,
        artist_id: user.id,
        cover_url: coverResult.secure_url,
        audio_url: audioResult.secure_url,
        cloudinary_public_id_audio: audioResult.public_id,
        cloudinary_public_id_cover: coverResult.public_id,
        duration_seconds: duration,
        genre,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("[upload] db error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      song,
      message: "Song submitted for review. You will be notified once moderated.",
    });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
