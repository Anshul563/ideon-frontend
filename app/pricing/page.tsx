export default function Pricing() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        Pricing Plans
      </h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

        {/* Free */}
        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl font-bold">Free</h2>
          <p className="text-3xl mt-4">$0</p>
          <ul className="mt-4 space-y-2 text-gray-400">
            <li>5 Idea Analyses</li>
            <li>Basic AI Output</li>
          </ul>
        </div>

        {/* Pro */}
        <div className="bg-indigo-600 p-6 rounded-xl">
          <h2 className="text-xl font-bold">Pro</h2>
          <p className="text-3xl mt-4">$19/mo</p>
          <ul className="mt-4 space-y-2">
            <li>Unlimited Ideas</li>
            <li>Advanced AI Analysis</li>
            <li>Competitor Insights</li>
          </ul>
        </div>

        {/* Business */}
        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl font-bold">Business</h2>
          <p className="text-3xl mt-4">$49/mo</p>
          <ul className="mt-4 space-y-2 text-gray-400">
            <li>Team Access</li>
            <li>Priority AI</li>
            <li>Analytics Dashboard</li>
          </ul>
        </div>

      </div>
    </main>
  );
}