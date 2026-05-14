"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles, Loader2, Search, Target, TrendingUp, PieChart, CheckCircle2, Cpu, Activity, Zap } from "lucide-react";

const messages = [
  { text: "Initializing Core AI Runner...", icon: Cpu, color: "text-primary" },
  { text: "Analyzing idea concept & viability...", icon: Sparkles, color: "text-primary" },
  { text: "Scanning global market trends...", icon: TrendingUp, color: "text-indigo-400" },
  { text: "Identifying target audience & needs...", icon: Target, color: "text-emerald-400" },
  { text: "Mapping competitor landscape...", icon: Search, color: "text-amber-400" },
  { text: "Simulating financial projections...", icon: PieChart, color: "text-rose-400" },
  { text: "Drafting technical architecture...", icon: Activity, color: "text-indigo-400" },
  { text: "Finalizing deep-dive report...", icon: CheckCircle2, color: "text-primary" },
];

export default function LoadingDialog({ isOpen }: { isOpen: boolean }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 2500);

    return () => clearInterval(interval);
  }, [isOpen]);

  const CurrentIcon = messages[currentStep].icon;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="w-[90vw] max-w-md md:max-w-2xl p-6 bg-card/80 border-border backdrop-blur-3xl rounded-none overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border-2">
        <DialogTitle className="sr-only">Analysis Loading</DialogTitle>
        <DialogDescription className="sr-only">
          Please wait while Ideon Intelligence analyzes your idea concept and market data.
        </DialogDescription>
        
        <div className="relative z-10 flex flex-col md:flex-row">
          {/* Left Side: System Status */}
          <div className="p-6 md:p-8 md:w-[45%] flex flex-col bg-accent/20 border-b md:border-b-0 md:border-r-2 border-border/50 shrink-0 relative overflow-hidden">
            {/* Geometric background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,var(--border)_1px,transparent_0)] bg-size-[24px_24px]" />
            </div>

            <div className="relative mb-8">
              <div className="relative w-24 h-24 bg-background border-2 border-primary/30 rounded-none flex items-center justify-center shadow-2xl group overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent animate-pulse" />
                <CurrentIcon className={`w-12 h-12 ${messages[currentStep].color} animate-in zoom-in-50 duration-700 relative z-10`} />
                
                {/* Scanner line animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/40 animate-scan z-20" />
              </div>
              
              <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-primary border-4 border-background rounded-none flex items-center justify-center shadow-xl animate-in slide-in-from-top-4 duration-500">
                 <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
              </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">System Online</span>
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tighter leading-none">
                    IDEON<br/>CORE.v1
                </h3>
                <p className="text-muted-foreground text-xs font-bold leading-relaxed max-w-[200px] uppercase tracking-wider">
                    Orchestrating multi-model inference pipeline...
                </p>
            </div>

            <div className="mt-auto pt-10">
              <div className="flex justify-between items-end mb-2">
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">
                    Neural Progress
                </p>
                <p className="text-2xl font-black font-mono text-foreground leading-none">
                    {Math.round(((currentStep + 1) / messages.length) * 100)}%
                </p>
              </div>
              <div className="w-full bg-border h-3 rounded-none overflow-hidden p-0.5 border border-border">
                <div 
                  className="h-full bg-primary transition-all duration-700 ease-in-out"
                  style={{ width: `${((currentStep + 1) / messages.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                 <span className="text-[9px] font-bold text-muted-foreground uppercase">Phase {currentStep + 1}</span>
                 <span className="text-[9px] font-bold text-muted-foreground uppercase">Total Steps: {messages.length}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Log Feed */}
          <div className="p-6 md:p-8 md:w-[55%] bg-background/40 backdrop-blur-sm relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest">Process Logs</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-border rounded-none" />
                    <div className="w-1.5 h-1.5 bg-border rounded-none" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-none" />
                </div>
            </div>

            <div className="space-y-3 font-mono">
              {messages.map((msg, index) => {
                const Icon = msg.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-5 p-4 rounded-none border transition-all duration-300 ${
                      isActive
                        ? "bg-card border-primary/50 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] translate-x-2"
                        : isCompleted
                        ? "opacity-50 border-transparent bg-accent/10"
                        : "opacity-0 border-transparent translate-y-4 pointer-events-none"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 ${
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <span className={`text-[10px] font-bold uppercase tracking-tight ${
                            isActive ? "text-primary" : "text-muted-foreground/50"
                        }`}>
                            {isCompleted ? "DONE" : isActive ? "EXECUTING" : "PENDING"}
                        </span>
                        <span className={`text-xs font-bold truncate ${
                            isActive ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {msg.text}
                        </span>
                    </div>

                    {isActive && (
                      <div className="ml-auto flex gap-1">
                         <div className="w-1 h-3 bg-primary animate-pulse" />
                         <div className="w-1 h-3 bg-primary animate-pulse delay-75" />
                         <div className="w-1 h-3 bg-primary animate-pulse delay-150" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Warning/Info */}
            <div className="absolute bottom-6 right-8 left-8 flex items-center justify-between opacity-30">
                <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Encrypted Session</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Build v1.0.42</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
