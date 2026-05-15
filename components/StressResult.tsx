"use client";

import React from "react";
import { 
  AlertTriangle, 
  XCircle, 
  Flame, 
  ShieldAlert, 
  TrendingDown, 
  Skull,
  ZapOff
} from "lucide-react";
import type { AnalysisResult, RiskItem } from "@/lib/types";

export default function StressResult({ data }: { data: AnalysisResult | null }) {
  if (!data) return null;

  // Handle both old nested and new flat structures
  const result = data.failure_reasons ? data : (data.result || data);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Brutal Verdict Header */}
      <div className="relative overflow-hidden rounded-[48px] bg-destructive/10 border border-destructive/20 p-10 md:p-16">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <div className="w-96 h-96 bg-destructive rounded-full" />
        </div>
        
        <div className="relative z-10 flex flex-col gap-8 text-center items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-widest border border-destructive/20">
            <Flame className="w-4 h-4" /> Brutal Reality Check
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1] max-w-4xl">
            &quot;{result.brutal_verdict}&quot;
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Why it will fail */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-destructive/10 border border-destructive/20">
              <Skull className="w-5 h-5 text-destructive" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Why it will fail</h3>
          </div>
          <div className="space-y-4">
            {result.failure_reasons?.map((reason: RiskItem, i: number) => (
              <div key={i} className="p-6 rounded-[32px] bg-card/40 border border-border group hover:border-destructive/30 transition-all">
                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-destructive shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{reason.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Risks */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <TrendingDown className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Market Risks</h3>
          </div>
          <div className="space-y-4">
            {result.market_risks?.map((risk: RiskItem, i: number) => (
              <div key={i} className="p-6 rounded-[32px] bg-card/40 border border-border group hover:border-orange-500/30 transition-all">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{risk.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{risk.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Challenges */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-accent border border-border">
              <ZapOff className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Execution Challenges</h3>
          </div>
          <div className="space-y-4">
            {result.execution_challenges?.map((challenge: RiskItem, i: number) => (
              <div key={i} className="p-6 rounded-[32px] bg-card/40 border border-border group hover:border-foreground/30 transition-all">
                <div className="flex items-start gap-4">
                  <ShieldAlert className="w-6 h-6 text-muted-foreground shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{challenge.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{challenge.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
