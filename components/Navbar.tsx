"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { ContactSupportDialog } from "./ContactSupportDialog";
import { useUserPlan } from "@/hooks/useUserPlan";
import { Button } from "./ui/button";

export function Navbar() {
  const { user } = useUserPlan();

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
          
          <div className="flex items-center gap-2">
            <ContactSupportDialog 
              user={user}
              trigger={
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none text-muted-foreground hover:text-primary hover:bg-primary/5">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              }
            />
            <ThemeToggleButton />
          </div>

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
