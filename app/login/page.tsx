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
import { Loader2, ArrowRight, Brain, ShieldCheck, Sparkles, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      document.cookie = `token=${res.data.token}; path=/`;

      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get("redirect");

      if (res.data.user.role === "admin") {
        router.push("/admin");
      } else if (redirect) {
        router.push(redirect);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed", error);
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

      <div className="absolute top-10 right-10 hidden md:flex items-center gap-2 px-4 py-2 border border-border bg-card/50 backdrop-blur-md">
        <div className="w-2 h-2 bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">System Online</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[460px] relative z-10"
      >
        <div className="absolute -top-1 border-t-2 border-primary w-20 z-20" />
        
        <Card className="rounded-none border-border bg-card/60 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
          <CardHeader className="text-center pt-16 pb-10 border-b border-border/50">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-none bg-accent/10 flex items-center justify-center border border-border shadow-inner relative group">
                <Lock className="w-7 h-7 text-primary" />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <CardTitle className="text-5xl font-black tracking-[ -0.05em] text-foreground uppercase leading-none">
              SECURE <span className="text-primary italic">LOGIN</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.2em] mt-6">
              Protocol Activation Required
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-12 pt-12 pb-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-0.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary/40" />
                Access Identity
              </Label>
              <Input
                type="email"
                placeholder="USER@IDEON.PROTOCOL"
                className="h-14 bg-accent/5 border-border rounded-none focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground/20 font-black uppercase tracking-widest text-xs transition-all hover:bg-accent/10 px-5"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center px-0.5">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-primary/40" />
                   Pass-Key
                </Label>
                <button className="text-[9px] font-black text-primary uppercase tracking-[0.2em] hover:text-primary/70 transition-colors">
                  Lost Key?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-14 bg-accent/5 border-border rounded-none focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground/20 font-black tracking-widest transition-all hover:bg-accent/10 px-5"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-16 mt-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 transition-all active:scale-95 gap-3 group/btn relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="relative z-10 flex items-center gap-3">
                  Initiate Session <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </CardContent>

          <CardFooter className="pb-16 pt-4 px-12">
            <Link href="/register" className="w-full">
               <button className="w-full py-4 border border-border bg-background text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:bg-accent/10 hover:text-primary transition-all">
                  Create New Protocol
               </button>
            </Link>
          </CardFooter>
        </Card>
        
        <div className="mt-10 flex justify-between items-center px-2">
           <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em]">IDEON-SEC-V4</span>
           <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em]">&copy; 2026</span>
        </div>
      </motion.div>
    </main>
  );
}
