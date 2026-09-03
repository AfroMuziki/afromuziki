import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { AudioPlayer } from "@/components/player/audio-player";
import { AuthHydrator } from "@/components/auth-hydrator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AfroMuziki — Stream & Discover African Music",
    template: "%s | AfroMuziki",
  },
  description:
    "AfroMuziki is the premium platform for African artists to upload, stream and share their music. Listen free, support creators.",
  keywords: [
    "Afrobeats",
    "African music",
    "streaming",
    "AfroMuziki",
    "music platform",
  ],
  authors: [{ name: "AfroMuziki", url: "mailto:info.afromuziki@gmail.com" }],
  openGraph: {
    title: "AfroMuziki",
    description: "Stream & Discover African Music",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#0b0f1a] antialiased`}
      >
        <div className="relative flex min-h-screen flex-col">
          {/* Ambient background glow */}
          <div
            className="pointer-events-none fixed inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(139,92,246,0.15), transparent)",
            }}
          />
          <AuthHydrator />
          <Navbar />
          <main className="flex-1 pb-32">{children}</main>
          <AudioPlayer />
        </div>
      </body>
    </html>
  );
}
