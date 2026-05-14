"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Save, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Plan {
  id: string;
  name: string;
  amount: string;
  period: string;
  updatedAt: string;
}

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans`);
      setPlans(res.data);
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (id: string, newAmount: string) => {
    setPlans(plans.map(p => p.id === id ? { ...p, amount: newAmount } : p));
  };

  const updatePlan = async (id: string, amount: string) => {
    setUpdating(id);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans/${id}`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "success", text: "Plan updated successfully!" });
    } catch (error) {
      console.error("Failed to update plan", error);
      setMessage({ type: "error", text: "Failed to update plan." });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 font-mono">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground mt-2">Manage plan amounts and pricing details.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchPlans} className="uppercase font-bold tracking-widest text-[10px]">
          <RefreshCw className="w-3 h-3 mr-2" />
          Refresh
        </Button>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 border ${
            message.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-xs font-bold uppercase">{message.text}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="bg-card border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-black uppercase tracking-wider">{plan.name}</CardTitle>
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-widest">
                  {plan.id}
                </span>
              </div>
              <CardDescription className="text-xs">{plan.period}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount (₹)</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={plan.amount}
                    onChange={(e) => handleAmountChange(plan.id, e.target.value)}
                    className="font-black text-xl h-12 bg-muted/20"
                  />
                  <Button
                    onClick={() => updatePlan(plan.id, plan.amount)}
                    disabled={updating === plan.id}
                    className="h-12 px-6"
                  >
                    {updating === plan.id ? (
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="pt-2 border-t border-border/30 flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Last Updated</span>
                <span className="text-[10px] font-medium">{new Date(plan.updatedAt).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
