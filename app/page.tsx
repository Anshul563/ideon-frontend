"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  Target,
  TrendingUp,
  Zap,
  CheckCircle2,
  ArrowRight,
  Search,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Flame,
  Activity,
  History,
  Lock,
  ChevronRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { BetaVersionDialog } from "@/components/BetaVersionDialog";
import { PLAN_FEATURES, PLAN_METADATA } from "@/lib/plan-rules";
import type { LucideIcon } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [dbPlans, setDbPlans] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans`);
        setDbPlans(res.data);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      }
    };
    fetchPlans();
  }, []);

  useGSAP(
    () => {
      // Hero Animation
      const tl = gsap.timeline();
      tl.from(".hero-line", {
        width: 0,
        opacity: 0,
        duration: 1.5,
        ease: "power4.inOut",
        stagger: 0.2,
      }).from(".hero-text span", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
      }, "-=1");

      // Background parallax
      gsap.to(".bg-grid", {
        y: -100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // Reveal animations
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((elem) => {
        gsap.from(elem, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden font-sans"
    >
      <BetaVersionDialog />
      <AnnouncementBar />
      <Navbar />

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-grid absolute inset-0">
          {/* Dotted Grid */}
          <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#80808044_1px,transparent_1px)] bg-size-[32px_32px]" />
          {/* Linear Grid */}
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[128px_128px]" />
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-background via-transparent to-background" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5" />
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative z-10 min-h-screen flex flex-col justify-center items-center pt-32 px-6"
      >
        <div className="max-w-7xl mx-auto w-full">
           <div className="flex flex-col items-center text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 px-5 py-2 bg-primary/5 border border-primary/20 mb-12"
              >
                <div className="w-2 h-2 bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Ideon Protocol v1.0 Activated</span>
              </motion.div>

              <div className="relative mb-12">
                 <div className="hero-line absolute -left-20 top-1/2 w-40 h-px bg-linear-to-r from-transparent to-primary/50 hidden lg:block" />
                 <div className="hero-line absolute -right-20 top-1/2 w-40 h-px bg-linear-to-l from-transparent to-primary/50 hidden lg:block" />
                 <h1 className="hero-text text-[clamp(3rem,12vw,10rem)] font-black leading-[0.8] tracking-tighter uppercase overflow-hidden">
                    <span className="block italic text-muted-foreground/20">Think.</span>
                    <span className="block text-primary">Validate.</span>
                    <span className="block text-foreground">Dominate.</span>
                 </h1>
              </div>

              <p className="max-w-2xl text-xl text-muted-foreground font-medium leading-relaxed mb-16 opacity-80">
                Deploy high-fidelity AI to stress-test your SaaS concepts before you touch a single line of code. Stop guessing. Start knowing.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link
                  href="/register"
                  className="group relative px-12 py-6 bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] text-xs hover:scale-105 active:scale-95 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-3">
                    Initiate Scan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/login"
                  className="px-12 py-6 bg-accent/10 border border-border text-foreground font-black uppercase tracking-[0.3em] text-xs hover:bg-accent/20 transition-all active:scale-95"
                >
                  Enter Dashboard
                </Link>
              </div>
              <div className="mt-20 flex flex-col items-center gap-4 reveal">
                 <div className="w-px h-16 bg-linear-to-b from-primary to-transparent" />
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">Transmission Downstream</span>
              </div>
           </div>
        </div>
      </section>

      {/* The Arsenal - Modes Showcase */}
      <section className="relative z-10 py-40 bg-accent/5 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8 reveal">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
                  THE <span className="text-primary">ARSENAL</span>
                </h2>
                <p className="text-xl text-muted-foreground font-medium tracking-tight">Three specialized intelligence protocols for absolute certainty.</p>
              </div>
              <div className="flex gap-4">
                 <div className="px-4 py-2 border border-border bg-background text-[10px] font-black uppercase tracking-widest">v1.2.0 Engine</div>
                 <div className="px-4 py-2 border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">Neural Logic Enabled</div>
              </div>
           </div>

           <div className="grid lg:grid-cols-3 gap-8">
              {/* Full Mode */}
              <ModeCard 
                icon={Brain}
                title="IDEA LAB"
                subtitle="The Strategic Core"
                desc="A comprehensive 360° scan of your business concept. Analyzes value props, target markets, and competitive vulnerabilities with high-precision neural logic."
                color="primary"
                mode="FULL"
              />
              {/* Stress Mode */}
              <ModeCard 
                icon={Activity}
                title="STRESS TEST"
                subtitle="The Filter"
                desc="Aggressive edge-case analysis. We push your idea to its breaking point to identify hidden risks, technical hurdles, and market saturation traps."
                color="secondary"
                mode="STRESS"
              />
              {/* Roast Mode */}
              <ModeCard 
                icon={Flame}
                title="ROAST MODE"
                subtitle="The Mirror"
                desc="Brutal, unfiltered AI honesty. No corporate fluff—just a direct takedown of why your idea might fail, forcing you to build something truly bulletproof."
                color="destructive"
                mode="ROAST"
              />
           </div>
        </div>
      </section>

      {/* Market Research Section */}
      <section className="relative z-10 py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="reveal">
                 <div className="w-12 h-1 bg-primary mb-8" />
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">
                    Deep Market <br />
                    <span className="text-muted-foreground/30">Intelligence.</span>
                 </h2>
                 <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-12">
                    Ideon doesn't just "think"—it researches. Our engine pulls real-time search volume, competitor density, and social signals to ground your idea in reality.
                 </p>
                 
                 <div className="space-y-6">
                    {[
                      { icon: Search, title: "Search Intent Mapping", desc: "Identify what potential customers are actually looking for." },
                      { icon: Target, title: "Competitor Vulnerability", desc: "Find the exact weaknesses in existing solutions." },
                      { icon: TrendingUp, title: "Trend Trajectory", desc: "See if your market is growing or stagnant before you invest." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6 group">
                         <div className="w-12 h-12 shrink-0 border border-border bg-accent/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                            <item.icon className="w-5 h-5 text-primary" />
                         </div>
                         <div>
                            <h4 className="text-lg font-black tracking-tight mb-1 uppercase">{item.title}</h4>
                            <p className="text-muted-foreground text-sm font-medium">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="relative reveal">
                                   <div className="absolute inset-0 bg-primary/5 -z-10" />

                 <div className="border border-border bg-card p-1">
                    <div className="border border-border bg-background p-8 aspect-square flex flex-col justify-between overflow-hidden relative group">
                       <div className="flex justify-between items-start">
                          <div className="space-y-1">
                             <div className="text-[10px] font-black text-primary uppercase tracking-widest">Live Engine Feed</div>
                             <div className="text-2xl font-black tracking-tighter">DATA ANALYTICS</div>
                          </div>
                          <div className="w-10 h-10 border border-border flex items-center justify-center">
                             <Activity className="w-4 h-4" />
                          </div>
                       </div>
                       
                       <div className="flex-1 flex items-center justify-center py-12">
                          <div className="w-full space-y-4">
                             {[80, 45, 90, 60].map((w, i) => (
                               <div key={i} className="space-y-1">
                                  <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                     <span>Vector {i + 1}</span>
                                     <span>{w}%</span>
                                  </div>
                                  <div className="h-1 bg-border relative overflow-hidden">
                                     <motion.div 
                                       initial={{ width: 0 }}
                                       whileInView={{ width: `${w}%` }}
                                       transition={{ duration: 1.5, delay: i * 0.2 }}
                                       className="h-full bg-primary" 
                                     />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="p-4 border border-border bg-accent/5 text-[9px] font-mono text-muted-foreground/60 leading-tight">
                          [SYSTEM_LOG]: Parsing market signals... <br />
                          [SYSTEM_LOG]: Sentiment score 0.82 recorded. <br />
                          [SYSTEM_LOG]: Competitive overlap detected in segment A.
                       </div>

                       <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* The Vault - History Section */}
      <section className="relative z-10 py-40 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="bg-primary p-1 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <History className="w-64 h-64 rotate-12" />
              </div>
              <div className="bg-background p-12 lg:p-24 flex flex-col lg:flex-row items-center gap-20 relative z-10">
                 <div className="lg:w-1/2 reveal">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
                       <Lock className="w-3 h-3" />
                       Intelligence Archive
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">
                       THE <br />
                       <span className="text-primary italic">VAULT.</span>
                    </h2>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-10">
                       Every idea you validate is preserved in your permanent Intelligence Archive. Track your strategic pivots, compare scores across concepts, and build a high-value portfolio of validated intellectual property.
                    </p>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-primary group"
                    >
                      Build Your Portfolio <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                 </div>
                 
                 <div className="lg:w-1/2 w-full reveal">
                    <div className="relative border border-border bg-accent/5 p-8 overflow-hidden group">
                       <div className="flex flex-col gap-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 border border-border bg-background flex items-center justify-between group-hover:translate-x-2 transition-transform" style={{ transitionDelay: `${i * 100}ms` }}>
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-primary/5 flex items-center justify-center border border-primary/10">
                                     <Brain className="w-4 h-4 text-primary" />
                                  </div>
                                  <div>
                                     <div className="text-xs font-black uppercase tracking-tight">Validated Project {i}</div>
                                     <div className="text-[10px] text-muted-foreground font-medium">14 May 2026 • Full Scan</div>
                                  </div>
                               </div>
                               <div className="text-lg font-black text-primary">8{i}</div>
                            </div>
                          ))}
                       </div>
                       <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent z-10" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-40 bg-accent/5 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-24 reveal">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
                 <Zap className="w-3 h-3" />
                 Deployment Tiers
              </div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6 uppercase">
                 SCALE YOUR <span className="text-primary">VISION.</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">Choose the intelligence protocol that matches your strategic ambitions.</p>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
              {/* Starter / Free */}
              {(() => {
                 const freePlan = dbPlans.find(p => p.id === 'free') || { amount: '0', period: '/ Forever', features: PLAN_FEATURES.free };
                 return (
                    <div className="reveal group border border-border bg-card p-1 relative flex flex-col">
                       <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40 z-20" />
                       <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/40 z-20" />
                       
                       <div className="bg-background p-8 h-full flex flex-col border border-border transition-all group-hover:border-primary/20">
                          <div className="mb-6">
                             <div className="flex justify-between items-start">
                                <div>
                                   <h3 className="text-xl font-black uppercase tracking-tight mb-1">{PLAN_METADATA.free.tierName}</h3>
                                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{PLAN_METADATA.free.tagline}</p>
                                </div>
                                <div className="text-[9px] font-mono text-muted-foreground/30">[PROTOCOL_{PLAN_METADATA.free.protocolId}]</div>
                             </div>
                          </div>
                          <div className="mb-8">
                             <span className="text-4xl font-black tracking-tighter">₹{freePlan.amount}</span>
                             <span className="text-muted-foreground font-bold ml-2 text-xs">{freePlan.period}</span>
                          </div>
                          <ul className="space-y-3 mb-10 flex-1">
                             {PLAN_FEATURES.free.map((f: string, i: number) => (
                                <PricingFeature key={i} text={f} disabled={f.toLowerCase().includes('support') || f.toLowerCase().includes('blueprint')} />
                             ))}
                          </ul>
                          <Link href="/register" className="w-full py-4 border border-border bg-background text-[10px] font-black uppercase tracking-[0.3em] text-center hover:bg-accent/10 transition-all">
                             Deploy {PLAN_METADATA.free.tierName}
                          </Link>
                       </div>
                    </div>
                 );
              })()}

              {/* Pro / Monthly */}
              {(() => {
                 const proPlan = dbPlans.find(p => p.id === 'monthly') || { amount: '29', period: '/ Month', features: PLAN_FEATURES.monthly };
                 return (
                    <div className="reveal group border border-border bg-card p-1 relative flex flex-col">
                       <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40 z-20" />
                       <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/40 z-20" />

                       <div className="bg-background p-8 h-full flex flex-col border border-border transition-all group-hover:border-primary/20">
                          <div className="mb-6">
                             <div className="flex justify-between items-start">
                                <div>
                                   <h3 className="text-xl font-black uppercase tracking-tight mb-1">{PLAN_METADATA.monthly.tierName}</h3>
                                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{PLAN_METADATA.monthly.tagline}</p>
                                </div>
                                <div className="text-[9px] font-mono text-muted-foreground/30">[PROTOCOL_{PLAN_METADATA.monthly.protocolId}]</div>
                             </div>
                          </div>
                          <div className="mb-8">
                             <span className="text-4xl font-black tracking-tighter">₹{proPlan.amount}</span>
                             <span className="text-muted-foreground font-bold ml-2 text-xs">{proPlan.period}</span>
                          </div>
                          <ul className="space-y-3 mb-10 flex-1">
                             {PLAN_FEATURES.monthly.map((f: string, i: number) => (
                                <PricingFeature key={i} text={f} />
                             ))}
                          </ul>
                          <Link href="/register" className="w-full py-4 border border-border bg-background text-[10px] font-black uppercase tracking-[0.3em] text-center hover:bg-accent/10 transition-all">
                             Deploy {PLAN_METADATA.monthly.tierName}
                          </Link>
                       </div>
                    </div>
                 );
              })()}

              {/* Ultimate / Yearly */}
              {(() => {
                 const yearlyPlan = dbPlans.find(p => p.id === 'yearly') || { amount: '199', period: '/ Year', features: PLAN_FEATURES.yearly };
                 return (
                    <div className="reveal group border-2 border-primary bg-primary/5 p-1 relative flex flex-col z-20">
                       <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary z-20" />
                       <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary z-20" />

                       <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                          Most Deployed
                       </div>
                       <div className="bg-background p-8 h-full flex flex-col border border-primary/20">
                          <div className="mb-6">
                             <div className="flex justify-between items-start">
                                <div>
                                   <h3 className="text-xl font-black uppercase tracking-tight mb-1 text-primary">{PLAN_METADATA.yearly.tierName}</h3>
                                   <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{PLAN_METADATA.yearly.tagline}</p>
                                </div>
                                <div className="text-[9px] font-mono text-primary/40">[PROTOCOL_{PLAN_METADATA.yearly.protocolId}]</div>
                             </div>
                          </div>
                          <div className="mb-8">
                             <span className="text-4xl font-black tracking-tighter">₹{yearlyPlan.amount}</span>
                             <span className="text-muted-foreground font-bold ml-2 text-xs">{yearlyPlan.period}</span>
                          </div>
                          <ul className="space-y-3 mb-10 flex-1">
                             {PLAN_FEATURES.yearly.map((f: string, i: number) => (
                                <PricingFeature key={i} text={f} highlight />
                             ))}
                          </ul>
                          <Link href="/register" className="w-full py-5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.4em] text-center hover:bg-primary/90 transition-all overflow-hidden relative group/btn">
                             <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                             <span className="relative z-10">Upgrade to {PLAN_METADATA.yearly.tierName}</span>
                          </Link>
                       </div>
                    </div>
                 );
              })()}

              {/* Enterprise / Lifetime */}
              {(() => {
                 const entPlan = dbPlans.find(p => p.id === 'lifetime') || { amount: 'Custom', period: '', features: PLAN_FEATURES.lifetime };
                 return (
                    <div className="reveal group border border-border bg-card p-1 relative flex flex-col">
                       <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40 z-20" />
                       <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/40 z-20" />

                       <div className="bg-background p-8 h-full flex flex-col border border-border transition-all group-hover:border-primary/20">
                          <div className="mb-6">
                             <div className="flex justify-between items-start">
                                <div>
                                   <h3 className="text-xl font-black uppercase tracking-tight mb-1">{PLAN_METADATA.lifetime.tierName}</h3>
                                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{PLAN_METADATA.lifetime.tagline}</p>
                                </div>
                                <div className="text-[9px] font-mono text-muted-foreground/30">[PROTOCOL_{PLAN_METADATA.lifetime.protocolId}]</div>
                             </div>
                          </div>
                          <div className="mb-8">
                             <span className="text-4xl font-black tracking-tighter">
                                {entPlan.amount === 'Custom' ? 'Custom' : `₹${entPlan.amount}`}
                             </span>
                             <span className="text-muted-foreground font-bold ml-2 text-xs">One-time</span>
                          </div>
                          <ul className="space-y-3 mb-10 flex-1">
                             {PLAN_FEATURES.lifetime.map((f: string, i: number) => (
                                <PricingFeature key={i} text={f} />
                             ))}
                          </ul>
                          <Link href="/register" className="w-full py-4 border border-border bg-background text-[10px] font-black uppercase tracking-[0.3em] text-center hover:bg-accent/10 transition-all">
                             Deploy {PLAN_METADATA.lifetime.tierName}
                          </Link>
                       </div>
                    </div>
                 );
              })()}
           </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 py-60 text-center px-6">
         <div className="reveal">
            <h2 className="text-6xl md:text-[9rem] font-black tracking-[ -0.05em] leading-[0.8] mb-16 uppercase">
               STOP WASTING <br />
               <span className="text-muted-foreground/20">TALENT.</span>
            </h2>
            <Link
              href="/register"
              className="inline-block px-16 py-8 bg-foreground text-background font-black uppercase tracking-[0.4em] text-sm hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110 active:scale-95"
            >
              Analyze Your Idea Now
            </Link>
         </div>
      </section>

      <Footer />
    </main>
  );
}

function PricingFeature({ text, highlight, disabled }: { text: string; highlight?: boolean; disabled?: boolean }) {
  return (
    <li className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-tight ${disabled ? "opacity-20" : highlight ? "text-foreground" : "text-muted-foreground"}`}>
      <div className={`w-3.5 h-3.5 border-2 flex items-center justify-center shrink-0 ${disabled ? "border-muted-foreground/20" : highlight ? "border-primary" : "border-border"}`}>
        {!disabled && <div className={`w-1.5 h-1.5 ${highlight ? "bg-primary" : "bg-border"}`} />}
      </div>
      {text}
    </li>
  );
}

