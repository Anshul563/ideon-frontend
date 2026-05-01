"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus } from "lucide-react";

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
    <main className="min-h-screen flex items-center justify-center relative px-6 py-12">
      <Card className="w-full max-w-md rounded-[32px] border-white/10 bg-slate-900/50 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in duration-500 overflow-hidden">
        <CardHeader className="text-center pt-10">
          <CardTitle className="text-3xl font-black tracking-tighter text-white">Create Account</CardTitle>
          <CardDescription className="text-slate-400 text-sm mt-2">
            Join Ideon and start validating your ideas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">First Name *</Label>
              <Input
                placeholder="John"
                className="h-12 bg-slate-950/50 border-white/5 rounded-2xl focus-visible:ring-indigo-500/50 text-white placeholder:text-slate-600"
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Last Name</Label>
              <Input
                placeholder="Doe"
                className="h-12 bg-slate-950/50 border-white/5 rounded-2xl focus-visible:ring-indigo-500/50 text-white placeholder:text-slate-600"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</Label>
            <Input
              type="email"
              placeholder="name@company.com"
              className="h-12 bg-slate-950/50 border-white/5 rounded-2xl focus-visible:ring-indigo-500/50 text-white placeholder:text-slate-600"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="h-12 bg-slate-950/50 border-white/5 rounded-2xl focus-visible:ring-indigo-500/50 text-white placeholder:text-slate-600"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            onClick={handleRegister}
            disabled={loading}
            className="w-full h-14 mt-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-lg font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Get Started <UserPlus className="h-5 w-5" /></>}
          </Button>
        </CardContent>
        <CardFooter className="pb-10 pt-2">
          <p className="w-full text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 font-bold hover:underline transition-all hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}