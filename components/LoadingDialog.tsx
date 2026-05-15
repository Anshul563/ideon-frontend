"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Logo } from "./Logo";
import { Sparkles, Loader2, Search, Target, TrendingUp, PieChart, CheckCircle2, Cpu, Activity, Zap, AlertTriangle, Layers, Database, Cloud, Shield } from "lucide-react";

const modeMessages = {
  full: [
    { text: "Initializing Core AI Runner...", icon: Cpu, color: "text-primary" },
    { text: "Analyzing idea viability...", icon: Sparkles, color: "text-primary" },
    { text: "Scanning global market trends...", icon: TrendingUp, color: "text-indigo-400" },
    { text: "Identifying target audience...", icon: Target, color: "text-emerald-400" },
    { text: "Mapping competitor landscape...", icon: Search, color: "text-amber-400" },
    { text: "Drafting technical architecture...", icon: Activity, color: "text-indigo-400" },
    { text: "Finalizing deep-dive report...", icon: CheckCircle2, color: "text-primary" },
  ],
  stress: [
    { text: "Arming Chaos Engines...", icon: Zap, color: "text-rose-500" },
    { text: "Injecting market volatility...", icon: TrendingUp, color: "text-rose-400" },
    { text: "Simulating system failures...", icon: AlertTriangle, color: "text-amber-500" },
    { text: "Testing business resilience...", icon: Target, color: "text-primary" },
    { text: "Analyzing black swan events...", icon: Search, color: "text-indigo-400" },
    { text: "Generating failure report...", icon: CheckCircle2, color: "text-rose-500" },
  ],
  roast: [
    { text: "Calibrating Sarcasm Modules...", icon: Zap, color: "text-amber-500" },
    { text: "Scanning for buzzwords...", icon: Search, color: "text-primary" },
    { text: "Reviewing projections...", icon: TrendingUp, color: "text-rose-400" },
    { text: "Drafting blunt critiques...", icon: Sparkles, color: "text-indigo-400" },
    { text: "Finalizing the burn...", icon: CheckCircle2, color: "text-rose-500" },
  ],
  architecture: [
    { text: "Initializing Blueprint Engine...", icon: Cpu, color: "text-primary" },
    { text: "Designing multi-layered systems...", icon: Layers, color: "text-indigo-400" },
    { text: "Optimizing database schema...", icon: Database, color: "text-amber-400" },
    { text: "Configuring cloud nodes...", icon: Cloud, color: "text-emerald-400" },
    { text: "Applying security protocols...", icon: Shield, color: "text-rose-400" },
    { text: "Assembling visual diagram...", icon: Activity, color: "text-primary" },
  ],
};

export default function LoadingDialog({ 
  isOpen, 
  mode = "full", 
  idea 
}: { 
  isOpen: boolean; 
  mode?: "full" | "stress" | "roast" | "architecture";
  idea?: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const messages = modeMessages[mode];

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
      <DialogContent 
        className="sm:max-w-[425px] rounded-none border-border bg-card/95 overflow-hidden"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Analysis Loading</DialogTitle>
        <DialogDescription className="sr-only">
          Please wait while Ideon Intelligence analyzes your idea concept and market data.
        </DialogDescription>
        
        <div className="relative z-10 flex flex-col pt-4">
          <div className="px-6 mb-4">
            <Logo size="sm" href="" />
          </div>
          {/* System Status Area */}
          <div className="p-6 flex flex-col bg-accent/20 border-b border-border/50 relative overflow-hidden -mx-4 -mt-4">
            {/* Geometric background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,var(--border)_1px,transparent_0)] bg-size-[24px_24px]" />
            </div>

            <div className="flex items-center gap-6 mb-8 relative z-10">
              <div className="relative w-20 h-20 bg-background border-2 border-primary/30 rounded-none flex items-center justify-center shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent z-10" />
                <CurrentIcon className={`w-10 h-10 ${messages[currentStep].color} animate-in zoom-in-50 duration-700 relative z-10`} />
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/40 animate-scan z-20" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">System Online</span>
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tighter leading-none">
                    IDEON CORE.v1
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end mb-1">
                <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">
                    Neural Processing
                </p>
                <p className="text-xl font-black font-mono text-foreground leading-none">
                    {Math.round(((currentStep + 1) / messages.length) * 100)}%
                </p>
              </div>
              <div className="w-full bg-border h-2 rounded-none overflow-hidden p-0.5 border border-border">
                <div 
                  className="h-full bg-primary transition-all duration-700 ease-in-out"
                  style={{ width: `${((currentStep + 1) / messages.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between">
                 <span className="text-[8px] font-bold text-muted-foreground uppercase">Phase {currentStep + 1}</span>
                 <Loader2 className="w-3 h-3 text-primary animate-spin" />
              </div>
            </div>
          </div>

          {/* Log Feed Area */}
          <div className="py-6 px-2 bg-background/40 backdrop-blur-sm relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Process Logs</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-none" />
                </div>
            </div>

            <div className="space-y-2 font-mono h-[160px] overflow-y-auto pr-2 scrollbar-hide">
              {messages.map((msg, index) => {
                const Icon = msg.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                if (index > currentStep) return null;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-3 rounded-none border transition-all duration-300 ${
                      isActive
                        ? "bg-card border-primary/50 shadow-lg translate-x-1"
                        : "opacity-40 border-transparent"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-none flex items-center justify-center shrink-0 ${
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                    </div>
                    
                    <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
                        <span className={`text-xs font-bold truncate ${
                            isActive ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {index === 1 && idea ? `${messages[index].text.split('...')[0]} for ${idea}...` : messages[index].text}
                        </span>
                    </div>

                    {isActive && (
                      <div className="ml-auto flex gap-0.5">
                         <div className="w-0.5 h-2 bg-primary animate-pulse" />
                         <div className="w-0.5 h-2 bg-primary animate-pulse delay-75" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Info */}
            <div className="mt-6 flex items-center justify-between opacity-30">
                <span className="text-[7px] font-bold uppercase tracking-[0.3em]">Encrypted Session</span>
                <span className="text-[7px] font-bold uppercase tracking-[0.3em]">Build v1.0.42</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
