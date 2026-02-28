import "./globals.css";
import type { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Klinic - Modern Medical Clinic",
  description:
    "Premium digital-first clinic with real-world workflows."
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-slate-50 antialiased">
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.10),transparent_55%)] mix-blend-screen opacity-70" />
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}

