"use client";

import { useState, useEffect } from "react";
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

import { PLAN_FEATURES, PLAN_DESCRIPTIONS } from "@/lib/plan-rules";

const MotionCard = motion.create(Card);

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [dbPlans, setDbPlans] = useState<any[]>([]);
  const [loadingDbPlans, setLoadingDbPlans] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans`,
        );
        setDbPlans(res.data);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setLoadingDbPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const getPlanData = (id: string) => {
    const plan = dbPlans.find((p) => p.id === id);
    if (!plan) return null;

    const planConfig: any = {
      free: {
        icon: <Globe className="w-6 h-6 text-muted-foreground" />,
        iconBg: "bg-muted",
        buttonVariant: "secondary" as const,
        color: "text-muted-foreground",
        checkColor: "text-muted-foreground/60",
        features: PLAN_FEATURES.free,
        description: PLAN_DESCRIPTIONS.free,
      },
      monthly: {
        icon: <Star className="w-6 h-6 text-primary-foreground" />,
        iconBg: "bg-linear-to-br from-primary to-primary/60",
        buttonVariant: "default" as const,
        popular: false,
        color: "text-primary",
        checkColor: "text-primary",
        gradient: "from-primary to-primary/40",
        features: PLAN_FEATURES.monthly,
        description: PLAN_DESCRIPTIONS.monthly,
      },
      yearly: {
        icon: <Star className="w-6 h-6 text-primary-foreground" />,
        iconBg: "bg-linear-to-br from-primary to-primary/60",
        buttonVariant: "default" as const,
        popular: true,
        color: "text-primary",
        checkColor: "text-primary",
        gradient: "from-primary to-primary/40",
        features: PLAN_FEATURES.yearly,
        description: PLAN_DESCRIPTIONS.yearly,
      },
      lifetime: {
        icon: <Sparkles className="w-6 h-6 text-accent-foreground" />,
        iconBg: "bg-linear-to-br from-accent to-accent/60",
        buttonVariant: "default" as const,
        color: "text-accent",
        checkColor: "text-accent",
        gradient: "from-accent to-accent/40",
        features: PLAN_FEATURES.lifetime,
        description: PLAN_DESCRIPTIONS.lifetime,
      },
    };

    return { ...plan, ...planConfig[id] };
  };

  const activePlans = [
    getPlanData("free"),
    billingCycle === "monthly" ? getPlanData("monthly") : getPlanData("yearly"),
    getPlanData("lifetime"),
  ].filter(Boolean);

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

    router.push(`/checkout?planId=${planId}`);
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
            Launch your next big idea with the right tools and deep AI insights.
          </motion.p>
        </div>

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

        {loadingDbPlans ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activePlans.map((plan, index) => {
              const originalPrice = parseFloat(plan.amount);
              const finalPrice = Math.max(0, originalPrice).toFixed(0);

              return (
                <MotionCard
                  key={plan.id}
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

                  <CardContent className="px-8 grow flex flex-col">
                    <div className="flex items-baseline gap-1.5 mb-8">
                      <span className="text-4xl font-black font-mono">
                        ₹{finalPrice}
                      </span>
                      <span className="text-muted-foreground text-xs font-medium font-mono uppercase">
                        {plan.period}
                      </span>
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature: string) => (
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
                  </CardContent>

                  <CardFooter className="p-8 pt-4">
                    <Button
                      onClick={() => handleSubscribe(plan.id, plan.amount)}
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
                        plan.buttonText ||
                        (plan.id === "free" ? "Start for Free" : "Get Started")
                      )}
                    </Button>
                  </CardFooter>
                </MotionCard>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
