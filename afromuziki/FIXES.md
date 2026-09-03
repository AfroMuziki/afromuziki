# Debugging pass — what was wrong and what changed

You said the Render build was failing with "very many bugs." Here's the
full account.

## The build-breaking bug (this is almost certainly what Render hit)

**7 files referenced the `React` namespace as a type
(`React.FormEvent`, `React.MouseEvent`, `React.ChangeEvent`,
`React.HTMLAttributes`, `React.ReactNode`) without importing `React`.**
Next.js's automatic JSX runtime means you don't need `import React from
"react"` to write JSX anymore — but you still need an import to reference
`React.SomeType`. Every one of these failed TypeScript's compile step
with "Cannot find namespace 'React'", and `next build` fails the entire
build on any type error. Fixed by importing the specific type
(`FormEvent`, `MouseEvent`, etc.) in each file instead of relying on a
global `React` namespace:

- `src/components/ui/card.tsx`
- `src/components/music/song-card.tsx`
- `src/components/player/audio-player.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/artist/upload/page.tsx`
- `src/app/layout.tsx`

## Other real bugs fixed

- **Play/download counters had dead code and a race condition.**
  `src/app/api/songs/[id]/play/route.ts` called a Supabase RPC
  (`increment_song_plays`) that was never defined anywhere in the SQL,
  then had a no-op line (`plays: supabase.rpc ? undefined : undefined`)
  left in as a placeholder, then fell back to a manual
  read-then-write that loses updates under concurrent plays. Same
  issue in the download route. Fixed: both routes now call a real,
  atomic RPC — see `supabase/migrations/002_counter_functions.sql`
  (**you need to run this migration** — see below).

- **Logging out didn't actually log you out.** The navbar's logout
  button only cleared the local Zustand cache, never called
  `supabase.auth.signOut()`. The real session cookie stayed valid, so
  a "logged out" user could still hit authenticated API routes.
  Fixed in `src/components/layout/navbar.tsx`.

- **Auth state never synced with the real session.** There was no
  code anywhere that re-hydrated the client-side auth store from the
  actual Supabase session — it was only ever written by the login/
  register forms. A page refresh or a new tab would show "logged out"
  even with a valid session cookie. Added
  `src/components/auth-hydrator.tsx`, mounted in the root layout, which
  syncs the store on load and on every auth state change.

- **`createServiceClient()` used `require()`** inside an ESM/TypeScript
  file instead of a static import — fragile and unnecessary. Fixed in
  `src/lib/supabase/server.ts`, and the admin moderation route
  (`src/app/api/admin/songs/route.ts`) now actually uses that
  service-role client for its reads/writes (it was imported but
  never used before), instead of depending on the RLS "is this user
  an admin" subquery to succeed on every single admin query.

- **Dead link:** the sidebar's "My Songs" link pointed to
  `/artist/songs`, which didn't exist. Built the missing page at
  `src/app/artist/songs/page.tsx`.

- **No pinned Node version.** Next 15 / React 19 / Tailwind 4 need a
  reasonably current Node. Without an `engines` field or
  `.node-version`, Render picks its own default, which can silently
  be the wrong major version. Added both, pinned to Node 20+.

- **`package.json`'s `lint` script was just `"eslint"`** with no
  target — fixed to `"next lint"`.

- Removed an empty leftover `src/middleware/` directory (unrelated to
  `src/middleware.ts`, which is correct and untouched).

## What you need to do before redeploying

1. **Run the new migration.** In the Supabase SQL editor, run
   `supabase/migrations/002_counter_functions.sql` (in addition to
   `001_initial_schema.sql`, if you haven't already run that one too).
2. Push this code and redeploy on Render. Build command
   `npm install && npm run build`, start command `npm run start` (per
   your existing `BACKEND.md`) are still correct.
3. See `MISSING_INFO.md` for the environment variables and accounts
   you still need to provide — the code can't run without them.
