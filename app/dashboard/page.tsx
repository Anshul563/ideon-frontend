"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingDialog from "../../components/LoadingDialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight, Activity, Loader2 } from "lucide-react";


export default function Dashboard() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async (mode: "full" | "stress" = "full") => {
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ideas/analyze",
        { idea, mode },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Wait a bit to show the loading sequence if the API is too fast
      setTimeout(() => {
        router.push(`/result/${res.data.id}`);
      }, 2000);
    } catch (error) {
      console.error("Analysis failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 max-w-5xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 bg-secondary rounded-md text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
              V1.0 Stable
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground">Project Overview</h1>
          <p className="text-muted-foreground mt-2 text-lg">Start a new AI analysis or view your recent insights</p>
        </div>
        <div className="flex items-center gap-3 bg-card/50 backdrop-blur-md p-2 rounded-2xl border border-border">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div className="pr-4">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mb-1">System Status</p>
            <p className="text-xs  font-bold flex items-center gap-1.5 leading-none">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" />
              All Systems Operational
            </p>
          </div>
        </div>
      </header>

      {/* Input */}
      <section className="backdrop-blur-2xl bg-card/40 p-1 md:p-1 rounded-[40px] border border-border relative overflow-hidden group">
        <div className="bg-background/40 p-10 rounded-[39px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-focus-within:opacity-10 transition-opacity">
            <div className="w-48 h-48 bg-primary rounded-full blur-[100px]" />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              Analyze New Concept
            </h3>
          </div>

          <textarea
            className="w-full min-h-[180px] p-8 bg-background/60 border border-border rounded-3xl focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground text-xl resize-none mb-8 leading-relaxed font-medium text-foreground"
            placeholder="Describe your SaaS idea in detail... e.g., 'An AI tool that converts spreadsheets into interactive 3D charts'"
            value={idea}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIdea(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm shadow-primary" />
                <span className="text-xs text-muted-foreground font-semibold tracking-wide">Market Scan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-sm shadow-secondary" />
                <span className="text-xs text-muted-foreground font-semibold tracking-wide">Competitor Map</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-sm shadow-accent" />
                <span className="text-xs text-muted-foreground font-semibold tracking-wide">Financial Model</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="outline"
                onClick={() => handleAnalyze("roast")}
                disabled={loading || !idea.trim()}
                className="group relative border-orange-500/50 text-orange-500 hover:bg-orange-500/10 px-8 py-7 rounded-2xl text-lg font-bold transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 overflow-hidden"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Roast my idea 💀"}
              </Button>

              <Button
                variant="outline"
                onClick={() => handleAnalyze("stress")}
                disabled={loading || !idea.trim()}
                className="group relative border-rose-500/50 text-rose-500 hover:bg-rose-500/10 px-8 py-7 rounded-2xl text-lg font-bold transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 overflow-hidden"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Break my idea 🔥"}
              </Button>

              <Button
                onClick={() => handleAnalyze("full")}
                disabled={loading || !idea.trim()}
                className="group relative bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-7 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 overflow-hidden border-none"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Run Full Analysis
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LoadingDialog isOpen={loading} />
    </div>
  );
}

