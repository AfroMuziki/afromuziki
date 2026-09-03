"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Music2, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [stageName, setStageName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          stageName,
          fullName: stageName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : data.error?.email?.[0] ||
              data.error?.password?.[0] ||
              data.error?.stageName?.[0] ||
              "Registration failed";
        setError(msg);
        return;
      }

      setSuccess(
        data.message ||
          "Account created! Check your email if confirmation is required, then sign in."
      );
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card variant="glass" className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
            <Music2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Artist Registration</h1>
          <p className="mt-1 text-sm text-white/60">
            Create an account to upload and manage your music
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">
              Artist / Stage Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                required
                minLength={2}
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="Your artist name"
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
            </div>
          </div>

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
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/50">
            By registering you agree to the Terms & Conditions. Only original
            content you own or have rights to may be uploaded.
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create Artist Account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
