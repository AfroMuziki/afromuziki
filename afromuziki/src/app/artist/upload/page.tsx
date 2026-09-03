"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload, Music, Image as ImageIcon, CheckCircle2, Loader2 } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GENRES as genres } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    genre: "Afrobeats",
    audioFile: null as File | null,
    coverFile: null as File | null,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please log in as an artist first.");
      router.push("/login");
      return;
    }

    if (!form.audioFile || !form.coverFile) {
      setError("Both audio and cover are required.");
      return;
    }

    setSubmitting(true);

    try {
      const body = new FormData();
      body.append("title", form.title);
      body.append("genre", form.genre);
      body.append("audio", form.audioFile);
      body.append("cover", form.coverFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="flex gap-8">
          <Sidebar mode="artist" />
          <div className="flex min-h-[50vh] flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Submitted for Review</h1>
            <p className="mt-2 max-w-md text-white/60">
              Your song has been uploaded and is pending admin approval. You will
              receive an email once it is reviewed.
            </p>
            <div className="mt-6 flex gap-3">
              <Button onClick={() => setSubmitted(false)}>Upload Another</Button>
              <Button variant="secondary" onClick={() => router.push("/artist")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="flex gap-8">
        <Sidebar mode="artist" />
        <div className="min-w-0 flex-1 max-w-2xl">
          <h1 className="text-3xl font-bold text-white">Upload Song</h1>
          <p className="mt-1 text-white/60">
            All uploads require admin approval before going public.
          </p>

          {!user && (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              You need to{" "}
              <button
                type="button"
                className="underline font-medium"
                onClick={() => router.push("/login")}
              >
                log in as an artist
              </button>{" "}
              before uploading.
            </div>
          )}

          <Card variant="glass" className="mt-8 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Song Title *
                </label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g. Sunrise"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Genre *
                </label>
                <select
                  value={form.genre}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, genre: e.target.value }))
                  }
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                >
                  {genres.map((g) => (
                    <option key={g} value={g} className="bg-[#0b0f1a]">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Audio File * (MP3, WAV, max 50MB)
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-white/5 px-6 py-10 transition-premium hover:border-blue-500/40 hover:bg-white/8">
                  <Music className="mb-3 h-8 w-8 text-white/40" />
                  <span className="text-sm text-white/60">
                    {form.audioFile
                      ? form.audioFile.name
                      : "Click or drag audio file"}
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    required
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        audioFile: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Cover Art * (JPG/PNG, square recommended)
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-white/5 px-6 py-10 transition-premium hover:border-blue-500/40 hover:bg-white/8">
                  <ImageIcon className="mb-3 h-8 w-8 text-white/40" />
                  <span className="text-sm text-white/60">
                    {form.coverFile
                      ? form.coverFile.name
                      : "Click or drag cover image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    required
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        coverFile: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </label>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200/90">
                By uploading you agree to our Terms & Conditions. Content that
                violates copyright, contains hate speech, or is explicit without
                proper labeling will be rejected.
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={submitting || !user}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Submit for Review
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
