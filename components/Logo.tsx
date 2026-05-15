"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function Logo({ className = "", showText = true, size = "md", href = "/" }: LogoProps) {
  const sizeClasses = {
    sm: { container: "w-7 h-7", icon: "w-4 h-4", text: "text-lg" },
    md: { container: "w-9 h-9", icon: "w-5 h-5", text: "text-2xl" },
    lg: { container: "w-12 h-12", icon: "w-7 h-7", text: "text-3xl" },
  };

  const { container, icon, text } = sizeClasses[size];

  const content = (
    <div className={`flex items-center gap-3 group ${className}`}>
      <div className={`${container} shrink-0 rounded-none bg-primary flex items-center justify-center group-hover:scale-105 transition-all duration-300`}>
        <Sparkles className={`${icon} text-primary-foreground`} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className={`${text} font-black tracking-tighter text-foreground leading-none uppercase`}>
              Ideon
            </h1>
            <div className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-[8px] font-black text-primary uppercase tracking-[0.1em] leading-none mb-0.5">
              Beta
            </div>
          </div>
          <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Intelligence</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
