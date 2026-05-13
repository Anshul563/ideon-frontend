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
import { Loader2, ArrowRight, Brain, ShieldCheck } from "lucide-react";

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
      {/* Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] animate-pulse delay-700" />
      </div>

      <Link href="/" className="absolute top-10 left-10 flex items-center gap-2 group z-20">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-black tracking-tighter text-foreground">Ideon</h1>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Decorative elements */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-secondary/20 rounded-full blur-3xl" />

        <Card className="rounded-[40px] border-border bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-secondary to-accent opacity-50" />
          
          <CardHeader className="text-center pt-12 pb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Welcome <span className="text-primary">Back</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm font-medium mt-4 tracking-tight">
              Enter your credentials to access your strategic dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-10 pb-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="name@company.com"
                className="h-14 bg-muted/5 border-border rounded-2xl focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground/40 font-medium transition-all hover:bg-muted/10"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Password
                </Label>
                <button className="text-[10px] font-black text-primary uppercase tracking-[0.1em] hover:underline">
                  Forgot?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-14 bg-muted/5 border-border rounded-2xl focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground/40 font-medium transition-all hover:bg-muted/10"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-16 mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95 gap-3 group/btn"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Launch Session
                  <ArrowRight className="h-6 w-6 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="pb-12 pt-6">
            <p className="w-full text-center text-muted-foreground text-xs font-bold uppercase tracking-widest">
              No tactical account?{" "}
              <Link href="/register" className="text-primary font-black hover:underline transition-all">
                Join Now
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <p className="mt-8 text-center text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">
          &copy; 2026 Ideon Strategic / Secure Access
        </p>
      </motion.div>
    </main>
  );
}
