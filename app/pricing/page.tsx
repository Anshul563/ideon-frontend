"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Check, Zap, Star, Rocket, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Perfect for trying out Ideon",
    features: ["3 AI Analyses", "Basic Roast Mode", "Community Support", "Standard Speed"],
    id: "free",
    icon: <Zap className="w-6 h-6 text-slate-400" />,
    color: "slate",
  },
  {
    name: "Monthly",
    price: "199",
    period: "/month",
    description: "Advanced tools for growing ideas",
    features: ["Unlimited Analyses", "All Roast & Stress Modes", "Priority Support", "2x Faster Processing", "Ad-Free Experience"],
    id: "monthly",
    icon: <Star className="w-6 h-6 text-indigo-400" />,
    color: "indigo",
    popular: true,
  },
  {
    name: "Yearly",
    price: "699",
    period: "/year",
    description: "Best value for dedicated founders",
    features: ["Unlimited Analyses", "All Roast & Stress Modes", "VIP Support", "Fastest Processing", "Custom Branding", "Early Access to Beta Features"],
    id: "yearly",
    icon: <Rocket className="w-6 h-6 text-amber-400" />,
    color: "amber",
  },
  {
    name: "Lifetime",
    price: "999",
    period: "one-time",
    description: "Own it forever, no recurring fees",
    features: ["Everything in Yearly", "Lifetime Updates", "Exclusive Founder Badge", "1-on-1 Consultation Call", "Priority Feature Requests"],
    id: "lifetime",
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    color: "emerald",
  },
];

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (planId: string, amount: string) => {
    if (planId === "free") {
      router.push("/dashboard");
      return;
    }

    setLoadingPlan(planId);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`,
        { amount, planId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.payment_url) {
        window.location.href = res.data.payment_url;
      }
    } catch (error: any) {
      console.error("Payment failed", error);
      const msg = error.response?.data?.message || "Failed to initialize payment. Please try again.";
      alert(msg);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tight text-white mb-4">Choose Your Plan</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Scale your ideas with professional AI tools. Select the perfect plan for your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative bg-slate-900/50 border-white/5 rounded-[32px] overflow-hidden transition-all hover:scale-105 hover:border-white/20 shadow-2xl ${
                plan.popular ? "ring-2 ring-indigo-500" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-indigo-500 py-1.5 text-center text-xs font-black uppercase tracking-widest text-white">
                  Most Popular
                </div>
              )}

              <CardHeader className={plan.popular ? "pt-8" : ""}>
                <div className="mb-4">{plan.icon}</div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-slate-400">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-white">₹{plan.price}</span>
                  <span className="text-slate-500 text-sm font-medium">{plan.period}</span>
                </div>

                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-8">
                <Button
                  onClick={() => handleSubscribe(plan.id, plan.price)}
                  disabled={loadingPlan !== null}
                  className={`w-full h-12 rounded-2xl font-bold transition-all ${
                    plan.id === "free"
                      ? "bg-slate-800 hover:bg-slate-700 text-white"
                      : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                  }`}
                >
                  {loadingPlan === plan.id
                    ? "Processing..."
                    : plan.id === "free"
                    ? "Back to Dashboard"
                    : "Upgrade Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}