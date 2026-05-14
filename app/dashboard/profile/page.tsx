"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Sparkles, 
  Camera, 
  CreditCard, 
  Zap, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UploadButton } from "@/lib/uploadthing";
import axios from "axios";
import type { UserProfile } from "@/lib/types";
import Link from "next/link";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ContactSupportDialog } from "@/components/ContactSupportDialog";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/latest`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const payment = res.data;
      const doc = new jsPDF();

      // Invoice Header
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.text("INVOICE", 105, 20, { align: "center" });
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("IDEON AI PLATFORM", 14, 30);
      doc.text("Date: " + new Date().toLocaleDateString(), 14, 35);
      doc.text("Invoice #: INV-" + payment.orderId, 14, 40);

      // Customer Info
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Bill To:", 14, 55);
      doc.setFontSize(10);
      doc.text(`${user?.firstName} ${user?.lastName || ""}`, 14, 62);
      doc.text(user?.email || "", 14, 67);

      // Invoice Content
      autoTable(doc, {
        startY: 80,
        head: [['Description', 'Plan ID', 'Amount', 'Status']],
        body: [
          [`Subscription Plan Upgrade - ${payment.planId}`, payment.planId, `INR ${payment.amount}`, payment.status],
          ['Discount Applied', '-', `-INR ${payment.discountAmount || 0}`, 'Applied']
        ],
        foot: [['Total', '', `INR ${payment.amount}`, '']],
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] }, // Indigo color
      });

      // Footer (Bottom of the page)
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 30;
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("Thank you for choosing Ideon!", 105, footerY, { align: "center" });
      doc.text("Visit ideon.ai for more details.", 105, footerY + 7, { align: "center" });

      doc.save(`Invoice_${payment.orderId}.pdf`);
    } catch (err) {
      console.error("Failed to download invoice:", err);
      alert("Failed to download invoice. Please try again later.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const isPaid = user?.plan && user.plan !== "free";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-card border border-border p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 -mr-32 -mt-32 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 -ml-24 -mb-24 blur-3xl rounded-full" />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-none bg-accent/50 flex items-center justify-center border border-primary/20 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-16 w-16 text-primary/40" />
              )}
            </div>
            <div className="absolute -bottom-3 -right-3">
               <UploadButton
                  endpoint="profilePicture"
                  onClientUploadComplete={async (res) => {
                    if (res && res[0]) {
                      try {
                        await axios.post(
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/update-profile-pic`,
                          { url: res[0].url },
                          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                        );
                        fetchProfile();
                      } catch (err) {
                        console.error("Failed to update profile pic:", err);
                      }
                    }
                  }}
                  appearance={{
                    button: "h-12 w-12 rounded-none bg-primary text-primary-foreground shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-card p-0",
                    allowedContent: "hidden",
                  }}
                  content={{
                    button: <Camera className="w-5 h-5" />
                  }}
                />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-muted-foreground font-medium mt-1">{user?.email}</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <div className="px-4 py-1.5 rounded-none bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 fill-current" />
                {user?.plan} Plan
              </div>
              <div className="px-4 py-1.5 rounded-none bg-accent border border-border text-foreground/70 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                Verified Account
              </div>
            </div>
          </div>

          <Link href="/pricing">
            <Button size="lg" className="rounded-none font-black uppercase tracking-widest px-8 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1">
              {isPaid ? "Manage Plan" : "Upgrade to Pro"}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Account Details */}
        <div className="md:col-span-2 space-y-8">
          <section className="bg-card border border-border overflow-hidden shadow-xl">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-widest text-foreground flex items-center gap-3">
                <Settings className="w-5 h-5 text-primary" />
                Account Security
              </h3>
            </div>
            <div className="p-8 grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Address</p>
                <div className="flex items-center gap-3 p-3 bg-accent/30 border border-border group">
                  <Mail className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-bold truncate">{user?.email}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Account Status</p>
                <div className="flex items-center gap-3 p-3 bg-accent/30 border border-border group">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-bold">Active & Secure</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Member Since</p>
                <div className="flex items-center gap-3 p-3 bg-accent/30 border border-border group">
                  <Calendar className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-bold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "April 2024"}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Two-Factor Auth</p>
                <div className="flex items-center gap-3 p-3 bg-accent/30 border border-border group justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-500 uppercase tracking-tighter">Enabled</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] uppercase font-black tracking-widest">Edit</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Usage Stats */}
          <section className="bg-card border border-border overflow-hidden shadow-xl">
             <div className="px-8 py-6 border-b border-border">
                <h3 className="text-lg font-black uppercase tracking-widest text-foreground flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Usage & Credits
                </h3>
             </div>
             <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Daily Quota</p>
                      <h4 className="text-3xl font-black tracking-tighter">
                        {isPaid ? "Unlimited" : `${user?.tokensLeft} / 3`}
                      </h4>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">Resets at midnight UTC</p>
                  </div>
                  {!isPaid && (
                    <div className="w-full h-3 bg-accent rounded-none overflow-hidden border border-border">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                        style={{ width: `${((user?.tokensLeft || 0) / 3) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                   <div className="p-4 bg-primary/5 border border-primary/10 flex flex-col gap-1">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">Total Analyses</span>
                      <span className="text-2xl font-black tracking-tighter">12</span>
                   </div>
                   <div className="p-4 bg-accent/30 border border-border flex flex-col gap-1">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Avg Idea Score</span>
                      <span className="text-2xl font-black tracking-tighter text-emerald-500">7.8</span>
                   </div>
                </div>
             </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <section className="bg-card border border-border overflow-hidden shadow-xl">
             <div className="p-1 bg-primary" />
             <div className="p-8 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase tracking-widest text-foreground flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Subscription
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">Detailed billing information</p>
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Plan</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black tracking-tight capitalize text-primary">{user?.plan}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border ${
                          user?.subscriptionStatus === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                        }`}>
                          {user?.subscriptionStatus || 'Inactive'}
                        </span>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Plan Purchase Date</p>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-primary/60" />
                        <span className="text-sm font-bold">
                          {user?.subscriptionStartedAt ? new Date(user.subscriptionStartedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : (user?.plan !== 'free' ? 'Recently' : 'None')}
                        </span>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Plan Expire Date</p>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-primary/60" />
                        <span className="text-sm font-bold">
                          {user?.subscriptionEndsAt ? new Date(user.subscriptionEndsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "None"}
                        </span>
                      </div>
                   </div>

                   <Separator className="bg-border/50" />

                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Quick Actions</p>
                      <div className="grid gap-2">
                        <Button variant="outline" className="rounded-none justify-between h-10 group border-border hover:bg-accent">
                          <span className="text-xs font-black uppercase tracking-widest">Billing Portal</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button 
                          variant="outline" 
                          className="rounded-none justify-between h-10 group border-border hover:bg-accent"
                          onClick={handleDownloadInvoice}
                        >
                          <span className="text-xs font-black uppercase tracking-widest">Download Invoices</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          <div className="p-8 bg-linear-to-br from-primary to-primary/80 border border-primary/20 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 blur-2xl rounded-full" />
            <div className="relative space-y-4">
               <h4 className="text-primary-foreground font-black uppercase tracking-widest text-sm">Need Help?</h4>
               <p className="text-primary-foreground/70 text-xs font-medium leading-relaxed">
                 Our support team is available 24/7 to help you with your account and technical queries.
               </p>
               <ContactSupportDialog user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
