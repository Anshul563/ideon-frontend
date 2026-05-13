"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { History as HistoryIcon, Calendar, ArrowRight, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import type { IdeaRecord } from "@/lib/types";

export default function History() {
  const [ideas, setIdeas] = useState<IdeaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setIdeas(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
            Memory Bank
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Analysis History</h1>
        <p className="text-muted-foreground text-lg font-medium">Browse your past idea validations and strategic pivots</p>
      </header>

      <div className="grid gap-4">
        {ideas.length > 0 ? (
          ideas.map((item) => (
            <div 
              key={item.id} 
              onClick={() => router.push(`/result/${item.id}`)}
              className="bg-card hover:bg-accent/50 p-6 rounded-[24px] border border-border hover:border-primary/30 transition-all group flex items-center justify-between cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                  <Lightbulb className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors capitalize tracking-tight line-clamp-1">{item.idea}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <p className="text-[11px] font-bold uppercase tracking-wider">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })
                        : "Unknown date"}
                    </p>
                    <span className="text-muted-foreground/30">•</span>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-secondary px-2 py-0.5 rounded-md">
                      {item.mode} Mode
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Score</span>
                  <span className="text-xl font-black text-primary leading-none">
                    {item.result?.scoring?.totalScore || item.result?.scoring?.score || "N/A"}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all border border-border">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card p-20 rounded-[40px] border border-dashed border-border text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <HistoryIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">No history yet</h3>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-8">Start by analyzing your first idea on the overview page to build your portfolio.</p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Analyze New Idea
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

