"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Link as LinkIcon,
  Palette,
  Eye,
  Type,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface Announcement {
  id: number;
  content: string;
  isActive: string;
  bgColor: string;
  textColor: string;
  link?: string;
  createdAt: string;
}

const COLOR_PRESETS = [
  { name: "Ocean", bg: "#0EA5E9", text: "#FFFFFF" },
  { name: "Forest", bg: "#10B981", text: "#FFFFFF" },
  { name: "Sunset", bg: "#F59E0B", text: "#FFFFFF" },
  { name: "Danger", bg: "#EF4444", text: "#FFFFFF" },
  { name: "Royal", bg: "#6366F1", text: "#FFFFFF" },
  { name: "Dark", bg: "#0F172A", text: "#FFFFFF" },
  { name: "Ghost", bg: "#F8FAF8", text: "#0F172A" },
];

const TEXT_TEMPLATES = [
  { label: "Flash Sale", text: "⚡ FLASH SALE! Get 50% OFF on all yearly plans. Use code: <span className='font-black underline'>SALE50</span>" },
  { label: "New Feature", text: "🚀 NEW FEATURE: Advanced Architecture Blueprints are now live for Pro users!" },
  { label: "Maintenance", text: "🛠️ SYSTEM UPDATE: Scheduled maintenance on May 20th, 02:00 AM UTC." },
  { label: "Limited Offer", text: "🎁 LIMITED TIME: Register today and get 5 free analysis tokens!" },
  { label: "Discount", text: "💎 Premium Features at just $19/mo. Limited time discount applied!" },
];

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Failed to fetch announcements", error);
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements`,
        { content: "New announcement", isActive: "false", bgColor: "#4F46E5", textColor: "#FFFFFF" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnnouncements([res.data, ...announcements]);
      setMessage({ type: "success", text: "Draft created!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create announcement." });
    }
  };

  const updateItem = async (id: number, data: Partial<Announcement>) => {
    setUpdating(id);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnnouncements(announcements.map(a => a.id === id ? { ...a, ...data } : a));
      setMessage({ type: "success", text: "Saved successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save." });
    } finally {
      setUpdating(null);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(announcements.filter(a => a.id !== id));
      setMessage({ type: "success", text: "Deleted." });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete." });
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
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-primary" />
            Announcements
          </h1>
          <p className="text-muted-foreground mt-2">Manage global app notifications and coupon highlights.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={fetchAnnouncements} className="uppercase font-bold tracking-widest text-[10px]">
            <RefreshCw className="w-3 h-3 mr-2" />
            Refresh
          </Button>
          <Button onClick={createAnnouncement} size="sm" className="uppercase font-bold tracking-widest text-[10px]">
            <Plus className="w-3 h-3 mr-2" />
            Create New
          </Button>
        </div>
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

      <div className="space-y-6">
        {announcements.map((a) => (
          <Card key={a.id} className="bg-card border-border/50 overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center font-bold text-xs">
                     {a.id}
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Status</span>
                     <div className="flex items-center gap-2">
                        <Switch 
                          checked={a.isActive === "true"}
                          onCheckedChange={(val: boolean) => updateItem(a.id, { isActive: val ? "true" : "false" })}
                        />
                        <span className={`text-[10px] font-bold uppercase ${a.isActive === "true" ? "text-primary" : "text-muted-foreground"}`}>
                          {a.isActive === "true" ? "Live" : "Draft"}
                        </span>
                     </div>
                   </div>
                </div>
                <div className="flex gap-2">
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     onClick={() => deleteItem(a.id)}
                     className="text-muted-foreground hover:text-destructive"
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Type className="w-3 h-3" /> Content (HTML)
                          </label>
                          <div className="flex items-center gap-1">
                             <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                             <span className="text-[8px] font-bold uppercase text-primary tracking-widest">Quick Templates</span>
                          </div>
                        </div>
                        <Input 
                          value={a.content}
                          onChange={(e) => setAnnouncements(announcements.map(item => item.id === a.id ? { ...item, content: e.target.value } : item))}
                          onBlur={() => updateItem(a.id, { content: a.content })}
                          className="font-bold text-sm bg-muted/20 h-12"
                        />
                        <div className="flex flex-wrap gap-2">
                           {TEXT_TEMPLATES.map((tmpl, idx) => (
                             <button
                               key={idx}
                               onClick={() => updateItem(a.id, { content: tmpl.text })}
                               className="px-2 py-1 bg-accent/30 border border-border text-[8px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                             >
                               {tmpl.label}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                          <LinkIcon className="w-3 h-3" /> Target Link (Optional)
                        </label>
                        <Input 
                          value={a.link || ""}
                          onChange={(e) => setAnnouncements(announcements.map(item => item.id === a.id ? { ...item, link: e.target.value } : item))}
                          onBlur={() => updateItem(a.id, { link: a.link })}
                          placeholder="https://..."
                          className="font-bold text-sm bg-muted/20"
                        />
                     </div>
                  </div>
                  
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Palette className="w-3 h-3" /> Theme Presets
                        </label>
                        <div className="flex flex-wrap gap-3">
                           {COLOR_PRESETS.map((p, idx) => (
                             <button
                               key={idx}
                               onClick={() => updateItem(a.id, { bgColor: p.bg, textColor: p.text })}
                               style={{ backgroundColor: p.bg, color: p.text }}
                               className="w-10 h-10 rounded-none border-2 border-border/50 flex items-center justify-center hover:scale-110 transition-transform shadow-lg group relative"
                               title={p.name}
                             >
                                <span className="text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">Set</span>
                             </button>
                           ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                           <div className="flex gap-2 items-center p-2 bg-muted/20 border border-border">
                              <Input 
                                type="color"
                                value={a.bgColor}
                                onChange={(e) => setAnnouncements(announcements.map(item => item.id === a.id ? { ...item, bgColor: e.target.value } : item))}
                                onBlur={() => updateItem(a.id, { bgColor: a.bgColor })}
                                className="w-8 h-8 p-0 bg-transparent border-none cursor-pointer"
                              />
                              <span className="text-[9px] font-black uppercase tracking-widest opacity-50">BG: {a.bgColor}</span>
                           </div>
                           <div className="flex gap-2 items-center p-2 bg-muted/20 border border-border">
                              <Input 
                                type="color"
                                value={a.textColor}
                                onChange={(e) => setAnnouncements(announcements.map(item => item.id === a.id ? { ...item, textColor: e.target.value } : item))}
                                onBlur={() => updateItem(a.id, { textColor: a.textColor })}
                                className="w-8 h-8 p-0 bg-transparent border-none cursor-pointer"
                              />
                              <span className="text-[9px] font-black uppercase tracking-widest opacity-50">TX: {a.textColor}</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                          <Eye className="w-3 h-3" /> Real-time Preview
                        </label>
                        <div 
                          style={{ backgroundColor: a.bgColor, color: a.textColor }}
                          className="px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] border border-border/30 flex items-center justify-center min-h-[60px] text-center shadow-inner"
                        >
                          <div dangerouslySetInnerHTML={{ __html: a.content }} />
                        </div>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
        
        {announcements.length === 0 && (
          <div className="text-center py-20 bg-muted/20 border-2 border-dashed border-border">
             <Megaphone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
             <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">No announcements created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
