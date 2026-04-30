"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      document.cookie = `token=${res.data.token}; path=/`;
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative px-6">
      <div className="backdrop-blur-2xl bg-slate-900/50 p-10 rounded-[32px] w-full max-w-md border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Enter your credentials to access your dashboard</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <input
              className="w-full p-4 bg-slate-950/50 border border-white/5 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
              placeholder="name@company.com"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              className="w-full p-4 bg-slate-950/50 border border-white/5 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
              placeholder="••••••••"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          Sign In
        </button>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-400 font-bold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}