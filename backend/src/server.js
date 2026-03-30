// backend/src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import tracksRoutes from "./routes/tracks.js";
import uploadRoutes from "./routes/upload.js";

const app = express();
const PORT = process.env.PORT || 4000;

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "https://afromuziki.onrender.com",
  ],
  credentials: true,
}));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Root route ────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "AfroMuziki API is running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/auth",
      tracks: "/tracks",
      upload: "/upload"
    },
    status: "online",
    timestamp: new Date().toISOString()
  });
});

// ── Global rate limit ─────────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { error: "Too many requests, please try again later" },
}));

// ── Auth rate limit (stricter) ────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts, please try again later" },
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok", service: "afromuziki-api" }));

app.use("/auth", authLimiter, authRoutes);
app.use("/tracks", tracksRoutes);
app.use("/upload", uploadRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: "Route not found" }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`AfroMuziki API running on port ${PORT}`);
});
