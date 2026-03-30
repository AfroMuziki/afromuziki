// backend/src/routes/upload.js
import { Router } from "express";
import multer from "multer";
import { uploadStream } from "../lib/cloudinary.js";
import { supabase } from "../lib/supabase.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Memory storage — no temp files written to disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
  fileFilter: (_, file, cb) => {
    const allowed = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/aac", "video/mp4", "video/webm", "video/quicktime"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Unsupported file type"));
  },
});

// ── POST /upload/track ────────────────────────────────────────────────────────
// Body: multipart/form-data
// Fields: file (required), cover (optional), title, genre
router.post(
  "/track",
  requireAuth,
  requireRole("artist", "admin"),
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const mediaFile = req.files?.file?.[0];
      const coverFile = req.files?.cover?.[0];

      if (!mediaFile) {
        return res.status(400).json({ error: "Media file is required" });
      }

      const { title, genre } = req.body;
      if (!title) return res.status(400).json({ error: "Track title is required" });

      const isVideo = mediaFile.mimetype.startsWith("video/");
      const mediaType = isVideo ? "video" : "audio";

      // Upload media to Cloudinary
      const mediaResult = await uploadStream(mediaFile.buffer, {
        resource_type: "video", // Cloudinary uses "video" for both audio and video
        folder: `afromuziki/${mediaType}s`,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      });

      // Upload cover art if provided
      let coverUrl = null;
      if (coverFile) {
        const coverResult = await uploadStream(coverFile.buffer, {
          resource_type: "image",
          folder: "afromuziki/covers",
          transformation: [{ width: 500, height: 500, crop: "fill", gravity: "auto" }],
        });
        coverUrl = coverResult.secure_url;
      }

      // Find artist profile for this user
      const { data: artist } = await supabase
        .from("artists")
        .select("id")
        .eq("user_id", req.user.id)
        .single();

      if (!artist) {
        return res.status(400).json({ error: "Artist profile not found. Register as an artist first." });
      }

      // Save track to database
      const { data: track, error } = await supabase
        .from("tracks")
        .insert({
          artist_id: artist.id,
          title,
          genre: genre || null,
          media_type: mediaType,
          media_url: mediaResult.secure_url,
          cloudinary_id: mediaResult.public_id,
          cover_url: coverUrl,
          duration_seconds: Math.round(mediaResult.duration || 0),
        })
        .select("id, title, media_url, cover_url, media_type, duration_seconds")
        .single();

      if (error) throw error;

      return res.status(201).json({ track });
    } catch (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: err.message || "Upload failed" });
    }
  }
);

export default router;
