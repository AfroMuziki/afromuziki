# What's still missing for this to be truly production-ready

The code is now fixed and should build cleanly. It cannot actually run
without the following — none of it is code, it's accounts/config only
you can provide.

## 1. Required accounts & environment variables

Copy `.env.example` to `.env.local` for local dev, and add the same
variables in the Render dashboard (Settings → Environment) for
production. All of these are required — the app will not start
without them:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page — **keep secret, server-only** |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Same |
| `CLOUDINARY_API_SECRET` | Same — **keep secret** |
| `BREVO_API_KEY` | Brevo → SMTP & API → API Keys |
| `BREVO_SENDER_EMAIL` | Should be `info.afromuziki@gmail.com` — **must be verified as a sender in Brevo**, or all emails will fail to send |
| `NEXT_PUBLIC_APP_URL` | Your real production domain once you have one (e.g. `https://afromuziki.com`) — used in email links |

## 2. Database setup (one-time, in Supabase SQL editor)

1. Run `supabase/migrations/001_initial_schema.sql`
2. Run `supabase/migrations/002_counter_functions.sql` (new — see
   FIXES.md)
3. Sign up through the app once, then promote yourself to admin:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'you@example.com';
   ```
   There's no other way to reach `/admin` — this has to be done manually,
   once, per admin account you want.

## 3. Product decisions you haven't made yet

- **Fans don't have accounts in this build — by design.** Anyone can
  stream and download without signing up; only artists (and admins)
  register. That matches what's built and documented in `BACKEND.md`.
  If you actually want fan accounts (saved libraries, likes, follows,
  personalized recommendations), that's a real feature to scope and
  build, not a bug fix — let me know if you want that added.
- **Terms & Conditions / content policy is referenced but not written.**
  The upload form says "By uploading you agree to our Terms &
  Conditions" — there's no actual terms page. You need real text
  covering: what content is prohibited, what happens on a copyright
  claim, what "explicit content" labeling means, and what grounds get
  a track rejected or an account banned. I can draft this, but it
  needs your sign-off before it's legally meaningful.
- **No DMCA/takedown process.** If another rights-holder claims one of
  your artists' uploads infringes their copyright, there's currently no
  defined process (a contact address, a review window, a repeat-
  infringer policy). Recommended before public launch, not optional
  once you have real users' content on the platform.
- **Storage/file-size limits are hardcoded** (50MB audio, 5MB cover) —
  fine for MVP, but worth confirming that matches what you want artists
  to be able to upload.

## 4. Operational gaps (not required to launch, worth knowing about)

- **No pagination** on `/api/songs` or `/api/admin/songs` beyond a
  fixed limit/offset — fine at low volume, will need real pagination
  once you have more than ~100 tracks.
- **No rate limiting** on `/api/upload`, `/api/auth/login`, or
  `/api/auth/register` — someone could hammer these. Worth adding
  before this gets real traffic (Render doesn't give you this for
  free the way some other platforms do).
- **`howler` and `framer-motion` are installed but not used anywhere**
  in the current code — harmless, just unused weight in
  `node_modules`. Fine to leave, or drop them from `package.json` if
  you want a smaller install.
- **Play/download counts can still be inflated** by refreshing/
  re-requesting — there's IP hashing for the event log but no
  rate-limiting or dedup logic on the counters themselves. Only
  matters once these numbers mean something (payouts, rankings).

## 5. Payments (explicitly out of scope for this build, per BACKEND.md)

The schema has `plays`, `downloads`, and event tables ready, but there's
no payment integration. If/when you want artist payouts or premium
tracks, that's new scope: a `purchases` table, a payment provider
(Stripe / Paystack / Flutterwave are the common choices for an
Africa-facing product), and payout logic. Tell me which provider and
I'll build it — this is a separate task from today's fixes.
