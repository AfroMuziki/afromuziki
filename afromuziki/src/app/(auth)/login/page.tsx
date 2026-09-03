"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Music2, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, setLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setAuth(
        data.user ? { id: data.user.id, email: data.user.email } : null,
        data.profile || null
      );

      // Redirect based on role
      if (data.profile?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/artist");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card variant="glass" className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
            <Music2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Artist Login</h1>
          <p className="mt-1 text-sm text-white/60">
            Only artists can create accounts and upload music
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          New artist?{" "}
          <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300">
            Create account
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-white/40">
          Contact: info.afromuziki@gmail.com
        </p>
      </Card>
    </div>
  );
}
