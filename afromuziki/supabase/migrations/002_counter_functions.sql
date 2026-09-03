-- ============================================================
-- AfroMuziki — Migration 002
-- Atomic counters for play/download counts.
--
-- The API routes (src/app/api/songs/[id]/play and .../download) call
-- these instead of doing a read-then-write from the client, which is
-- prone to lost updates when two requests land at the same time.
--
-- Run this in the Supabase SQL editor after 001_initial_schema.sql.
-- Safe to run even if you already ran an earlier version of this file —
-- CREATE OR REPLACE means re-running just updates the function bodies.
-- ============================================================

-- SECURITY DEFINER is required here: a listener playing/downloading a song
-- they don't own is neither the artist nor an admin, so the existing songs
-- UPDATE policies ("Artists can update own pending songs", "Admins can
-- moderate songs") would otherwise block this. SECURITY DEFINER runs the
-- function with the owner's privileges instead of the caller's, bypassing
-- RLS — safe here because the function body is fixed (only ever increments
-- one column by one on one row) and takes no untrusted SQL.
CREATE OR REPLACE FUNCTION public.increment_song_plays(p_song_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.songs SET plays = plays + 1 WHERE id = p_song_id;
$$;

CREATE OR REPLACE FUNCTION public.increment_song_downloads(p_song_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.songs SET downloads = downloads + 1 WHERE id = p_song_id;
$$;

REVOKE ALL ON FUNCTION public.increment_song_plays(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_song_downloads(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_song_plays(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_song_downloads(UUID) TO anon, authenticated;
