"use client";

import { useState, Suspense, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingDialog from "../../components/LoadingDialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, AlertCircle, ShieldCheck, Zap, ChevronRight, Target, Globe, Wallet, Briefcase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BetaVersionDialog } from "@/components/BetaVersionDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { PaymentVerification } from "@/lib/types";
import { useUserPlan } from "@/hooks/useUserPlan";

function DashboardContent() {
  const [idea, setIdea] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [geographicScope, setGeographicScope] = useState("Global");
  const [businessModel, setBusinessModel] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<"full" | "stress" | "roast">("full");
  const [verifiedData, setVerifiedData] = useState<PaymentVerification | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const paymentStatus = searchParams.get("payment");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const ideaParam = searchParams.get("idea");
    const audienceParam = searchParams.get("audience");
    const scopeParam = searchParams.get("scope");
    const modelParam = searchParams.get("model");

    if (ideaParam) setIdea(decodeURIComponent(ideaParam));
    if (audienceParam) setTargetAudience(decodeURIComponent(audienceParam));
    if (scopeParam) setGeographicScope(decodeURIComponent(scopeParam));
    if (modelParam) setBusinessModel(decodeURIComponent(modelParam));
  }, [searchParams]);

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
        } catch (err) {
          const message = axios.isAxiosError(err) ? err.response?.data || err.message : err;
          console.error("Verification failed:", message);
        }
      };

      const timer = setTimeout(() => {
        verifyPayment();
      }, 1000);

      return () => clearTimeout(timer);
    } else if (paymentStatus === "failed") {
      const timer = window.setTimeout(() => setIsDialogOpen(true), 0);
      return () => window.clearTimeout(timer);
    }
  }, [paymentStatus, orderId]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    router.replace("/dashboard");
  };

  const { isPaid, tokensLeft, loading: planLoading } = useUserPlan();

  const handleAnalyze = async (mode: "full" | "stress" | "roast" = "full") => {
    if (!isPaid && tokensLeft <= 0) {
      alert("Intelligence Quota Depleted. Upgrade to Pro for unlimited scans.");
      router.push("/pricing");
      return;
    }

    setAnalysisMode(mode);
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
    <div className="space-y-10 animate-in fade-in duration-1000 max-w-6xl mx-auto pb-20">
      <BetaVersionDialog />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-none border-border bg-card/95 backdrop-blur-2xl">
          <DialogHeader className="flex flex-col items-center pt-6">
            <div className={`w-20 h-20 rounded-none flex items-center justify-center mb-6 shadow-2xl animate-in zoom-in-50 duration-500 ${
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
              <div className="p-5 rounded-none bg-accent/30 border border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-none bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Current Plan</p>
                    <p className="font-bold capitalize text-foreground">{verifiedData.planId} Edition</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-none bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                  Active
                </div>
              </div>

              <div className="p-5 rounded-none bg-accent/30 border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Order Identifier</p>
                <p className="font-mono text-sm text-foreground/80 break-all">{verifiedData.orderId}</p>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-center pb-6">
            <Button 
              onClick={handleCloseDialog}
              className={`w-full h-14 rounded-none text-lg font-bold transition-all active:scale-95 ${
                paymentStatus === 'success' 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white' 
                  : 'bg-rose-500 hover:bg-rose-400 text-white'
              }`}
            >
              Return to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-border/50">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
            Project Hub
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Design, analyze, and scale your next big idea.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-none bg-secondary/20 border border-secondary/30">
            <div className="w-2 h-2 rounded-none bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">AI Engine Online</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analysis Section */}
        <Card className="lg:col-span-2 border-none bg-card/50 overflow-hidden rounded-none">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="w-4 h-4" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Idea Lab</CardTitle>
            </div>
            <CardDescription className="text-base font-medium">
              Provide your concept details below to generate a comprehensive strategic report.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-8">
            <div className="space-y-3">
              <Label htmlFor="idea" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                The Concept
              </Label>
              <Textarea
                id="idea"
                className="min-h-[220px] p-6 bg-background/50 border-border/50 rounded-none text-lg font-medium leading-relaxed resize-none focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                placeholder="What problem are you solving? Explain your vision..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <Target className="w-3 h-3" />
                  Target Market
                </Label>
                <Select
                  value={targetAudience}
                  onValueChange={setTargetAudience}
                >
                  <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-none font-semibold">
                    <SelectValue placeholder="Choose Audience..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="b2b">B2B / Enterprises</SelectItem>
                    <SelectItem value="b2c">B2C / General Consumers</SelectItem>
                    <SelectItem value="developers">Developers / Technical Users</SelectItem>
                    <SelectItem value="creators">Creators / Influencers</SelectItem>
                    <SelectItem value="small-business">Small Business Owners</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  Market Scope
                </Label>
                <Select
                  value={geographicScope}
                  onValueChange={setGeographicScope}
                >
                  <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-none font-semibold">
                    <SelectValue placeholder="Global Reach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Global">Global Reach</SelectItem>
                    <SelectItem value="USA">USA / North America</SelectItem>
                    <SelectItem value="Europe">Europe</SelectItem>
                    <SelectItem value="India">India / Asia</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="MENA">Middle East / Africa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="bg-border/50" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">SWOT Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Risk Mapping</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => handleAnalyze("roast")}
                  disabled={loading || !idea.trim()}
                  className="h-12 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 px-6 rounded-none font-bold flex-1 sm:flex-none"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Roast Idea 💀"}
                </Button>

                <Button
                  onClick={() => handleAnalyze("full")}
                  disabled={loading || !idea.trim()}
                  className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-none font-bold flex-1 sm:flex-none group"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      Run Analysis
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Info Section */}
        <div className="space-y-6">
          <Card className="border-none bg-secondary/10 rounded-none">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Quick Config
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                  Business Model
                </Label>
                <Select
                  value={businessModel}
                  onValueChange={setBusinessModel}
                >
                  <SelectTrigger className="h-10 bg-background/30 border-border/30 rounded-none text-xs">
                    <SelectValue placeholder="Select Model..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subscription">SaaS / Subscription</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="one-time">One-time Purchase</SelectItem>
                    <SelectItem value="ads">Ad-supported</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2">
                  <Wallet className="w-3 h-3" />
                  Est. Budget
                </Label>
                <Select
                  value={budget}
                  onValueChange={setBudget}
                >
                  <SelectTrigger className="h-10 bg-background/30 border-border/30 rounded-none text-xs">
                    <SelectValue placeholder="Select Budget..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-1k">Under $1k</SelectItem>
                    <SelectItem value="1k-10k">$1k - $10k</SelectItem>
                    <SelectItem value="10k-50k">$10k - $50k</SelectItem>
                    <SelectItem value="50k-plus">$50k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="p-8 rounded-none bg-linear-to-br from-primary/10 to-secondary/10 border border-primary/20 space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Pro Tip
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "For the best results, include your unique selling proposition and how you plan to acquire your first 100 users."
            </p>
          </div>
        </div>
      </div>

      <LoadingDialog isOpen={loading} mode={analysisMode} idea={idea} />
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
