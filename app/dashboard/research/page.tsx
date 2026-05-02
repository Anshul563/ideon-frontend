"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, TrendingUp, ExternalLink, Globe, Zap, ArrowRight, Filter, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MarketResearch() {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/research`, {
        params: { industry, targetAudience: audience },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTrends(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 flex items-center gap-2">
            <Globe className="w-3 h-3" />
            Live Market Intelligence
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Market Research</h1>
        <p className="text-muted-foreground text-lg font-medium">Trending success stories and emerging opportunities from across the web</p>
      </header>

      {/* Filter System */}
      <div className="bg-card p-6 rounded-[28px] border border-border space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-primary">
          <Filter className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Research Filters</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Industry (e.g. AI, Fintech)" 
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="pl-10 h-11 bg-accent/30 border-border rounded-xl font-medium"
            />
          </div>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Audience (e.g. Solo Founders)" 
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="pl-10 h-11 bg-accent/30 border-border rounded-xl font-medium"
            />
          </div>
          <Button 
            onClick={fetchTrends}
            disabled={loading}
            className="h-11 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {loading ? "Searching..." : "Research Trends"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Scanning Global Markets...</p>
          </div>
        ) : trends.length > 0 ? (
          trends.map((item, index) => (
            <div 
              key={index} 
              className="bg-card hover:bg-accent/30 p-8 rounded-[32px] border border-border hover:border-primary/30 transition-all group relative overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 blur-2xl group-hover:bg-primary/10 transition-all" />
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-[10px] font-black uppercase tracking-wider border border-border">
                      {item.platform}
                    </span>
                    <div className="flex gap-1">
                      {item.tags?.map((tag: string) => (
                        <span key={tag} className="text-[10px] font-bold text-muted-foreground/60">#{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1">
                      {item.name}
                    </h2>
                    <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-primary/3 border border-primary/10 space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Zap className="w-4 h-4 fill-current" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Strategic Insight</span>
                    </div>
                    <p className="text-xs text-foreground/80 font-bold leading-relaxed">
                      {item.gap}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[140px]">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full justify-between group/btn rounded-xl border-border hover:bg-primary hover:text-primary-foreground transition-all">
                      Analysis
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover/btn:opacity-100" />
                    </Button>
                  </a>
                  <Button className="w-full justify-between rounded-xl bg-accent text-accent-foreground hover:bg-primary/10 hover:text-primary transition-all">
                    Validate
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-[32px]">
            <p className="text-muted-foreground font-bold">No specific trends found for this filter. Try a broader search.</p>
          </div>
        )}
      </div>

      <div className="bg-primary/5 p-10 rounded-[40px] border border-primary/10 text-center space-y-4">
        <h3 className="text-xl font-black text-foreground">Want deeper insights?</h3>
        <p className="text-muted-foreground text-sm font-medium max-w-md mx-auto">
          Our AI agents are constantly scanning Google, Indie Hackers, and Product Hunt for the next big thing. New trends are added every 6 hours.
        </p>
        <div className="flex items-center justify-center gap-6 pt-4">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scanning Web</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75" />
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Analyzing Gaps</span>
           </div>
        </div>
      </div>
    </div>
  );
}
