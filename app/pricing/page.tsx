"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Check, Star, Globe, Sparkles, Ticket, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const MotionCard = motion.create(Card);

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const router = useRouter();

  const plans = [
    {
      name: "Basic Plan",
      price: "0",
      period: "per month.",
      description:
        "Perfect for individuals or small teams looking to stay organized with basic features.",
      features: [
        "3 AI Analyses",
        "Basic task management",
        "Personal calendar",
        "Task reminders",
        "Collaboration with 3 team members",
        "Limited file storage (up to 1 GB)",
        "Access to mobile and desktop apps",
      ],
      id: "free",
      icon: <Globe className="w-6 h-6 text-muted-foreground" />,
      iconBg: "bg-muted",
      buttonText: "Start for free",
      buttonVariant: "secondary" as const,
      color: "text-muted-foreground",
      checkColor: "text-muted-foreground/60",
    },
    {
      name: "Pro",
      price: billingCycle === "monthly" ? "1" : "699",
      period: billingCycle === "monthly" ? "per month." : "per year.",
      billingNote: billingCycle === "yearly" ? "Billed annually" : "",
      description:
        "Ideal for growing teams needing more robust tools and integrations.",
      features: [
        "Unlimited Analyses",
        "Advanced task management",
        "Shared team calendar",
        "Unlimited team collaboration",
        "50 GB file storage",
        "Priority customer support",
        "Integrations with popular apps",
      ],
      id: billingCycle === "monthly" ? "monthly" : "yearly",
      icon: <Star className="w-6 h-6 text-primary-foreground" />,
      iconBg: "bg-linear-to-br from-primary to-primary/60",
      buttonText: "Get Pro",
      buttonVariant: "default" as const,
      popular: true,
      color: "text-primary",
      checkColor: "text-primary",
      gradient: "from-primary to-primary/40",
    },
    {
      name: "Enterprise",
      price: "999",
      period: "one-time",
      billingNote: "Billed once",
      description:
        "Designed for businesses requiring comprehensive, scalable management tools.",
      features: [
        "Everything in Yearly",
        "Custom solutions",
        "Unlimited file storage",
        "Advanced security",
        "Detailed analytics",
        "Dedicated account manager",
        "24/7 premium support",
      ],
      id: "lifetime",
      icon: <Sparkles className="w-6 h-6 text-accent-foreground" />,
      iconBg: "bg-linear-to-br from-accent to-accent/60",
      buttonText: "Get Enterprise",
      buttonVariant: "default" as const,
      color: "text-accent",
      checkColor: "text-accent",
      gradient: "from-accent to-accent/40",
    },
  ];

  const handleSubscribe = async (planId: string, amount: string) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Please login to upgrade your plan.");
      router.push("/login?redirect=/pricing");
      return;
    }

    if (planId === "free") {
      router.push("/dashboard");
      return;
    }

    setLoadingPlan(planId);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`,
        { amount, planId, couponCode: appliedCoupon?.code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.payment_url) {
        window.location.assign(res.data.payment_url);
      }
    } catch (error) {
      console.error("Payment failed", error);
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        router.push("/login?redirect=/pricing");
        return;
      }

      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          "Failed to initialize payment. Please try again."
        : "Failed to initialize payment. Please try again.";
      alert(msg);
    } finally {
      setLoadingPlan(null);
    }
  };

  const validateCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    try {
      const token = localStorage.getItem("token");
      // Pick a price to validate against (e.g. the Pro monthly price if we don't know the selection yet)
      // Actually, validation should just return the discount rules
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/validate-coupon`,
        { code: couponCode, amount: "100" }, // Dummy amount just to check validity
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppliedCoupon({...res.data, code: couponCode});
    } catch (error) {
      alert("Invalid or expired coupon");
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-24 px-6 relative overflow-hidden font-mono">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black tracking-tight mb-4 font-mono uppercase"
          >
            Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed font-mono"
          >
            Do more impactful work with a privacy first calendar that plugs into
            all your apps at work.
          </motion.p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-muted p-1 rounded-full flex items-center relative border border-border/50">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all relative z-10 font-mono uppercase tracking-widest ${
                billingCycle === "monthly"
                  ? "text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all relative z-10 font-mono uppercase tracking-widest ${
                billingCycle === "yearly"
                  ? "text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Yearly
            </button>
            <motion.div
              layoutId="toggle"
              className="absolute inset-y-1 bg-primary rounded-full shadow-lg"
              initial={false}
              animate={{
                x: billingCycle === "monthly" ? 0 : "100%",
                width: "50%",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const originalPrice = parseFloat(plan.price);
            let discount = 0;
            if (appliedCoupon && originalPrice > 0) {
              if (appliedCoupon.discountType === 'percentage') {
                discount = (originalPrice * appliedCoupon.discountValue) / 100;
              } else {
                discount = appliedCoupon.discountValue;
              }
            }
            const finalPrice = Math.max(0, originalPrice - discount).toFixed(originalPrice > 0 ? 0 : 0);

            return (
              <MotionCard
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative flex flex-col h-full bg-card border-border/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`p-3 rounded-2xl ${plan.iconBg} shadow-sm flex items-center justify-center`}
                    >
                      {plan.icon}
                    </div>
                    {plan.popular && (
                      <span className="px-3 py-1 rounded-full border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest font-mono">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-bold mb-2 font-mono uppercase">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-xs leading-relaxed font-mono">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-8 grow">
                  <div className="flex items-baseline gap-1.5 mb-8">
                    <div className="flex flex-col">
                      {discount > 0 && (
                        <span className="text-xs text-muted-foreground line-through opacity-50">₹{plan.price}</span>
                      )}
                      <span className="text-4xl font-black font-mono">
                        ₹{finalPrice}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs font-medium font-mono uppercase">
                      {plan.period}
                    </span>
                    {plan.billingNote && (
                      <span className="ml-auto text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded font-mono">
                        {plan.billingNote}
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <div className={`mt-1 shrink-0 ${plan.checkColor}`}>
                          <Check className="w-4 h-4 stroke-3" />
                        </div>
                        <span className="text-xs text-foreground/80 font-medium leading-tight font-mono">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {plan.id !== 'free' && (
                    <div className="mt-auto pt-4 border-t border-border/30">
                      {!appliedCoupon ? (
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Coupon Code" 
                            className="h-8 text-[10px] bg-muted/30 border-border/50 uppercase font-mono"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          />
                          <Button 
                            onClick={validateCoupon}
                            disabled={validatingCoupon || !couponCode}
                            className="h-8 text-[10px] px-3 font-bold uppercase tracking-widest"
                          >
                            Apply
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Ticket className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{appliedCoupon.code} Applied</span>
                          </div>
                          <button onClick={() => setAppliedCoupon(null)} className="text-muted-foreground hover:text-foreground">
                            <XCircle className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-8 pt-4">
                  <Button
                    onClick={() => handleSubscribe(plan.id, plan.price)}
                    disabled={loadingPlan !== null}
                    variant={plan.buttonVariant}
                    className={`w-full h-12 rounded-xl font-bold text-xs font-mono uppercase tracking-widest transition-all duration-300 ${
                      plan.gradient
                        ? `bg-linear-to-r ${plan.gradient} hover:opacity-90 shadow-lg shadow-primary/20`
                        : "bg-muted hover:bg-muted/80 text-muted-foreground border border-border/50"
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Processing</span>
                      </div>
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardFooter>
              </MotionCard>
            );
          })}
        </div>
      </div>
    </main>
  );
}
