"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { History as HistoryIcon, Calendar, ArrowRight, Lightbulb } from "lucide-react";

export default function History() {
  const [ideas, setIdeas] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setIdeas(res.data.data));
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <header>
        <div className="flex items-center gap-2 mb-2">
          <div className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
            Archive
          </div>
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-white">Analysis History</h1>
        <p className="text-slate-400 mt-2 text-lg">Browse your past idea validations and strategic pivots</p>
      </header>

      <div className="grid gap-6">
        {ideas.length > 0 ? (
          ideas.map((item) => (
            <div 
              key={item.id} 
              className="backdrop-blur-xl bg-slate-900/40 p-8 rounded-[32px] border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-slate-900/60 group flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20 group-hover:scale-110 transition-transform shadow-inner">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors capitalize tracking-tight">{item.idea}</h3>
                  <div className="flex items-center gap-3 mt-2 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <p className="text-xs font-medium">Validated on {new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="hidden md:block px-4 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-sm">
                  {item.result?.scoring?.verdict || "Analysis Complete"}
                </div>
                <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-400 transition-all flex items-center justify-center border border-white/5 group-hover:translate-x-1">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="backdrop-blur-xl bg-slate-900/40 p-24 rounded-[48px] border border-white/5 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-[32px] bg-slate-950/60 border border-white/5 flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <HistoryIcon className="w-10 h-10 text-slate-700" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-2">No history yet</h3>
            <p className="text-slate-500 font-medium text-lg max-w-sm mx-auto">Start by analyzing your first idea on the overview page to build your portfolio.</p>
          </div>
        )}
      </div>
    </div>
  );
}
