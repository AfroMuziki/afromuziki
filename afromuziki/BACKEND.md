# AfroMuziki — Backend & Database Setup Guide

## Architecture Overview

```
Browser  →  Next.js (Render / Vercel)
                │
                ├─ Supabase Auth + Postgres (RLS)
                ├─ Cloudinary (audio + covers)
                └─ Brevo (transactional email)
```

Only **artists** and **admins** have accounts.  
Listeners stream & download without signing up.

---

## 1. Create Supabase Project

1. Go to https://supabase.com → New Project
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret)

3. Open **SQL Editor** and run the entire file:
   `supabase/migrations/001_initial_schema.sql`

4. (Optional) Create an admin user:
   - Sign up normally via the app (or Auth → Users)
   - Then in SQL:
     ```sql
     UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
     ```

---

## 2. Cloudinary

1. https://cloudinary.com → Dashboard
2. Copy Cloud Name, API Key, API Secret into `.env.local`
3. No extra setup needed — folders are created automatically on first upload.

---

## 3. Brevo

1. https://www.brevo.com → SMTP & API → API Keys
2. Create a key and put it in `BREVO_API_KEY`
3. Verify the sender address (`info.afromuziki@gmail.com`)

---

## 4. Local Development

```bash
cp .env.example .env.local
# fill all values

npm install
npm run dev
```

---

## 5. API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Artist registration |
| POST | `/api/auth/login` | Public | Artist / admin login |
| POST | `/api/upload` | Artist | Upload audio + cover → pending song |
| GET  | `/api/songs` | Public | List approved songs |
| POST | `/api/songs/[id]/play` | Public | Log a play + increment counter |
| POST | `/api/songs/[id]/download` | Public | Log download + return URL |
| GET  | `/api/admin/songs` | Admin | List songs (filter by status) |
| PATCH| `/api/admin/songs` | Admin | approve / reject / delete |

---

## 6. Security Checklist (already implemented)

- [x] No secrets in client bundle
- [x] RLS on every table
- [x] Artists can only insert `status = 'pending'`
- [x] Only admins can change status or delete arbitrary songs
- [x] File type + size validation on upload
- [x] IP hashing for play/download events (privacy)
- [x] Security headers in `next.config.ts`
- [x] Service role key never exposed to browser

---

## 7. Deploy on Render

1. Connect the GitHub repo
2. Build command: `npm install && npm run build`
3. Start command: `npm run start`
4. Add all environment variables in the Render dashboard
5. Set `NEXT_PUBLIC_APP_URL` to your production domain

---

## 8. Making the first Admin

After the first artist signs up:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'you@example.com';
```

Then log in and open `/admin`.

---

## Payment readiness

The schema already has `plays`, `downloads`, and event tables.  
Later you can add:

- `songs.is_premium`
- `purchases` table
- Stripe / Paystack checkout session

without redesigning the core model.
