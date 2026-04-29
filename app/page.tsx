export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-16">
        <h1 className="text-2xl font-bold">Ideon</h1>
        <div className="space-x-4">
          <a href="/login">Login</a>
          <a href="/register" className="bg-indigo-600 px-4 py-2 rounded-lg">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-5xl font-bold leading-tight">
          Validate Your SaaS Ideas <br />
          <span className="text-indigo-400">Before You Build</span>
        </h2>

        <p className="mt-6 text-gray-400">
          Ideon analyzes your startup idea using AI, real market signals,
          and competitor data — so you don’t waste months building the wrong thing.
        </p>

        <div className="mt-8 space-x-4">
          <a href="/register" className="bg-indigo-600 px-6 py-3 rounded-xl">
            Start Free
          </a>
          <a href="/pricing" className="border px-6 py-3 rounded-xl">
            View Pricing
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="mt-24 grid md:grid-cols-3 gap-6">
        {[
          "AI Idea Analysis",
          "Competitor Insights",
          "Market Validation",
          "Scoring System",
          "Build vs Drop Verdict",
          "Startup Strategy"
        ].map((feature) => (
          <div
            key={feature}
            className="bg-slate-900 p-6 rounded-2xl border border-slate-800"
          >
            {feature}
          </div>
        ))}
      </section>

    </main>
  );
}