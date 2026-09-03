# AfroMuziki

**Production-ready African Music Streaming Platform (MVP)**

Artists upload → Admin approves → Everyone streams & downloads.  
Contact: **info.afromuziki@gmail.com**

No mock data. All pages load from Supabase + Cloudinary via secure API routes.

---

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 + TypeScript + Tailwind CSS v4 |
| Auth & DB | Supabase (Auth + Postgres + RLS) |
| Media | Cloudinary |
| Email | Brevo |
| Hosting | Render (recommended) |

---

## Features

- Glassmorphism UI (blue → purple gradient language)
- Full music player with play logging
- Artist registration, login, dashboard, upload
- Admin moderation (approve / reject / delete + emails)
- Public discover, home, song detail (approved only)
- Download tracking
- Row Level Security on every table
- Zero hardcoded secrets

---

## Setup (production)

```bash
npm install
cp .env.example .env.local
# Fill ALL keys (Supabase, Cloudinary, Brevo)

# In Supabase SQL Editor run:
# supabase/migrations/001_initial_schema.sql

# Promote first admin:
# UPDATE public.profiles SET role = 'admin' WHERE email = 'you@example.com';

npm run dev
```

Full instructions: **[BACKEND.md](./BACKEND.md)**

---

## API surface

| Method | Path | Access |
|--------|------|--------|
| POST | `/api/auth/register` | Public (artists) |
| POST | `/api/auth/login` | Public |
| POST | `/api/upload` | Artist |
| GET | `/api/songs` | Public (approved only) |
| GET | `/api/songs/mine` | Artist (own songs) |
| GET | `/api/songs/[id]` | Public if approved |
| POST | `/api/songs/[id]/play` | Public |
| POST | `/api/songs/[id]/download` | Public |
| GET/PATCH | `/api/admin/songs` | Admin |

---

## Security

- Secrets only in `.env.local` (never committed)
- Service-role key server-only
- RLS: artists insert only `pending`; public reads only `approved`
- File type + size validation on upload
- IP hashing on play/download events
- Security headers in `next.config.ts`

---

## Deploy on Render

1. Connect repo  
2. Build: `npm install && npm run build`  
3. Start: `npm run start`  
4. Add all env vars from `.env.example`  
5. Set `NEXT_PUBLIC_APP_URL` to your domain  

---

Payment gateways (Stripe / Paystack / Flutterwave) can be added later on the existing plays/downloads schema.
