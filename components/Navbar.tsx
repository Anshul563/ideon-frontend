"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-border/50 bg-background/60">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-none bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter text-foreground leading-none">
              Ideon
            </h1>
            <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Intelligence</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <a
            href="#features"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            Methodology
          </a>
          <Link
            href="/login"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            Login
          </Link>
          <div className="h-4 w-px bg-border" />
          <ThemeToggleButton />
          <Link
            href="/register"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary/90 transition-all active:scale-95 shadow-xl shadow-primary/10"
          >
            Analyze Idea
          </Link>
        </div>
      </div>
    </nav>
  );
}
