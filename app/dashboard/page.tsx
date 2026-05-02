"use client";

import { useState, Suspense, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingDialog from "../../components/LoadingDialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight, Activity, Loader2, CheckCircle2, AlertCircle, X, ShieldCheck, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function DashboardContent() {
  const [idea, setIdea] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [geographicScope, setGeographicScope] = useState("Global");
  const [businessModel, setBusinessModel] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [verifiedData, setVerifiedData] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const paymentStatus = searchParams.get("payment");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (paymentStatus === "success" && orderId) {
      const verifyPayment = async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/verify`, 
            { order_id: orderId },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.data.verified) {
            setVerifiedData(response.data);
            setIsDialogOpen(true);
          }
        } catch (err: any) {
          console.error("Verification failed:", err.response?.data || err.message);
        }
      };

      const timer = setTimeout(() => {
        verifyPayment();
      }, 1000);

      return () => clearTimeout(timer);
    } else if (paymentStatus === "failed") {
      setIsDialogOpen(true);
    }
  }, [paymentStatus, orderId]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    router.replace("/dashboard");
  };

  const handleAnalyze = async (mode: "full" | "stress" | "roast" = "full") => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/analyze`,
        { 
          idea, 
          mode,
          targetAudience,
          geographicScope,
          businessModel,
          budget
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTimeout(() => {
        router.push(`/result/${res.data.id}`);
      }, 500);
    } catch (error) {
      console.error("Analysis failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 max-w-5xl mx-auto pb-20">
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px] border-border bg-card/95 backdrop-blur-2xl">
          <DialogHeader className="flex flex-col items-center pt-6">
            <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center mb-6 shadow-2xl animate-in zoom-in-50 duration-500 ${
              paymentStatus === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
            }`}>
              {paymentStatus === 'success' ? <ShieldCheck className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
            </div>
            <DialogTitle className="text-3xl font-black tracking-tight text-center">
              {paymentStatus === 'success' ? 'Upgrade Successful!' : 'Payment Failed'}
            </DialogTitle>
            <DialogDescription className="text-center text-lg mt-2 font-medium">
              {paymentStatus === 'success' 
                ? 'Your premium access has been activated.' 
                : 'There was an issue processing your transaction.'}
            </DialogDescription>
          </DialogHeader>

          {paymentStatus === 'success' && verifiedData && (
            <div className="space-y-4 py-6">
              <div className="p-5 rounded-2xl bg-accent/30 border border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Current Plan</p>
                    <p className="font-bold capitalize text-foreground">{verifiedData.planId} Edition</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                  Active
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-accent/30 border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Order Identifier</p>
                <p className="font-mono text-sm text-foreground/80 break-all">{verifiedData.orderId}</p>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-center pb-6">
            <Button 
              onClick={handleCloseDialog}
              className={`w-full h-14 rounded-2xl text-lg font-bold shadow-xl transition-all active:scale-95 ${
                paymentStatus === 'success' 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20' 
                  : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
              }`}
            >
              Return to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

          <div className="space-y-6">
            <textarea
              className="w-full min-h-[200px] p-8 bg-background/60 border border-border rounded-3xl focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground text-xl resize-none mb-2 leading-relaxed font-medium text-foreground"
              placeholder="Describe your SaaS idea in detail..."
              value={idea}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIdea(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full h-12 px-4 bg-background/60 border border-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/50 text-foreground font-bold appearance-none cursor-pointer text-sm"
                >
                  <option value="" className="bg-card">Select Customers...</option>
                  <option value="b2b" className="bg-card">B2B / Enterprises</option>
                  <option value="b2c" className="bg-card">B2C / General Consumers</option>
                  <option value="developers" className="bg-card">Developers / Technical Users</option>
                  <option value="creators" className="bg-card">Creators / Influencers</option>
                  <option value="small-business" className="bg-card">Small Business Owners</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">
                  Geographic Scope
                </label>
                <select
                  value={geographicScope}
                  onChange={(e) => setGeographicScope(e.target.value)}
                  className="w-full h-12 px-4 bg-background/60 border border-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/50 text-foreground font-bold appearance-none cursor-pointer text-sm"
                >
                  <option value="Global" className="bg-card">Global Market</option>
                  <option value="USA" className="bg-card">USA / North America</option>
                  <option value="Europe" className="bg-card">Europe</option>
                  <option value="India" className="bg-card">India / Asia</option>
                  <option value="UK" className="bg-card">United Kingdom</option>
                  <option value="MENA" className="bg-card">Middle East / North Africa</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">
                  Business Model
                </label>
                <select
                  value={businessModel}
                  onChange={(e) => setBusinessModel(e.target.value)}
                  className="w-full h-12 px-4 bg-background/60 border border-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/50 text-foreground font-bold appearance-none cursor-pointer text-sm"
                >
                  <option value="" className="bg-card">Select Model...</option>
                  <option value="subscription" className="bg-card">SaaS / Subscription</option>
                  <option value="freemium" className="bg-card">Freemium</option>
                  <option value="one-time" className="bg-card">One-time Purchase</option>
                  <option value="ads" className="bg-card">Ad-supported</option>
                  <option value="marketplace" className="bg-card">Marketplace / Commission</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">
                  Est. Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full h-12 px-4 bg-background/60 border border-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/50 text-foreground font-bold appearance-none cursor-pointer text-sm"
                >
                  <option value="" className="bg-card">Select Budget...</option>
                  <option value="under-1k" className="bg-card">Under $1k</option>
                  <option value="1k-10k" className="bg-card">$1k - $10k</option>
                  <option value="10k-50k" className="bg-card">$10k - $50k</option>
                  <option value="50k-plus" className="bg-card">$50k+</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-8">
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


