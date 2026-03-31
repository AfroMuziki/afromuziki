// backend/src/routes/auth.js
import express from "express";
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// REGISTER - Creates user in auth.users and auto-creates profile
router.post("/register", async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    
    console.log("Registering user:", email);
    
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name,
        },
      },
    });
    
    if (authError) {
      console.error("Auth signup error:", authError);
      return res.status(400).json({ error: authError.message });
    }
    
    console.log("Auth user created:", authData.user.id);
    
    // The public.users profile should be auto-created by a Supabase trigger
    // If not, create it manually:
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: authData.user.id,
          email: email,
          full_name: full_name,
          created_at: new Date(),
        });
      
      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Don't fail the registration if profile creation fails
      }
    }
    
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: full_name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN - Uses Supabase Auth
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("Login attempt:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error);
      return res.status(401).json({ 
        error: "Invalid credentials",
        details: error.message 
      });
    }
    
    console.log("Login successful:", data.user.id);
    
    // Get user profile from public.users
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    res.json({
      message: "Login successful",
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: profile?.full_name || data.user.user_metadata?.full_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;