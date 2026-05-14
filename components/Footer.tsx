"use client";

import Link from "next/link";
import { Brain, Globe, Zap, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-background pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Architectural Text */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 select-none pointer-events-none z-0 opacity-[0.03]">
        <h2 className="text-[30vw] font-black text-foreground tracking-tighter leading-none uppercase">
          IDEON
        </h2>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-32">
          {/* Brand Column */}
          <div className="col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-none bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl font-black text-foreground tracking-tighter leading-none">
                  Ideon
                </h3>
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mt-1">Strategic Intel</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xs">
              High-fidelity AI validation for the next generation of founders. Stress-test your concepts before you build.
            </p>
          </div>

          {/* Platform Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.4em]">Platform</h4>
            <ul className="space-y-4">
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/dashboard/research-page">Market Research</FooterLink>
              <FooterLink href="/dashboard/history">History Archive</FooterLink>
              <FooterLink href="/dashboard/analytics">Analytics</FooterLink>
            </ul>
          </div>

          {/* Protocols Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.4em]">Protocols</h4>
            <ul className="space-y-4">
              <FooterLink href="/register">Idea Lab</FooterLink>
              <FooterLink href="/register">Stress Test</FooterLink>
              <FooterLink href="/register">Roast Mode</FooterLink>
              <FooterLink href="/pricing">Pro Access</FooterLink>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.4em]">Company</h4>
            <ul className="space-y-4">
              <FooterLink href="#">About</FooterLink>
              <FooterLink href="#">Methodology</FooterLink>
              <FooterLink href="#">Changelog</FooterLink>
              <FooterLink href="#">Support</FooterLink>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.4em]">Legal</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Use</FooterLink>
              <FooterLink href="#">Cookie Policy</FooterLink>
              <FooterLink href="#">Security</FooterLink>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">All Systems Nominal</span>
             </div>
             <span className="h-3 w-px bg-border" />
             <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-muted-foreground/40" />
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Global Edge Network</span>
             </div>
          </div>

          <div className="flex items-center gap-8 text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">
            <span>&copy; 2026 Ideon Strategic / Secure Terminal</span>
            <span className="hidden md:block">v1.2.0-Production</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group uppercase tracking-tight"
      >
        {children}
        <ArrowUpRight className="w-2.5 h-2.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
      </Link>
    </li>
  );
}
