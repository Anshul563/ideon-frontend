"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-linear-to-b from-background/60 to-transparent">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Ideon
          </h1>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <Link
            href="/login"
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <div className="h-4 w-px bg-border" />
          <ThemeToggleButton />
          <Link
            href="/register"
            className="bg-foreground text-background px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 shadow-xl shadow-foreground/5"
          >
            Analyze Idea
          </Link>
        </div>
      </div>
    </nav>
  );
}
