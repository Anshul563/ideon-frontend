"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MessageSquare, ShieldAlert, Cpu } from "lucide-react";
import { useUserPlan } from "@/hooks/useUserPlan";
import { ContactSupportDialog } from "./ContactSupportDialog";

export function BetaVersionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { user } = useUserPlan();

  useEffect(() => {
    // Check if the user has already seen this in the current session
    const hasSeenBetaNotice = sessionStorage.getItem("hasSeenBetaNotice");
    if (!hasSeenBetaNotice) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500); // Slight delay for better UX
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenBetaNotice", "true");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-3xl bg-card/95 backdrop-blur-2xl border-border rounded-none overflow-hidden p-0 gap-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/50 via-primary to-primary/50 z-20" />
          
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Panel: Identity */}
            <div className="w-full md:w-[35%] bg-secondary/10 border-b md:border-b-0 md:border-r border-border p-8 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#80808044_1px,transparent_1px)] bg-size-[20px_20px]" />
              
              <div className="w-20 h-20 bg-primary/5 border border-primary/20 flex items-center justify-center relative z-10">
                <Cpu className="w-10 h-10 text-primary" />
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest">
                  Beta v1.2
                </div>
              </div>
              
              <div className="space-y-2 relative z-10">
                <DialogTitle className="text-2xl font-black tracking-tighter uppercase leading-tight">
                  Early Access <br />
                  <span className="text-primary">Intelligence</span>
                </DialogTitle>
                <div className="inline-block px-2 py-1 bg-primary/10 border border-primary/20 text-[8px] font-black text-primary uppercase tracking-[0.2em]">
                  Live Environment
                </div>
              </div>
            </div>

            {/* Right Panel: Content & Actions */}
            <div className="flex-1 p-8 md:p-12 space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-primary" />
                  Beta Notice
                </h4>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  This is a Beta version of Ideon. While our core intelligence engine is operational, you may encounter some errors, bugs, or problems as we continue to improve the system.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex gap-4 p-4 bg-primary/5 border border-primary/20">
                  <MessageSquare className="w-5 h-5 text-primary shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Found a bug?</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      If you find any problem, error or bug, please contact our support team immediately using the button below.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  onClick={handleClose}
                  className="flex-1 h-14 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.4em] rounded-none hover:bg-primary/90 transition-all"
                >
                  I Understand
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsContactOpen(true)}
                  className="flex-1 h-14 border-border text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground rounded-none"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ContactSupportDialog 
        user={user} 
        open={isContactOpen} 
        onOpenChange={setIsContactOpen} 
      />
    </>
  );
}
