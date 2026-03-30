# AfroMuziki — MVP Streaming Platform

African music & video streaming platform built with React, Node.js, Supabase, Cloudinary, and Brevo.

---

## Project Structure

```
afromuziki/
├── frontend/          # React + Vite + TypeScript + Tailwind
├── backend/           # Node.js + Express
├── database/
│   └── schema.sql     # Run this in Supabase SQL Editor first
└── README.md
```

---

## 1. Database — Supabase

1. Go to [supabase.com](https://supabase.com) → New Project → name it `afromuziki`
2. Open **SQL Editor** and run `database/schema.sql`
3. Go to **Project Settings → API** and copy:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY` (service_role key — keep secret)

Also add this SQL function for play counts:
```sql
CREATE OR REPLACE FUNCTION increment_play_count(track_id UUID)
RETURNS void AS $$
  UPDATE tracks SET play_count = play_count + 1 WHERE id = track_id;
$$ LANGUAGE sql;
```

---

## 2. Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) → Dashboard
2. Copy your **Cloud Name**, **API Key**, **API Secret**

---

## 3. Brevo

1. Go to [brevo.com](https://brevo.com) → Settings → SMTP & API
2. Copy your **SMTP credentials** (user + password)
3. SMTP host: `smtp-relay.brevo.com` | Port: `587`

---

## 4. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in all values in .env
npm install
npm run dev       # development
npm start         # production
```

Backend runs on `http://localhost:4000`

---

## 5. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:4000
npm install
npm run dev       # development
npm run build     # production build → dist/
```

Frontend runs on `http://localhost:5173`

---

## 6. Deploy to Render.com

### Backend (Web Service)
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `node src/server.js`
- Add all env vars from `backend/.env.example`

### Frontend (Static Site)
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variable:** `VITE_API_URL=https://your-backend.onrender.com`

---

## 7. GitHub

```bash
git init
git add .
git commit -m "AfroMuziki MVP"
git remote add origin https://github.com/YOUR_USERNAME/afromuziki.git
git push -u origin main
```

Connect your GitHub repo to Render for auto-deploy on every push.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Register user |
| POST | `/auth/login` | — | Login |
| POST | `/auth/refresh` | — | Refresh token |
| POST | `/auth/logout` | — | Logout |
| GET | `/tracks` | — | List tracks |
| GET | `/tracks/:id` | — | Single track |
| POST | `/tracks/:id/play` | — | Increment play count |
| GET | `/tracks/artist/:id` | — | Artist tracks |
| DELETE | `/tracks/:id` | Artist/Admin | Delete track |
| POST | `/upload/track` | Artist/Admin | Upload media |

---

## Contact

📧 info.afromuziki@gmail.com  
📱 WhatsApp: 0775109046
