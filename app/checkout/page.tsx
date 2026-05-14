"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Zap, 
  Star, 
  ArrowRight,
  Ticket,
  XCircle,
  AlertCircle,
  TrendingUp,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("planId");
  
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans`);
        setPlans(res.data);
        if (planId) {
          const plan = res.data.find((p: any) => p.id === planId);
          setSelectedPlan(plan);
        }
      } catch (err) {
        console.error("Failed to load plans", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [planId]);

  const validateCoupon = async () => {
    if (!couponCode) return;
    setIsValidating(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/validate-coupon`,
        { code: couponCode, amount: selectedPlan?.amount || "0" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppliedCoupon({ ...res.data, code: couponCode });
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired coupon code.");
      setAppliedCoupon(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    setIsProcessing(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`,
        { 
          amount: selectedPlan.amount, 
          planId: selectedPlan.id, 
          couponCode: appliedCoupon?.code 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.payment_url) {
        window.location.assign(res.data.payment_url);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to initialize payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background font-mono p-6">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Invalid Plan</h2>
        <p className="text-muted-foreground mb-6">The plan you selected is not available.</p>
        <Button onClick={() => router.push("/pricing")} variant="outline" className="uppercase font-bold tracking-widest text-[10px]">
          Back to Pricing
        </Button>
      </div>
    );
  }

  const discountAmount = appliedCoupon 
    ? (appliedCoupon.discountType === "percentage" 
        ? (parseFloat(selectedPlan.amount) * appliedCoupon.discountValue) / 100 
        : appliedCoupon.discountValue)
    : 0;
  
  const finalPrice = Math.max(0, parseFloat(selectedPlan.amount) - discountAmount).toFixed(2);

  const upsellPlan = selectedPlan.id === 'monthly' 
    ? plans.find(p => p.id === 'yearly')
    : selectedPlan.id === 'yearly' 
    ? plans.find(p => p.id === 'lifetime') 
    : null;

  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-6 font-mono selection:bg-primary/30">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Order Details */}
          <div className="lg:col-span-7 space-y-8">
            <section>
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-primary" />
                Checkout
              </h1>
              
              <div className="bg-card border border-border/50 p-6 rounded-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-8 -mt-8 rotate-45 group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-1 block">Selected Plan</span>
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tight">{selectedPlan.name}</h2>
                      <p className="text-muted-foreground text-xs mt-1">Unlimited AI Analysis & Full Blueprint Access</p>
                    </div>
                    <div className="text-right">
                       <span className="text-2xl font-black">₹{selectedPlan.amount}</span>
                       <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-widest">/{selectedPlan.period}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Upsell Section */}
            {upsellPlan && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/5 border-2 border-dashed border-primary/20 p-6 rounded-none relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <TrendingUp className="w-4 h-4 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary">Limited Time Offer</span>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-tight">Upgrade to {upsellPlan.name} & Save Big</h3>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-wider">
                      {selectedPlan.id === 'monthly' ? "Save 40% with the yearly billing cycle." : "Never pay for another AI analysis again."}
                    </p>
                  </div>
                  <Button 
                    onClick={() => setSelectedPlan(upsellPlan)}
                    variant="outline" 
                    className="shrink-0 bg-background hover:bg-primary hover:text-primary-foreground border-primary text-[10px] font-black uppercase tracking-widest px-4"
                  >
                    Upgrade Now
                  </Button>
                </div>
              </motion.div>
            )}

            <section className="space-y-4">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Summary</h3>
               <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-muted-foreground">Base Price</span>
                    <span>₹{selectedPlan.amount}</span>
                  </div>
                  {appliedCoupon && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-between text-xs font-bold uppercase tracking-wider text-emerald-500"
                    >
                      <span className="flex items-center gap-1">
                        <Ticket className="w-3 h-3" /> Discount ({appliedCoupon.code})
                      </span>
                      <span>-₹{(discountAmount || 0).toFixed(2)}</span>
                    </motion.div>
                  )}
                  <div className="h-px bg-border/50" />
                  <div className="flex justify-between text-lg font-black uppercase tracking-tight pt-2">
                    <span>Total Due</span>
                    <span className="text-primary">₹{finalPrice}</span>
                  </div>
               </div>
            </section>
          </div>

          {/* Right Side: Payment Actions */}
          <div className="lg:col-span-5 lg:sticky lg:top-12">
            <Card className="rounded-none border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden">
               <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Payment Method</label>
                    <div className="p-4 border-2 border-primary bg-primary/5 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-none">
                             <CreditCard className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">ZapUPI Gateway</span>
                       </div>
                       <Zap className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Apply Promo Code</label>
                    <div className="flex gap-2">
                       <Input 
                        placeholder="COUPON50"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="h-12 bg-muted/20 rounded-none border-border/50 font-black uppercase tracking-widest text-sm"
                       />
                       <Button 
                        onClick={validateCoupon}
                        disabled={isValidating || !couponCode}
                        className="h-12 px-6 rounded-none font-black uppercase tracking-widest text-[10px]"
                       >
                         {isValidating ? "..." : "Apply"}
                       </Button>
                    </div>
                    {error && (
                      <p className="text-[10px] font-bold text-destructive flex items-center gap-1.5 uppercase tracking-wider">
                        <XCircle className="w-3 h-3" /> {error}
                      </p>
                    )}
                    {appliedCoupon && (
                      <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
                        <Check className="w-3 h-3" /> Coupon Applied Successfully!
                      </p>
                    )}
                  </div>

                  <Button 
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-none font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Complete Payment <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1 text-muted-foreground/50">
                       <ShieldCheck className="w-3 h-3" />
                       <span className="text-[8px] font-black uppercase tracking-widest">SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground/50">
                       <Zap className="w-3 h-3" />
                       <span className="text-[8px] font-black uppercase tracking-widest">Instant Activation</span>
                    </div>
                  </div>
               </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold max-w-[300px] mx-auto leading-relaxed">
                By completing your purchase, you agree to Ideon's <span className="text-foreground underline">Terms of Service</span> and <span className="text-foreground underline">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
