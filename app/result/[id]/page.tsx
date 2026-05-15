"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import IdeaResult from "../../../components/IdeaResult";
import StressResult from "../../../components/StressResult";
import RoastResult from "../../../components/RoastResult";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Sparkles, 
  Loader2, 
  Flame, 
  BarChart4,
  Skull,
  ShieldCheck
} from "lucide-react";
import LoadingDialog from "../../../components/LoadingDialog";
import { ComingSoonDialog } from "../../../components/ComingSoonDialog";
import { useUserPlan } from "@/hooks/useUserPlan";
import { Lock } from "lucide-react";
import type {
  BetterVersion,
  Competitor,
  IdeaRecord,
  Improvement,
  RiskItem,
  RoastItem,
} from "@/lib/types";

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<IdeaRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<"full" | "stress" | "roast">("full");
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const { isPaid } = useUserPlan();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        setData(res.data);

        // If still pending, start polling
        if (res.data.status === "pending") {
          intervalId = setInterval(async () => {
            try {
              const token = localStorage.getItem("token");
              const statusRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/status/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              });

              if (statusRes.data.status === "completed") {
                // Fetch full data once completed
                const fullRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/${id}`, {
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setData(fullRes.data);
                clearInterval(intervalId);
              } else if (statusRes.data.status === "failed") {
                clearInterval(intervalId);
                // Handle failure if needed
              }
            } catch (err) {
              console.error("Polling error:", err);
            }
          }, 3000); // Poll every 3 seconds
        }
      } catch (error) {
        console.error("Failed to fetch result:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResult();
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!data) return;
    setIsAnalyzing(true);

    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF("p", "mm", "a4");

      const PAGE_W = 210;
      const MARGIN = 14;
      const CONTENT_W = PAGE_W - MARGIN * 2;
      const PAGE_H = 297;
      let y = MARGIN;

      // ── Helpers ──────────────────────────────────────────────────────────────
      const checkNewPage = (neededHeight = 10) => {
        if (y + neededHeight > PAGE_H - 20) {
          pdf.addPage();
          y = MARGIN;
        }
      };

      const drawSection = (title: string) => {
        checkNewPage(14);
        pdf.setFillColor(30, 41, 59);
        pdf.roundedRect(MARGIN, y, CONTENT_W, 8, 2, 2, "F");
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(148, 163, 184);
        pdf.text(title.toUpperCase(), MARGIN + 4, y + 5.5);
        y += 12;
      };

      const drawText = (text: string, size = 10, color: [number, number, number] = [203, 213, 225], bold = false) => {
        pdf.setFontSize(size);
        pdf.setFont("helvetica", bold ? "bold" : "normal");
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(text || "", CONTENT_W);
        checkNewPage(lines.length * (size * 0.4));
        pdf.text(lines, MARGIN, y);
        y += lines.length * (size * 0.4) + 2;
      };

      const drawKeyValue = (label: string, value: string | number, valueColor: [number, number, number] = [203, 213, 225]) => {
        checkNewPage(8);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(100, 116, 139);
        pdf.text(label.toUpperCase(), MARGIN, y);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...valueColor);
        pdf.text(String(value ?? ""), MARGIN + 40, y);
        y += 6;
      };

      const drawScoreBar = (label: string, score: number) => {
        checkNewPage(10);
        const barW = CONTENT_W - 44;
        const filled = (score / 10) * barW;
        const scoreColor: [number, number, number] = score >= 8 ? [96, 165, 250] : score >= 5 ? [148, 163, 184] : [248, 113, 113];

        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(148, 163, 184);
        pdf.text(label.charAt(0).toUpperCase() + label.slice(1), MARGIN, y + 3);

        pdf.setFillColor(30, 41, 59);
        pdf.roundedRect(MARGIN + 38, y - 1, barW, 5, 1, 1, "F");
        pdf.setFillColor(...scoreColor);
        if (filled > 0) pdf.roundedRect(MARGIN + 38, y - 1, filled, 5, 1, 1, "F");

        pdf.setFontSize(8);
        pdf.setTextColor(...scoreColor);
        pdf.text(`${score}/10`, MARGIN + 38 + barW + 2, y + 3);
        y += 8;
      };

      // ── Background ───────────────────────────────────────────────────────────
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, PAGE_W, PAGE_H, "F");

      // ── Header ───────────────────────────────────────────────────────────────
      pdf.setFillColor(30, 41, 59);
      pdf.roundedRect(MARGIN, y, CONTENT_W, 28, 3, 3, "F");
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(96, 165, 250);
      pdf.text("✦ IDEON INTELLIGENCE · AI ANALYSIS REPORT", MARGIN + 4, y + 8);
      pdf.setFontSize(14);
      pdf.setTextColor(248, 250, 252);
      const ideaLines = pdf.splitTextToSize(data.idea || "", CONTENT_W - 8);
      pdf.text(ideaLines, MARGIN + 4, y + 16);
      y += 32;

      // Date + mode
      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        `Generated on ${new Date(data.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}   ·   Mode: ${(data.mode || "full").toUpperCase()}`,
        MARGIN, y
      );
      y += 10;

      // ── Overall Score ─────────────────────────────────────────────────────────
      const overall = data.result?.scoring?.scores?.overall ?? 0;
      const scoreColor: [number, number, number] = overall >= 8 ? [96, 165, 250] : overall >= 5 ? [148, 163, 184] : [248, 113, 113];
      pdf.setFillColor(30, 41, 59);
      pdf.roundedRect(MARGIN, y, CONTENT_W, 22, 3, 3, "F");
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...scoreColor);
      pdf.text(`${overall}/10`, MARGIN + 4, y + 14);
      pdf.setFontSize(10);
      pdf.setTextColor(248, 250, 252);
      pdf.text(data.result?.scoring?.verdict || "", MARGIN + 28, y + 10);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 116, 139);
      const reasonLines = pdf.splitTextToSize(data.result?.scoring?.reason || "", CONTENT_W - 32);
      pdf.text(reasonLines, MARGIN + 28, y + 16);
      y += 28;

      // ── Full Analysis Sections ─────────────────────────────────────────────────
      if (data.mode === "full" || !data.mode) {
        // Validation Scores
        drawSection("Validation Scores");
        const scores = data.result?.scoring?.scores || {};
        Object.entries(scores).filter(([k]) => k !== "overall").forEach(([k, v]) => drawScoreBar(k, v as number));
        y += 4;

        // Idea Overview
        drawSection("Idea Overview");
        drawText(data.result?.expanded?.expanded_idea || "", 9);
        y += 2;
        drawKeyValue("Core Problem", data.result?.expanded?.core_problem || "");
        drawKeyValue("Target Users", data.result?.expanded?.target_users || "");
        y += 4;

        // Market
        drawSection("Market Demand");
        drawKeyValue("Demand Level", data.result?.market?.demand_level || "");
        drawText(data.result?.market?.reason || "", 9);
        y += 4;

        // Competitors
        if (data.result?.competitors?.length) {
          drawSection("Competitive Landscape");
          data.result.competitors.forEach((c: Competitor, i: number) => {
            checkNewPage(18);
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(248, 250, 252);
            pdf.text(`${i + 1}. ${c.name}${c.website ? "  ·  " + c.website : ""}`, MARGIN, y);
            y += 5;
            drawText(c.description ?? "", 8.5);
            if (c.weakness) {
              pdf.setFontSize(8);
              pdf.setFont("helvetica", "italic");
              pdf.setTextColor(248, 113, 113);
              const wLines = pdf.splitTextToSize(`⚠ Vulnerability: ${c.weakness}`, CONTENT_W);
              pdf.text(wLines, MARGIN, y);
              y += wLines.length * 4 + 2;
            }
            y += 2;
          });
        }

        // Features
        if (data.result?.improvements?.improvements?.length) {
          drawSection("Essential Features");
          data.result.improvements.improvements.forEach((imp: Improvement) => {
            checkNewPage(12);
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(96, 165, 250);
            pdf.text(`✓ ${imp.feature || ""}`, MARGIN, y);
            y += 5;
            drawText(imp.description || "", 8.5);
          });
        }

        // Strategy
        if (data.result?.improvements?.better_versions?.length) {
          drawSection("Strategy Tiers");
          data.result.improvements.better_versions.forEach((ver: BetterVersion) => {
            checkNewPage(12);
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(167, 139, 250);
            pdf.text(`→ ${ver.name || ""}`, MARGIN, y);
            y += 5;
            drawText(ver.description || "", 8.5);
            y += 2;
          });
        }
      }

      // ── Stress Mode ─────────────────────────────────────────────────────────
      if (data.mode === "stress") {
        const result = data.result;
        if (result?.failure_reasons?.length) {
          drawSection("Failure Reasons");
          result.failure_reasons.forEach((r: RiskItem) => {
            checkNewPage(14);
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(248, 113, 113);
            pdf.text(`✗ ${r.title}`, MARGIN, y); y += 5;
            drawText(r.description ?? "", 8.5);
          });
        }
        if (result?.market_risks?.length) {
          drawSection("Market Risks");
          result.market_risks.forEach((r: RiskItem) => {
            checkNewPage(14);
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(251, 146, 60);
            pdf.text(`⚠ ${r.title}`, MARGIN, y); y += 5;
            drawText(r.description ?? "", 8.5);
          });
        }
        if (result?.brutal_verdict) {
          drawSection("Brutal Verdict");
          drawText(result.brutal_verdict, 10, [248, 113, 113], true);
        }
      }

      // ── Roast Mode ─────────────────────────────────────────────────────────
      if (data.mode === "roast") {
        const result = data.result;
        if (result?.roasts?.length) {
          drawSection("The Roast");
          result.roasts.forEach((r: RoastItem) => {
            checkNewPage(16);
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(251, 146, 60);
            pdf.text(`🔥 ${r.point}`, MARGIN, y); y += 5;
            drawText(r.comment ?? "", 8.5);
            y += 2;
          });
        }
        if (result?.the_burn) {
          drawSection("The Final Burn");
          drawText(`"${result.the_burn}"`, 10, [251, 146, 60], true);
        }
      }

      // ── Footer on every page ─────────────────────────────────────────────────
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFillColor(15, 23, 42);
        pdf.rect(0, PAGE_H - 12, PAGE_W, 12, "F");
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(71, 85, 105);
        pdf.text("Generated with Ideon Intelligence · Your AI Idea Partner", MARGIN, PAGE_H - 5);
        pdf.text(`Page ${i} of ${totalPages}`, PAGE_W - MARGIN - 20, PAGE_H - 5);
      }

      pdf.save(`Ideon_${(data.idea || "report").replace(/\s+/g, "_").substring(0, 30)}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSwitchMode = async (mode: "full" | "stress" | "roast") => {
    if (!data || data.mode === mode) return;
    setAnalysisMode(mode);
    setIsAnalyzing(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/analyze`,
        { idea: data.idea, mode },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Wait to show sequence
      setTimeout(() => {
        router.push(`/result/${res.data.id}`);
        setIsAnalyzing(false);
      }, 1000);
    } catch (error) {
      console.error("Switching mode failed:", error);
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Retrieving your analysis...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">Result not found</h2>
        <p className="text-muted-foreground mb-8">We couldn&apos;t find the analysis you&apos;re looking for.</p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-6 py-6 bg-accent/50 hover:bg-accent border-border rounded-2xl text-foreground font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (data.status === "pending") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="relative mb-12">
          <div className="w-32 h-32 rounded-none border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight uppercase">AI Engine Processing</h2>
        <div className="max-w-md w-full bg-accent/30 border border-border p-6 rounded-none space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <span>Status</span>
            <span className="text-primary animate-pulse">Running Pipeline...</span>
          </div>
          <div className="h-1.5 w-full bg-secondary/30 rounded-none overflow-hidden">
            <div className="h-full bg-primary animate-progress-indefinite" />
          </div>
          <p className="text-sm text-center text-muted-foreground leading-relaxed">
            Our AI models are currently generating SWOT analysis, risk mapping, and market projections for your idea. This usually takes 15-30 seconds.
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mt-12 text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="w-3 h-3 mr-2" />
          Cancel and return
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <ComingSoonDialog 
        isOpen={isComingSoonOpen} 
        onOpenChange={setIsComingSoonOpen} 
        featureName="Report Sharing" 
      />
      <LoadingDialog isOpen={isAnalyzing} mode={analysisMode} idea={data.idea} />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        <nav className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Dashboard</span>
          </Button>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {/* Toggle Button Group */}
            <div className="flex items-center bg-accent/30 p-1 rounded-none border border-border shrink-0">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleSwitchMode("full")}
                className={`rounded-none px-3 md:px-4 py-2 text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
                  data.mode === "full" 
                    ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <BarChart4 className="w-3.5 h-3.5 mr-1 md:mr-2" />
                Full Analysis
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleSwitchMode("stress")}
                className={`rounded-none px-3 md:px-4 py-2 text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
                  data.mode === "stress" 
                    ? "bg-rose-500 text-white shadow-lg hover:bg-rose-600" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <Flame className="w-3.5 h-3.5 mr-1 md:mr-2" />
                Stress Test
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleSwitchMode("roast")}
                className={`rounded-none px-3 md:px-4 py-2 text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
                  data.mode === "roast" 
                    ? "bg-orange-500 text-white shadow-lg hover:bg-orange-600" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <Skull className="w-3.5 h-3.5 mr-1 md:mr-2" />
                Roast Mode
              </Button>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={() => {
                if (!isPaid) {
                  router.push('/pricing');
                  return;
                }
                router.push(`/dashboard/result/${id}/architecture`);
              }}
              className={`rounded-none font-bold px-4 h-9 shadow-lg transition-all shrink-0 whitespace-nowrap ${
                isPaid 
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20" 
                  : "bg-muted text-muted-foreground border-border shadow-none"
              }`}
            >
              {!isPaid && <Lock className="w-3.5 h-3.5 mr-2" />}
              {isPaid && <ShieldCheck className="w-4 h-4 mr-2" />}
              Blueprint
            </Button>

            <div className="h-8 w-px bg-border mx-1 shrink-0" />

            <div className="flex items-center gap-2 shrink-0">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsComingSoonOpen(true)}
                className="h-9 w-9 bg-accent/50 hover:bg-accent border-border rounded-none text-muted-foreground hover:text-foreground transition-all"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleDownloadPDF}
                className="h-9 w-9 bg-accent/50 hover:bg-accent border-border rounded-none text-muted-foreground hover:text-foreground transition-all"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </nav>

        <div id="report-content" className="p-4 rounded-none">
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-none bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                AI Analysis Complete
              </div>
              <div className="px-3 py-1 rounded-none bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" />
                Dual-Model Verified
              </div>
              <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider ml-1">
                Generated on {new Date(data.createdAt).toLocaleDateString()}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-6 max-w-4xl">
              {data.idea}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-none border-2 border-background bg-card flex items-center justify-center">
                     <Sparkles className="w-3 h-3 text-primary" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Validated against <span className="text-foreground font-bold">10k+</span> market data points
              </p>
            </div>
          </header>

          <div className="animate-in slide-in-from-bottom-8 duration-1000">
            {data.mode === "stress" ? (
              <StressResult data={data.result ?? null} />
            ) : data.mode === "roast" ? (
              <RoastResult data={data.result ?? null} />
            ) : (
              <IdeaResult data={data.result ?? null} />
            )}
          </div>
          
          <div className="mt-12 text-center opacity-50">
             <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
               Generated with Ideon Intelligence
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
