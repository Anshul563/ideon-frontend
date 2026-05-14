"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  Target,
  TrendingUp,
  Zap,
  CheckCircle2,
  ArrowRight,
  MousePointerClick,
  Search,
  BarChart3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { LucideIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero Text Animation
      const tl = gsap.timeline();
      tl.from(".hero-title span", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
      }).from(
        ".hero-sub",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5",
      );

      // Scroll-based parallax for hero background
      gsap.to(".hero-bg", {
        y: () => -ScrollTrigger.maxScroll(window) * 0.1,
        ease: "none",
        scrollTrigger: {
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Timeline Progress Line
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 20%",
            end: "bottom 80%",
            scrub: 1,
          },
        },
      );

      // Fade and scale sections on scroll
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((elem) => {
        return gsap.fromTo(
          elem,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden"
    >
      <Navbar />

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none hero-bg">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-none bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-none bg-secondary/10 blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-none bg-accent/5 blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative z-10 min-h-screen flex flex-col justify-center items-center pt-20 px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10 mb-8 backdrop-blur-md hero-sub">
            <Sparkles className="w-3 h-3 animate-pulse" />
            The Future of Strategic Validation
          </div>

          <h1 className="text-7xl md:text-[9rem] font-black leading-[0.85] tracking-tighter text-foreground mb-10 hero-title overflow-hidden">
            <span className="block">VALIDATE</span>
            <span className="block text-primary italic">FASTER.</span>
            <span className="block text-muted-foreground">BUILD BETTER.</span>
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium hero-sub">
            Ideon uses high-fidelity AI models to stress-test your SaaS concepts
            against real-world market signals. Get a build or drop verdict in
            seconds.
          </p>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 hero-sub">
            <Link
              href="/register"
              className="group relative px-10 py-5 rounded-none text-lg font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
            >
              Start Free Scan
              <ArrowRight className="inline-block ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="px-10 py-5 rounded-none text-lg font-black uppercase tracking-widest border border-border text-foreground backdrop-blur-sm hover:bg-muted/5 transition-all"
            >
              View Methodology
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Scroll to explore
          </span>
          <div className="w-px h-12 bg-linear-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* How It Works - Vertical Timeline */}
      <section
        id="how-it-works"
        ref={timelineRef}
        className="relative z-10 py-40 px-6 overflow-hidden"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-none blur-[150px] pointer-events-none" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-40 reveal">
            <div className="inline-block mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] border border-primary/20 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 animate-pulse" />
                The Process
              </span>
            </div>
            <h2 className="text-6xl md:text-[5.5rem] font-black text-foreground tracking-tighter mb-6 leading-[1.1]">
              From Idea to{" "}
              <span className="text-primary">Strategic Insight</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium tracking-tight max-w-3xl mx-auto">
              Our three-stage intelligence pipeline transforms your concept into
              actionable intelligence.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 flex justify-center">
              <div className="relative w-1 h-full">
                {/* Background gradient line */}
                <div className="absolute inset-0 w-full bg-linear-to-b from-primary via-accent to-secondary opacity-20 rounded-none blur-xl" />
                {/* Border line */}
                <div className="absolute inset-0 w-full bg-border rounded-none" />
                {/* Animated progress line */}
                <div
                  ref={lineRef}
                  className="absolute top-0 w-full bg-linear-to-b from-primary via-accent to-secondary origin-top shadow-[0_0_30px_rgba(var(--primary),0.5)] rounded-none blur-sm"
                />
              </div>
            </div>

            <div className="space-y-32">
              {[
                {
                  num: "01",
                  title: "Idea Expansion",
                  desc: "Submit your core concept. Our AI refines your value proposition, identifies target personas, and maps the primary pain points you're solving.",
                  icon: MousePointerClick,
                  gradient: "from-primary/20 to-primary/5",
                  borderColor: "border-primary/30",
                  dotColor: "bg-primary",
                  accentColor: "text-primary",
                },
                {
                  num: "02",
                  title: "Deep Market Scan",
                  desc: "We analyze search volume, competitor density, and real-world PH data to determine if there's genuine hunger for your solution.",
                  icon: Search,
                  gradient: "from-secondary/20 to-secondary/5",
                  borderColor: "border-secondary/30",
                  dotColor: "bg-secondary",
                  accentColor: "text-secondary",
                },
                {
                  num: "03",
                  title: "Strategic Verdict",
                  desc: "Get a data-backed score across 5 critical vectors. We provide an honest build, pivot, or drop recommendation.",
                  icon: BarChart3,
                  gradient: "from-accent/20 to-accent/5",
                  borderColor: "border-accent/30",
                  dotColor: "bg-accent",
                  accentColor: "text-accent",
                },
              ].map((step, i) => (
                <TimelineItem key={i} step={step} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="relative z-10 py-32 px-6 max-w-7xl mx-auto reveal"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none mb-4 uppercase">
              ENGINEERED FOR <br />
              <span className="text-muted-foreground">DECISION MAKERS.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md font-medium text-lg leading-relaxed">
            Stop relying on gut feeling. Leverage our high-performance analysis
            engine to validate every strategic move.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "Neural Logic Validation",
              desc: "Our models go beyond keywords to understand the fundamental business logic of your idea.",
            },
            {
              icon: Target,
              title: "Competitor Vulnerability",
              desc: "We don't just list competitors; we identify exactly where they are weak and where you can win.",
            },
            {
              icon: TrendingUp,
              title: "Real-Time Demand",
              desc: "Live signals from market aggregators to ensure you aren't building in a vacuum.",
            },
            {
              icon: Zap,
              title: "Standardized Scoring",
              desc: "Transparent metrics on execution difficulty, demand, and monetization potential.",
            },
            {
              icon: ShieldCheck,
              title: "Risk Mitigation",
              desc: "Early identification of legal, technical, or market hurdles before they cost you capital.",
            },
            {
              icon: CheckCircle2,
              title: "Strategic Roadmap",
              desc: "Personalized next steps based on your verdict, whether it's building an MVP or pivoting.",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative p-1 rounded-none bg-muted/5 border border-border hover:border-primary/20 transition-all duration-500 shadow-2xl"
              >
                <div className="p-10 rounded-none bg-card/80 backdrop-blur-xl h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-none bg-primary/10 flex items-center justify-center border border-primary/20 mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-32 px-6 reveal">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-none overflow-hidden bg-primary p-20 md:p-32 text-center shadow-[0_0_100px_rgba(var(--primary),0.3)]">
            <div className="absolute inset-0 bg-linear-to-br from-primary to-secondary opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-30" />

            <div className="relative z-10">
              <h2 className="text-6xl md:text-[8rem] font-black text-primary-foreground tracking-tighter leading-[0.9] mb-10 uppercase">
                DONT WASTE <br />
                ANOTHER YEAR.
              </h2>
              <p className="text-xl md:text-2xl text-primary-foreground/80 mb-16 max-w-2xl mx-auto font-medium">
                Join 10,000+ founders who use Ideon to stress-test their ideas
                before touching a single line of code.
              </p>
              <Link
                href="/register"
                className="inline-block px-12 py-6 bg-background text-foreground hover:bg-muted rounded-none text-xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                Validate My Idea Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

type TimelineStep = {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  gradient: string;
  borderColor: string;
  dotColor: string;
  accentColor: string;
};

function TimelineItem({ step, index }: { step: TimelineStep; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  const Icon = step.icon;

  return (
    <div
      ref={ref}
      className={`relative flex flex-col md:flex-row gap-12 md:gap-0 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
    >
      <div className="w-full md:w-1/2 flex justify-center md:px-12">
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          animate={
            isInView
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }
          }
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-sm group"
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

          {/* Card */}
          <div
            className={`relative p-1 rounded-none bg-linear-to-br ${step.gradient} border ${step.borderColor} backdrop-blur-2xl overflow-hidden shadow-xl group-hover:shadow-[0_0_40px_rgba(var(--primary),0.2)] transition-all duration-500`}
          >
            <div className="relative p-8 rounded-none bg-card/60 backdrop-blur-xl h-full flex flex-col">
              {/* Number background */}
              <div className="absolute top-4 right-4 text-6xl font-black text-muted-foreground/10 leading-none pointer-events-none">
                {step.num}
              </div>

              {/* Icon */}
              <motion.div
                animate={isInView ? { y: 0, rotate: 0 } : { y: 10, rotate: -5 }}
                transition={{ duration: 0.6 }}
                className={`w-16 h-16 rounded-none bg-linear-to-br ${step.gradient} flex items-center justify-center border ${step.borderColor} mb-6 group-hover:scale-110 transition-transform shadow-lg relative z-10 shrink-0`}
              >
                <Icon className={`w-8 h-8 ${step.accentColor}`} />
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <h3
                  className={`text-2xl font-black text-foreground mb-4 tracking-tight leading-tight ${step.accentColor} group-hover:text-foreground transition-colors`}
                >
                  {step.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed font-medium mb-6">
                  {step.desc}
                </p>

                {/* Learn more link */}
                <motion.button
                  whileHover={{ x: 5 }}
                  className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest ${step.accentColor} hover:opacity-70 transition-opacity`}
                >
                  Explore
                  <ArrowRight className="w-3 h-3" />
                </motion.button>
              </div>

              {/* Bottom accent line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeline Dot */}
      <div className="absolute left-4 md:left-1/2 top-0 md:-translate-x-1/2 flex justify-center z-20">
        <motion.div
          animate={isInView ? { scale: 1 } : { scale: 0.6 }}
          className="relative"
        >
          {/* Outer glow */}
          <div
            className={`absolute inset-0 ${step.dotColor} rounded-none opacity-30 blur-lg animate-pulse`}
            style={{
              width: "32px",
              height: "32px",
              marginLeft: "-16px",
              marginTop: "-16px",
            }}
          />

          {/* Main dot with border */}
          <motion.div
            animate={
              isInView
                ? {
                    boxShadow: `0 0 0 8px var(--background), 0 0 20px 2px var(--${step.dotColor.split("-")[1]})`,
                  }
                : {
                    boxShadow: `0 0 0 4px var(--background), 0 0 0 0 var(--muted)`,
                  }
            }
            transition={{ duration: 0.6 }}
            className={`w-6 h-6 ${step.dotColor} rounded-none relative z-10 border-4 border-background`}
          />
        </motion.div>
      </div>

      <div className="hidden md:block w-1/2" />
    </div>
  );
}
