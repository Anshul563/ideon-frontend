"use client";

import React from "react";
import { 
  Skull, 
  Flame, 
  Ghost,
  Trash2,
  Laugh,
  Ban
} from "lucide-react";

export default function RoastResult({ data }: { data: any }) {
  if (!data) return null;

  // Handle both old nested and new flat structures
  const result = data.roasts ? data : (data.result || data);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Roast Header */}
      <div className="relative overflow-hidden rounded-[48px] bg-orange-500/10 backdrop-blur-3xl border border-orange-500/20 p-10 md:p-16 shadow-3xl">
        <div className="absolute top-0 right-0 p-12 opacity-20 blur-[120px] pointer-events-none">
          <div className="w-96 h-96 bg-orange-500 rounded-full" />
        </div>
        
        <div className="relative z-10 flex flex-col gap-8 text-center items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-widest border border-orange-500/20">
            <Skull className="w-4 h-4" /> Roast Mode Active
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-[1.2] max-w-3xl italic">
            "{result.the_burn}"
          </h2>
          <div className="flex gap-4">
             <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 animate-bounce">
                <Flame className="w-6 h-6 text-orange-500" />
             </div>
             <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 animate-bounce delay-100">
                <Laugh className="w-6 h-6 text-orange-500" />
             </div>
             <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 animate-bounce delay-200">
                <Skull className="w-6 h-6 text-orange-500" />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {result.roasts?.map((roast: any, i: number) => (
          <div key={i} className="group relative">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
            <div className="relative p-8 rounded-[32px] bg-card/40 border border-border shadow-lg transition-all group-hover:-translate-y-2 group-hover:border-orange-500/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                  {i % 2 === 0 ? <Ghost className="w-6 h-6 text-orange-500" /> : <Trash2 className="w-6 h-6 text-orange-500" />}
                </div>
                <div>
                  <h4 className="text-lg font-black text-foreground uppercase tracking-tight">{roast.point}</h4>
                  <div className="h-1 w-12 bg-orange-500/30 rounded-full mt-1" />
                </div>
              </div>
              <p className="text-muted-foreground font-medium italic leading-relaxed text-lg">
                "{roast.comment}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
         <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4">
            <Ban className="w-4 h-4" /> This analysis contains zero constructive feedback <Ban className="w-4 h-4" />
         </p>
      </div>
    </div>
  );
}
