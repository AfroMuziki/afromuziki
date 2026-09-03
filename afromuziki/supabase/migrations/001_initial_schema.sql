-- ============================================================
-- AfroMuziki — Initial Schema (Supabase / Postgres)
-- Bank-grade security: RLS enabled on every table
-- ============================================================

-- Roles enum
CREATE TYPE public.user_role AS ENUM ('artist', 'admin');

-- Song status enum
CREATE TYPE public.song_status AS ENUM ('pending', 'approved', 'rejected');

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  stage_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role public.user_role NOT NULL DEFAULT 'artist',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for role lookups
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- ============================================================
-- SONGS
-- ============================================================
CREATE TABLE public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_url TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  cloudinary_public_id_audio TEXT,
  cloudinary_public_id_cover TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  genre TEXT NOT NULL DEFAULT 'Afrobeats',
  status public.song_status NOT NULL DEFAULT 'pending',
  plays BIGINT NOT NULL DEFAULT 0,
  downloads BIGINT NOT NULL DEFAULT 0,
  likes BIGINT NOT NULL DEFAULT 0,
  rejection_reason TEXT,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_songs_artist ON public.songs(artist_id);
CREATE INDEX idx_songs_status ON public.songs(status);
CREATE INDEX idx_songs_genre ON public.songs(genre);
CREATE INDEX idx_songs_created ON public.songs(created_at DESC);

-- ============================================================
-- PLAY EVENTS (for analytics / future payments)
-- ============================================================
CREATE TABLE public.play_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- nullable = anonymous listener
  ip_hash TEXT, -- hashed for privacy
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_play_events_song ON public.play_events(song_id);
CREATE INDEX idx_play_events_created ON public.play_events(created_at DESC);

-- ============================================================
-- DOWNLOAD EVENTS
-- ============================================================
CREATE TABLE public.download_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_download_events_song ON public.download_events(song_id);

-- ============================================================
-- HELPER: updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER songs_updated_at
  BEFORE UPDATE ON public.songs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, stage_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'stage_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'artist')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_events ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- SONGS policies
-- Anyone can read APPROVED songs
CREATE POLICY "Approved songs are public"
  ON public.songs FOR SELECT
  USING (status = 'approved');

-- Artists can see their own songs (any status)
CREATE POLICY "Artists can view own songs"
  ON public.songs FOR SELECT
  USING (auth.uid() = artist_id);

-- Admins can see all songs
CREATE POLICY "Admins can view all songs"
  ON public.songs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Artists can insert their own songs (always pending)
CREATE POLICY "Artists can upload songs"
  ON public.songs FOR INSERT
  WITH CHECK (
    auth.uid() = artist_id
    AND status = 'pending'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('artist', 'admin')
    )
  );

-- Artists can update own pending songs (title, etc.)
CREATE POLICY "Artists can update own pending songs"
  ON public.songs FOR UPDATE
  USING (auth.uid() = artist_id AND status = 'pending')
  WITH CHECK (auth.uid() = artist_id);

-- Admins can update any song (approve / reject / delete metadata)
CREATE POLICY "Admins can moderate songs"
  ON public.songs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete any song
CREATE POLICY "Admins can delete songs"
  ON public.songs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Artists can delete own pending songs
CREATE POLICY "Artists can delete own pending songs"
  ON public.songs FOR DELETE
  USING (auth.uid() = artist_id AND status = 'pending');

-- PLAY / DOWNLOAD events: anyone can insert (anonymous listeners), only admins/artists read own stats later
CREATE POLICY "Anyone can log play events"
  ON public.play_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can log download events"
  ON public.download_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read play events"
  ON public.play_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can read download events"
  ON public.download_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- STORAGE BUCKET note (create in Supabase dashboard or via API)
-- We use Cloudinary for production media; this is optional fallback.
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('song-covers', 'song-covers', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('song-audio', 'song-audio', false);
