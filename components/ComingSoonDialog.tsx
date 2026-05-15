"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Construction, Clock } from "lucide-react";

interface ComingSoonDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  featureName?: string;
}

export function ComingSoonDialog({ isOpen, onOpenChange, featureName = "This feature" }: ComingSoonDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-none border-border bg-card/95 backdrop-blur-2xl">
        <DialogHeader className="flex flex-col items-center pt-6">
          <div className="w-20 h-20 rounded-none bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 shadow-2xl shadow-primary/10">
            <Construction className="w-10 h-10 text-primary" />
          </div>
          <DialogTitle className="text-3xl font-black tracking-tight text-center uppercase">
            Coming Soon
          </DialogTitle>
          <DialogDescription className="text-center text-lg mt-2 font-medium">
            {featureName} is currently under heavy development.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/30 border border-border">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest">Target Deployment: Q3 2026</span>
          </div>
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            We are fine-tuning the secure sharing protocols to ensure your architectural blueprints remain private and protected.
          </p>
        </div>

        <DialogFooter className="sm:justify-center pb-6">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full h-12 rounded-none font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Stay Tuned
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