function ModeCard({ icon: Icon, title, subtitle, desc, color, mode }: { icon: LucideIcon; title: string; subtitle: string; desc: string; color: string; mode: string }) {
  const colorMap: Record<string, string> = {
    primary: "text-primary border-primary/30 bg-primary/5",
    secondary: "text-secondary border-secondary/30 bg-secondary/5",
    destructive: "text-destructive border-destructive/30 bg-destructive/5",
  };

  const currentStyle = colorMap[color];

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="reveal group border border-border bg-card p-1 transition-all duration-500"
    >
      <div className="h-full bg-background p-10 flex flex-col border border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <span className={`text-[9px] font-black uppercase tracking-[0.3em] opacity-30 group-hover:opacity-100 transition-opacity ${currentStyle.split(' ')[0]}`}>{mode} PROTOCOL</span>
        </div>
        
        <div className={`w-16 h-16 border border-border flex items-center justify-center mb-8 group-hover:border-primary transition-all duration-500`}>
           <Icon className={`w-8 h-8 ${currentStyle.split(' ')[0]}`} />
        </div>
        
        <div className="space-y-2 mb-6">
           <h3 className="text-2xl font-black tracking-tighter uppercase">{title}</h3>
           <p className={`text-[10px] font-black uppercase tracking-widest ${currentStyle.split(' ')[0]}`}>{subtitle}</p>
        </div>

        <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8">
           {desc}
        </p>

        <div className="mt-auto pt-8 border-t border-border/50">
           <Link href="/register" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              Deploy Protocol <ChevronRight className="w-3 h-3" />
           </Link>
        </div>

        {/* Hover accent */}
        <div className={`absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
      </div>
    </motion.div>
  );
}
