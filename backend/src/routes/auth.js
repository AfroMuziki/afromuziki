// backend/src/routes/auth.js
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabase.js";
import { sendWelcomeEmail } from "../lib/brevo.js";

const router = Router();

function signAccess(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );
}

function signRefresh(userId) {
  const token = uuidv4();
  return token; // stored in DB, not JWT
}

// ── POST /auth/register ───────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { email, password, displayName, role = "listener" } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ error: "email, password and displayName are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Check existing user
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from("users")
      .insert({ email, password_hash, display_name: displayName, role })
      .select("id, email, display_name, role")
      .single();

    if (error) throw error;

    // If registering as artist, create artist profile
    if (role === "artist") {
      await supabase.from("artists").insert({
        user_id: user.id,
        stage_name: displayName,
      });
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, displayName).catch(() => {});

    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user.id);

    // Store refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await supabase.from("refresh_tokens").insert({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt,
    });

    return res.status(201).json({
      user: { id: user.id, email: user.email, displayName: user.display_name, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
});

// ── POST /auth/login ──────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const { data: user } = await supabase
      .from("users")
      .select("id, email, password_hash, display_name, role")
      .eq("email", email)
      .single();

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user.id);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await supabase.from("refresh_tokens").insert({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt,
    });

    return res.json({
      user: { id: user.id, email: user.email, displayName: user.display_name, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

// ── POST /auth/refresh ────────────────────────────────────────────────────────
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Refresh token required" });

    const { data: stored } = await supabase
      .from("refresh_tokens")
      .select("user_id, expires_at")
      .eq("token", refreshToken)
      .single();

    if (!stored || new Date(stored.expires_at) < new Date()) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    const { data: user } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("id", stored.user_id)
      .single();

    if (!user) return res.status(401).json({ error: "User not found" });

    // Rotate refresh token
    await supabase.from("refresh_tokens").delete().eq("token", refreshToken);
    const newRefresh = signRefresh(user.id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await supabase.from("refresh_tokens").insert({
      user_id: user.id,
      token: newRefresh,
      expires_at: expiresAt,
    });

    return res.json({
      accessToken: signAccess(user),
      refreshToken: newRefresh,
    });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(500).json({ error: "Token refresh failed" });
  }
});

// ── POST /auth/logout ─────────────────────────────────────────────────────────
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await supabase.from("refresh_tokens").delete().eq("token", refreshToken);
  }
  return res.json({ message: "Logged out" });
});

export default router;
