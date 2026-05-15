"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";

export function Navbar() {
  return (
    <nav className="sticky top-0 w-full z-50 backdrop-blur-xl border-b border-border/50 bg-background/60">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Logo size="md" />
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
            className="bg-primary text-primary-foreground px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary/90 transition-all active:scale-95"
          >
            Analyze Idea
          </Link>
        </div>
      </div>
    </nav>
  );
}
