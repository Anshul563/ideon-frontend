"use client";

import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-background py-32 px-6 overflow-hidden">
      {/* Background Big Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 select-none pointer-events-none z-0">
        <h2 className="text-[20vw] md:text-[25vw] font-black text-muted-foreground/5 tracking-tighter leading-none uppercase">
          Ideon
        </h2>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-black text-foreground tracking-tighter">
            Ideon
          </h3>
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          <a
            href="#"
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Twitter
          </a>
          <a
            href="#"
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Discord
          </a>
        </div>

        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
          &copy; 2026 Ideon Strategic. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
