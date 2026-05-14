"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus, Brain, ArrowRight, Sparkles } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        email,
        password,
        firstName,
        lastName,
      });

      router.push("/login");
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center relative px-6 py-12 overflow-hidden selection:bg-primary/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px]" />
      </div>

      <Link href="/" className="absolute top-10 left-10 flex items-center gap-3 group z-20">
        <div className="w-10 h-10 rounded-none bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
          <Brain className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter text-foreground leading-none">Ideon</h1>
            <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Intelligence</span>
        </div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[520px] relative z-10"
      >
        <div className="absolute -top-1 border-t-2 border-primary w-20 z-20" />
        
        <Card className="rounded-none border-border bg-card/60 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
          <CardHeader className="text-center pt-16 pb-10 border-b border-border/50">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-none bg-primary/5 flex items-center justify-center border border-primary/20 shadow-inner relative group">
                <UserPlus className="w-7 h-7 text-primary" />
                <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-primary animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-5xl font-black tracking-[ -0.05em] text-foreground uppercase leading-none">
              INITIALIZE <span className="text-primary italic">PROTOCOL</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.2em] mt-6">
              Create your permanent tactical identity
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-12 pt-12 pb-8">
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-3">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-0.5 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-primary/40" />
                     First Name
                  </Label>
                  <Input
                    placeholder="ALPHA"
                    className="h-14 bg-accent/5 border-border rounded-none focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground/10 font-black uppercase tracking-widest text-xs transition-all hover:bg-accent/10 px-5"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
               </div>
               <div className="space-y-3">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-0.5 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-primary/40" />
                     Last Name
                  </Label>
                  <Input
                    placeholder="BETA"
                    className="h-14 bg-accent/5 border-border rounded-none focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground/10 font-black uppercase tracking-widest text-xs transition-all hover:bg-accent/10 px-5"
                    onChange={(e) => setLastName(e.target.value)}
                  />
               </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-0.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary/40" />
                Communication Link
              </Label>
              <Input
                type="email"
                placeholder="USER@NETWORK.INTEL"
                className="h-14 bg-accent/5 border-border rounded-none focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground/10 font-black uppercase tracking-widest text-xs transition-all hover:bg-accent/10 px-5"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-0.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary/40" />
                Secure Pass-Key
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-14 bg-accent/5 border-border rounded-none focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground/10 font-black tracking-widest transition-all hover:bg-accent/10 px-5"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={handleRegister}
              disabled={loading}
              className="w-full h-16 mt-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 transition-all active:scale-95 gap-3 group/btn relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="relative z-10 flex items-center gap-3">
                  Deploy Identity <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </CardContent>

          <CardFooter className="pb-16 pt-4 px-12">
            <Link href="/login" className="w-full">
               <button className="w-full py-4 border border-border bg-background text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:bg-accent/10 hover:text-primary transition-all">
                  Existing Protocol Detected? Sign In
               </button>
            </Link>
          </CardFooter>
        </Card>
        
        <div className="mt-10 flex justify-between items-center px-2">
           <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em]">IDEON-AUTH-CORE</span>
           <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em]">&copy; 2026</span>
        </div>
      </motion.div>
    </main>
  );
}