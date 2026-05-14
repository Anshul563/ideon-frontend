"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users, 
  CreditCard, 
  Ticket, 
  TrendingUp, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  LayoutDashboard,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

import { useSearchParams, useRouter } from "next/navigation";

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") as "stats" | "users" | "payments" | "coupons" | "tickets" | null;
  const activeTab = tabParam || "stats";

  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Coupon Form
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    usageLimit: "100",
    expiresAt: ""
  });

  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(window.location.search);
    if (tab === "stats") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    router.push(`/admin?${params.toString()}`);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (activeTab === "stats") {
        const res = await axios.get(`${baseUrl}/api/admin/stats`, config);
        setStats(res.data);
      } else if (activeTab === "users") {
        const res = await axios.get(`${baseUrl}/api/admin/users`, config);
        setUsers(res.data);
      } else if (activeTab === "payments") {
        const res = await axios.get(`${baseUrl}/api/admin/payments`, config);
        setPayments(res.data);
      } else if (activeTab === "coupons") {
        const res = await axios.get(`${baseUrl}/api/admin/coupons`, config);
        setCoupons(res.data);
      } else if (activeTab === "tickets") {
        const res = await axios.get(`${baseUrl}/api/support/admin/tickets`, config);
        setTickets(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/coupons`,
        {
          ...newCoupon,
          discountValue: Number(newCoupon.discountValue),
          usageLimit: Number(newCoupon.usageLimit)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCoupon({ code: "", discountType: "percentage", discountValue: "", usageLimit: "100", expiresAt: "" });
      fetchData();
    } catch (error) {
      alert("Failed to create coupon");
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      alert("Failed to delete coupon");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <main className="max-w-7xl mx-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === "stats" && stats && (
            <motion.div 
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <Card className="bg-card/50 border-border/50 rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Total Revenue</CardTitle>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black">₹{stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Life-time processed volume</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Total Users</CardTitle>
                  <Users className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active registered accounts</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Transactions</CardTitle>
                  <CreditCard className="w-4 h-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black">{stats.totalTransactions}</div>
                  <p className="text-xs text-muted-foreground mt-1">Successful plan purchases</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div 
              key="users"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card/30 border border-border/50 rounded-3xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">User</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Plan</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Role</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-bold">{user.firstName} {user.lastName}</td>
                        <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.plan === 'free' ? 'bg-muted text-muted-foreground' : 'bg-primary/20 text-primary'}`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-bold uppercase">{user.role}</td>
                        <td className="p-4 text-xs text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "payments" && (
            <motion.div 
              key="payments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card/30 border border-border/50 rounded-3xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Order ID</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Plan</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-mono text-xs text-muted-foreground">{p.orderId}</td>
                        <td className="p-4 font-bold text-emerald-500">₹{p.amount}</td>
                        <td className="p-4 text-xs font-bold uppercase tracking-widest">{p.planId}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            {p.status === 'Success' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                            <span className={`text-[10px] font-bold uppercase ${p.status === 'Success' ? 'text-emerald-500' : 'text-red-500'}`}>{p.status}</span>
                          </div>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "coupons" && (
            <motion.div 
              key="coupons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Create Form */}
              <Card className="bg-card/50 border-border/50 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-xl font-black uppercase tracking-tighter">Create Coupon</CardTitle>
                  <CardDescription>Generate new discount codes for users</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Code</label>
                      <Input 
                        placeholder="IDEON20" 
                        value={newCoupon.code} 
                        onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                        className="bg-muted/50 border-border/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Type</label>
                      <select 
                        className="w-full h-10 px-3 rounded-md bg-muted/50 border border-border/50 text-sm font-mono"
                        value={newCoupon.discountType}
                        onChange={e => setNewCoupon({...newCoupon, discountType: e.target.value})}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed (₹)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Value</label>
                      <Input 
                        type="number" 
                        placeholder="20" 
                        value={newCoupon.discountValue}
                        onChange={e => setNewCoupon({...newCoupon, discountValue: e.target.value})}
                        className="bg-muted/50 border-border/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Limit</label>
                      <Input 
                        type="number" 
                        placeholder="100" 
                        value={newCoupon.usageLimit}
                        onChange={e => setNewCoupon({...newCoupon, usageLimit: e.target.value})}
                        className="bg-muted/50 border-border/50"
                        required
                      />
                    </div>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 h-10 rounded-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Create
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Coupons List */}
              <div className="bg-card/30 border border-border/50 rounded-3xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Code</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Discount</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Usage</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => (
                      <tr key={c.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-black tracking-widest text-primary">{c.code}</td>
                        <td className="p-4 text-sm">
                          {c.discountValue}{c.discountType === 'percentage' ? '%' : '₹'} Off
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {c.usageCount} / {c.usageLimit} Used
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.isActive === 'true' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                            {c.isActive === 'true' ? 'Active' : 'Expired'}
                          </span>
                        </td>
                        <td className="p-4">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteCoupon(c.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "tickets" && (
            <motion.div 
              key="tickets"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card/30 border border-border/50 rounded-3xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">User</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t) => (
                      <tr key={t.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                           <div className="flex flex-col">
                              <span className="font-bold text-sm">{t.name}</span>
                              <span className="text-[10px] text-muted-foreground">{t.email}</span>
                           </div>
                        </td>
                        <td className="p-4">
                           <span className="px-2 py-0.5 rounded-full bg-accent text-[10px] font-bold uppercase tracking-widest">
                              {t.category}
                           </span>
                        </td>
                        <td className="p-4 text-sm max-w-md truncate text-muted-foreground" title={t.message}>
                           {t.message}
                        </td>
                        <td className="p-4">
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              {t.status}
                           </span>
                        </td>
                        <td className="p-4 text-[10px] text-muted-foreground font-mono">
                           {new Date(t.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
