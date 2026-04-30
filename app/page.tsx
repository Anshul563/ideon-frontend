import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen text-slate-100 px-6 py-10 relative">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-16 relative z-10 max-w-7xl mx-auto backdrop-blur-md bg-slate-900/40 p-4 rounded-2xl border border-white/5">
        <h1 className="text-2xl font-black tracking-tighter bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Ideon</h1>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium hover:text-indigo-400 transition-colors">Login</Link>
          <Link href="/register" className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center max-w-4xl mx-auto pt-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-8">
          ✨ Powered by Advanced AI
        </div>
        <h2 className="text-6xl md:text-7xl font-black leading-[1.1] tracking-tight text-white mb-8">
          Validate Your SaaS <br />
          <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">Before You Build</span>
        </h2>

        <p className="mt-6 text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Ideon analyzes your startup idea using deep AI market signals,
          competitor intelligence, and real data — stopping you from wasting years on the wrong path.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-1">
            Start Your Analysis
          </Link>
          <Link href="/pricing" className="w-full sm:w-auto backdrop-blur-md bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl text-lg font-bold border border-white/10 transition-all hover:border-white/20">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mt-40 grid md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10 pb-20">
        {[
          { title: "AI Idea Analysis", desc: "Deep neural networks evaluate your business logic and scalability." },
          { title: "Competitor Insights", desc: "Automatically map out your landscape and find your unique edge." },
          { title: "Market Validation", desc: "Real-time demand signals from search trends and social data." },
          { title: "Scoring System", desc: "Standardized metrics across demand, execution, and risk." },
          { title: "Build vs Drop Verdict", desc: "Hard truths about your idea's viability from an unbiased model." },
          { title: "Startup Strategy", desc: "Actionable next steps to iterate or pivot based on findings." }
        ].map((f) => (
          <div
            key={f.title}
            className="group relative backdrop-blur-xl bg-slate-900/40 p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

    </main>
  );
}