// backend/src/routes/tracks.js
import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// ── GET /tracks — list all published tracks ───────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { genre, limit = 20, offset = 0, q } = req.query;

    let query = supabase
      .from("tracks")
      .select(`
        id, title, genre, media_type, media_url, cover_url, duration_seconds, play_count, created_at,
        artists ( id, stage_name, cover_url )
      `)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (genre) query = query.eq("genre", genre);
    if (q) query = query.ilike("title", `%${q}%`);

    const { data, error } = await query;
    if (error) throw error;

    return res.json({ tracks: data });
  } catch (err) {
    console.error("Get tracks error:", err);
    return res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

// ── GET /tracks/:id — single track ───────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tracks")
      .select(`
        id, title, genre, media_type, media_url, cover_url, duration_seconds, play_count, created_at,
        artists ( id, stage_name, cover_url, bio, country )
      `)
      .eq("id", req.params.id)
      .eq("is_published", true)
      .single();

    if (error || !data) return res.status(404).json({ error: "Track not found" });

    return res.json({ track: data });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch track" });
  }
});

// ── POST /tracks/:id/play — increment play count ──────────────────────────────
router.post("/:id/play", async (req, res) => {
  try {
    await supabase.rpc("increment_play_count", { track_id: req.params.id });
    return res.json({ success: true });
  } catch {
    // Non-critical — don't fail the stream
    return res.json({ success: false });
  }
});

// ── GET /tracks/artist/:artistId — tracks by artist ──────────────────────────
router.get("/artist/:artistId", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tracks")
      .select("id, title, genre, media_type, media_url, cover_url, duration_seconds, play_count, created_at")
      .eq("artist_id", req.params.artistId)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.json({ tracks: data });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch artist tracks" });
  }
});

// ── DELETE /tracks/:id — artist deletes own track ────────────────────────────
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    // Verify ownership
    const { data: track } = await supabase
      .from("tracks")
      .select("id, cloudinary_id, media_type, artists(user_id)")
      .eq("id", req.params.id)
      .single();

    if (!track) return res.status(404).json({ error: "Track not found" });
    if (track.artists.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Delete from Cloudinary
    if (track.cloudinary_id) {
      const { deleteResource } = await import("../lib/cloudinary.js");
      await deleteResource(track.cloudinary_id, track.media_type === "video" ? "video" : "video");
    }

    await supabase.from("tracks").delete().eq("id", req.params.id);
    return res.json({ message: "Track deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
