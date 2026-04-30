"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3, TrendingUp, Activity, PieChart, Layers } from "lucide-react";

export default function Analytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/analytics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setData(res.data));
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <header>
        <div className="flex items-center gap-2 mb-2">
          <div className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
            Insights Dashboard
          </div>
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-white">Market Analytics</h1>
        <p className="text-slate-400 mt-2 text-lg">Aggregated data and scoring distributions across all your projects</p>
      </header>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Total Ideas */}
        <div className="backdrop-blur-xl bg-slate-900/40 p-10 rounded-[48px] border border-white/5 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Layers className="w-24 h-24 text-indigo-500" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Concepts</p>
          </div>
          <h2 className="text-6xl font-black text-white tracking-tighter">{data.total}</h2>
          <div className="mt-6 flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl w-fit border border-emerald-500/20">
            <TrendingUp className="w-3.5 h-3.5" /> 
            Active Portfolio
          </div>
        </div>

        {/* Avg Score */}
        <div className="backdrop-blur-xl bg-slate-900/40 p-10 rounded-[48px] border border-white/5 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-24 h-24 text-violet-500" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Average Score</p>
          </div>
          <div className="flex items-baseline gap-1">
            <h2 className="text-6xl font-black text-white tracking-tighter">{data.avgScore}</h2>
            <span className="text-2xl text-slate-700 font-bold">/10</span>
          </div>
          <p className="mt-6 text-sm text-slate-400 leading-relaxed font-medium">Across all validated business models</p>
        </div>

        {/* Verdict Distribution */}
        <div className="backdrop-blur-xl bg-slate-900/40 p-10 rounded-[48px] border border-white/5 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <PieChart className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <PieChart className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verdict Spread</p>
          </div>
          <div className="space-y-5">
            {data.verdicts.map((v: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-300">{v.verdict}</span>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-2 bg-slate-950/50 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-indigo-500 rounded-full shadow-sm" 
                      style={{ width: `${(v.count / data.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-black text-white min-w-[12px]">{v.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Placeholder Chart Section */}
      <div className="backdrop-blur-xl bg-slate-900/40 p-20 rounded-[64px] border border-white/5 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center group">
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-indigo-500/5 group-hover:to-indigo-500/10 transition-all" />
        <div className="text-center relative z-10">
          <div className="w-20 h-20 rounded-[32px] bg-slate-950/60 border border-white/5 flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform">
            <BarChart3 className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight mb-2">Deep Intelligence Coming Soon</h3>
          <p className="text-slate-500 font-medium text-lg">Detailed trend analysis and scoring charts are being processed</p>
        </div>
      </div>
    </div>
  );
}
