"use client";

import { useState, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingDialog from "../../components/LoadingDialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight, Activity, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

function DashboardContent() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const paymentStatus = searchParams.get("payment");
  const orderId = searchParams.get("order_id");

  const handleAnalyze = async (mode: "full" | "stress" | "roast" = "full") => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/analyze`,
        { idea, mode },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTimeout(() => {
        router.push(`/result/${res.data.id}`);
      }, 2000);
    } catch (error) {
      console.error("Analysis failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 max-w-5xl mx-auto pb-20">
      
      {/* Payment Status Banners */}
      {paymentStatus && showBanner && (
        <div className={`p-6 rounded-[32px] border flex items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500 ${
          paymentStatus === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${paymentStatus === 'success' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
              {paymentStatus === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {paymentStatus === 'success' ? 'Payment Successful!' : 'Payment Failed'}
              </h3>
              <p className="text-sm opacity-80 font-medium">
                {paymentStatus === 'success' 
                  ? `Your account has been upgraded. Order ID: ${orderId}` 
                  : 'Something went wrong with the transaction. Please try again.'}
              </p>
            </div>
          </div>
          <button onClick={() => setShowBanner(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground">Project Overview</h1>
          <p className="text-muted-foreground mt-2 text-lg">Start a new AI analysis or view your recent insights</p>
        </div>
      </header>

      {/* Input Section */}
      <section className="backdrop-blur-2xl bg-card/40 p-1 rounded-[40px] border border-border relative overflow-hidden group shadow-2xl">
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
            className="w-full min-h-[200px] p-8 bg-background/60 border border-border rounded-3xl focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground text-xl resize-none mb-8 leading-relaxed font-medium text-foreground"
            placeholder="Describe your SaaS idea in detail..."
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
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="outline"
                onClick={() => handleAnalyze("roast")}
                disabled={loading || !idea.trim()}
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 px-8 py-7 rounded-2xl text-lg font-bold transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Roast 💀"}
              </Button>

              <Button
                onClick={() => handleAnalyze("full")}
                disabled={loading || !idea.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-7 rounded-2xl text-lg font-bold shadow-2xl transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Run Full Analysis"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LoadingDialog isOpen={loading} />
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-muted-foreground">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}


