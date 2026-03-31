// backend/src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createClient } from '@supabase/supabase-js';

import authRoutes from "./routes/auth.js";
import tracksRoutes from "./routes/tracks.js";
import uploadRoutes from "./routes/upload.js";

// Initialize express app
const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

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
      upload: "/upload",
    },
    status: "online",
    timestamp: new Date().toISOString()
  });
});

// ── Global rate limit ─────────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests, please try again later" },
}));

// ── Auth rate limit ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts, please try again later" },
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok", service: "afromuziki-api" }));

// Database test endpoint
app.get("/test-db", async (req, res) => {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      environment: {
        SUPABASE_URL: process.env.SUPABASE_URL ? "✅ Set" : "❌ Missing",
        SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? "✅ Set" : "❌ Missing",
      }
    };
    
    // Test Supabase connection
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) {
        results.supabase_connection = `❌ Failed: ${error.message}`;
      } else {
        results.supabase_connection = "✅ Connected successfully";
      }
    } catch (error) {
      results.supabase_connection = `❌ Error: ${error.message}`;
    }
    
    // List tables
    try {
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (tablesError) {
        results.tables = `❌ ${tablesError.message}`;
      } else {
        results.tables = tables?.map(t => t.table_name) || [];
      }
    } catch (error) {
      results.tables = `❌ ${error.message}`;
    }
    
    res.json(results);
  } catch (error) {
    console.error("Test endpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use("/auth", authLimiter, authRoutes);
app.use("/tracks", tracksRoutes);
app.use("/upload", uploadRoutes);

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Test database connection on startup
async function testDbConnection() {
  console.log("🔍 Testing Supabase connection...");
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error("❌ Supabase connection failed:", error.message);
    } else {
      console.log("✅ Supabase connected successfully");
    }
  } catch (error) {
    console.error("❌ Supabase connection error:", error.message);
  }
}

testDbConnection();

app.listen(PORT, () => {
  console.log(`AfroMuziki API running on port ${PORT}`);
});



// Add to server.js temporarily
app.get("/debug/auth-status", async (req, res) => {
  try {
    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('email, id, email_confirmed_at, created_at')
      .limit(5);
    
    // Get users from public.users
    const { data: publicUsers, error: publicError } = await supabase
      .from('users')
      .select('email, id, full_name, created_at')
      .limit(5);
    
    res.json({
      auth_users: authUsers,
      public_users: publicUsers,
      auth_count: authUsers?.length || 0,
      public_count: publicUsers?.length || 0,
      supabase_url: process.env.SUPABASE_URL ? "Set" : "Missing"
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});