"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles, Loader2, Search, Target, TrendingUp, PieChart, CheckCircle2 } from "lucide-react";

const messages = [
  { text: "Analyzing your idea concept...", icon: Sparkles, color: "text-primary" },
  { text: "Scanning global market trends...", icon: TrendingUp, color: "text-secondary" },
  { text: "Identifying target audience & needs...", icon: Target, color: "text-primary" },
  { text: "Mapping competitor landscape...", icon: Search, color: "text-accent" },
  { text: "Simulating financial projections...", icon: PieChart, color: "text-destructive" },
  { text: "Finalizing your deep-dive report...", icon: CheckCircle2, color: "text-primary" },
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
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const CurrentIcon = messages[currentStep].icon;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="w-[95vw] max-w-md md:max-w-2xl p-0 bg-card/50 border-border backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl">
        <DialogTitle className="sr-only">Analysis Loading</DialogTitle>
        <DialogDescription className="sr-only">
          Please wait while Ideon Intelligence analyzes your idea concept and market data.
        </DialogDescription>
        
        {/* Animated background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 rounded-full blur-[80px] animate-pulse delay-700" />

        <div className="relative z-10 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden">
          {/* Left Side: Status & Branding */}
          <div className="p-8 md:p-10 md:w-2/5 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-border/50 shrink-0">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-24 h-24 bg-background border border-border rounded-3xl flex items-center justify-center shadow-inner group overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5" />
                <CurrentIcon className={`w-12 h-12 ${messages[currentStep].color} animate-in zoom-in-50 duration-500 relative z-10`} />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
                    <div className="h-full bg-primary animate-progress-fast" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center shadow-lg animate-bounce">
                 <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Ideon Intelligence</h3>
            <p className="text-muted-foreground mb-10 text-sm font-medium">Powering up deep analysis engines...</p>

            <div className="mt-auto w-full">
              <div className="w-full bg-accent/20 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / messages.length) * 100}%` }}
                />
              </div>
              <p className="mt-4 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                Step {currentStep + 1} of {messages.length}
              </p>
            </div>
          </div>

          {/* Right Side: Message Pipeline */}
          <div className="p-8 md:p-12 md:w-3/5 bg-background/30 backdrop-blur-sm">
            <div className="space-y-4">
              {messages.map((msg, index) => {
                const Icon = msg.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
                      index === currentStep
                        ? "bg-card border-border scale-105 shadow-xl"
                        : index < currentStep
                        ? "opacity-40 border-transparent grayscale"
                        : "opacity-0 border-transparent translate-y-4"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        index === currentStep ? "bg-accent" : "bg-transparent"
                    }`}>
                      <Icon className={`w-5 h-5 ${msg.color}`} />
                    </div>
                    <span className={`text-sm font-semibold tracking-wide ${
                        index === currentStep ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {msg.text}
                    </span>
                    {index === currentStep && (
                      <div className="ml-auto">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
