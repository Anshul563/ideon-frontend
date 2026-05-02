"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3, TrendingUp, Activity, PieChart, Layers } from "lucide-react";

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/analytics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!data || data.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center border border-border">
          <BarChart3 className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">No analytics data yet</h2>
          <p className="text-muted-foreground max-w-sm mx-auto font-medium">Analyze at least one idea to see your portfolio metrics and scoring distributions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
            Insights Dashboard
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Market Analytics</h1>
        <p className="text-muted-foreground text-lg font-medium">Aggregated data and scoring distributions across all your projects</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Ideas */}
        <div className="bg-card p-8 rounded-[32px] border border-border relative overflow-hidden group hover:border-primary/30 transition-all">
          <div className="absolute -top-4 -right-4 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <Layers className="w-32 h-32 text-primary" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Layers className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Concepts</p>
          </div>
          <h2 className="text-5xl font-black text-foreground tracking-tighter">{data.total}</h2>
          <div className="mt-6 flex items-center gap-2 text-[10px] text-primary font-black uppercase tracking-wider bg-primary/10 px-3 py-1.5 rounded-lg w-fit border border-primary/20">
            <TrendingUp className="w-3.5 h-3.5" /> 
            Active Portfolio
          </div>
        </div>

        {/* Avg Score */}
        <div className="bg-card p-8 rounded-[32px] border border-border relative overflow-hidden group hover:border-primary/30 transition-all">
          <div className="absolute -top-4 -right-4 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <Activity className="w-32 h-32 text-primary" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Average Score</p>
          </div>
          <div className="flex items-baseline gap-1">
            <h2 className="text-5xl font-black text-foreground tracking-tighter">{data.avgScore}</h2>
            <span className="text-xl text-muted-foreground font-bold">/10</span>
          </div>
          <p className="mt-6 text-xs text-muted-foreground leading-relaxed font-bold uppercase tracking-wide">Strategic Quality Baseline</p>
        </div>

        {/* Verdict Distribution */}
        <div className="bg-card p-8 rounded-[32px] border border-border relative overflow-hidden group hover:border-primary/30 transition-all">
          <div className="absolute -top-4 -right-4 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <PieChart className="w-32 h-32 text-primary" />
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <PieChart className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Verdict Spread</p>
          </div>
          <div className="space-y-4">
            {data.verdicts.map((v: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground/70 uppercase tracking-tight">{v.verdict}</span>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-1.5 bg-accent rounded-full overflow-hidden border border-border">
                    <div 
                      className="h-full bg-primary rounded-full shadow-sm" 
                      style={{ width: `${(v.count / data.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-foreground min-w-[12px]">{v.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deep Intelligence Section */}
      <div className="bg-card p-12 rounded-[48px] border border-border relative overflow-hidden flex flex-col items-center justify-center group text-center">
        <div className="absolute inset-0 bg-primary/2 group-hover:bg-primary/4 transition-all" />
        <div className="relative z-10 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-accent border border-border flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
            <BarChart3 className="w-8 h-8 text-primary/50" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-foreground tracking-tight">Market Intelligence V2</h3>
            <p className="text-muted-foreground font-medium text-sm max-w-sm mx-auto">
              Our advanced trend analysis engine is currently indexing global market shifts. 
              Real-time scoring charts will be available in the next release.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 pt-4">
             <div className="px-3 py-1 rounded-full bg-accent text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Indexing...</div>
             <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">Beta Access Enabled</div>
          </div>
        </div>
      </div>
    </div>
  );
}
