// backend/src/routes/upload.js

import express from "express";
import { uploadAudio, uploadImage } from "../config/cloudinary.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.post("/track", uploadAudio.single('audio'), async (req, res) => {
  try {
    const { title, artist, genre } = req.body;
    const audioFile = req.file;
    const userId = req.user?.id; // Get from auth middleware
    
    if (!audioFile) {
      return res.status(400).json({ error: "Audio file required" });
    }
    
    if (!title || !artist) {
      return res.status(400).json({ error: "Title and artist are required" });
    }
    
    const { data, error } = await supabase
      .from('tracks')
      .insert([
        {
          title: title.trim(),
          artist: artist.trim(),
          genre: genre || null,
          audio_url: audioFile.path,
          user_id: userId,
          plays: 0,
          likes: 0,
          is_public: true
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to save track metadata" });
    }
    
    res.status(201).json({
      success: true,
      message: "Track uploaded successfully",
      track: data
    });
    
  } catch (error) {
    console.error("Track upload error:", error);
    res.status(500).json({ error: "Failed to upload track" });
  }
});

router.post("/cover", uploadImage.single('image'), async (req, res) => {
  try {
    const { trackId } = req.body;
    const imageFile = req.file;
    
    if (!imageFile) {
      return res.status(400).json({ error: "Image file required" });
    }
    
    if (!trackId) {
      return res.status(400).json({ error: "Track ID required" });
    }
    
    const { data, error } = await supabase
      .from('tracks')
      .update({ cover_art: imageFile.path })
      .eq('id', trackId)
      .select()
      .single();
    
    if (error) {
      console.error("Supabase update error:", error);
      return res.status(500).json({ error: "Failed to update cover art" });
    }
    
    res.json({
      success: true,
      message: "Cover art uploaded successfully",
      track: data
    });
    
  } catch (error) {
    console.error("Cover upload error:", error);
    res.status(500).json({ error: "Failed to upload cover art" });
  }
});

export default router;