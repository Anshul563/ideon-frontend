import React from "react";
import { 
  Trophy, TrendingUp, AlertTriangle, Lightbulb, 
  Target, Users, Zap, Briefcase, Activity, ShieldAlert,
  ArrowUpRight, CheckCircle2
} from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';

export default function IdeaResult({ data }: { data: any }) {
  if (!data) return null;

  // Chart data formatting
  const chartData = Object.entries(data.scoring?.scores || {})
    .filter(([key]) => key !== "overall")
    .map(([key, value]: any) => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      A: value,
      fullMark: 10,
    }));

  // Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-primary";
    if (score >= 5) return "text-muted-foreground";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-primary";
    if (score >= 5) return "bg-muted-foreground";
    return "bg-destructive";
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[32px] bg-card/40 backdrop-blur-3xl border border-border p-8 md:p-12">
        <div className="absolute top-0 right-0 p-12 opacity-10 blur-[100px] pointer-events-none">
          <div className="w-64 h-64 bg-primary rounded-full" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
              <Trophy className="w-3.5 h-3.5" /> AI Analysis Complete
            </div>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              {data.expanded?.expanded_idea}
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-2 shrink-0 bg-background/40 backdrop-blur-2xl p-6 rounded-[32px] border border-border min-w-[160px]">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Overall Verdict</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-5xl font-black tracking-tighter ${getScoreColor(data.scoring?.scores?.overall)}`}>
                {data.scoring?.scores?.overall}
              </span>
              <span className="text-xl text-muted-foreground/30 font-bold">/10</span>
            </div>
            <div className="mt-2 px-4 py-1.5 rounded-xl bg-accent text-accent-foreground text-sm font-bold flex items-center gap-2 border border-border">
              <Activity className="w-4 h-4 text-primary" /> {data.scoring?.verdict}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout for Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Metrics & Market */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Detailed Scores & Chart */}
          <div className="backdrop-blur-xl bg-card/40 rounded-[32px] p-6 border border-border">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Target className="w-4 h-4 text-primary" />
              </div>
              Validation Metrics
            </h3>

            {/* Radar Chart Integration */}
            <div className="w-full h-[220px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                  <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.1} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 8, fontWeight: 700 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 10]} 
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {Object.entries(data.scoring?.scores || {})
                .filter(([key]) => key !== "overall")
                .map(([key, value]: any) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-muted-foreground">{key}</span>
                    <span className={getScoreColor(value)}>{value}/10</span>
                  </div>
                  <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden border border-border">
                    <div 
                      className={`h-full rounded-full ${getScoreBg(value)} transition-all duration-1000 ease-out`}
                      style={{ width: `${(value / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Pulse */}
          <div className="backdrop-blur-xl bg-card/40 rounded-[32px] p-6 border border-border relative overflow-hidden group">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 relative z-10">
              <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              Market Pulse
            </h3>
            <div className="relative z-10 space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                Demand: {data.market?.demand_level}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {data.market?.reason}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Deep Dive */}
        <div className="lg:col-span-8 space-y-8">
          {/* Core Problem & Users */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-card/40 rounded-[32px] p-6 border border-border">
              <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-destructive" /> Core Problem
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                {data.expanded?.core_problem}
              </p>
            </div>
            <div className="backdrop-blur-xl bg-card/40 rounded-[32px] p-6 border border-border">
              <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Target Audience
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                {data.expanded?.target_users}
              </p>
            </div>
          </div>

          {/* Competitors */}
          <div className="backdrop-blur-xl bg-card/40 rounded-[32px] p-8 border border-border">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" /> Competitive Landscape
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.competitors?.map((comp: any, i: number) => (
                <div key={i} className="p-5 rounded-[24px] bg-background/40 border border-border hover:border-primary/20 transition-all hover:-translate-y-1 flex flex-col h-full group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary/20 transition-all">
                      {comp.website ? (
                        <img 
                          src={`https://logo.clearbit.com/${comp.website}`} 
                          alt={comp.name}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${comp.website}&sz=64`;
                          }}
                        />
                      ) : (
                        <Briefcase className="w-5 h-5 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-foreground text-sm truncate">{comp.name}</h4>
                      <p className="text-[9px] text-muted-foreground truncate">{comp.website || "Competitive Player"}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-4 grow leading-relaxed line-clamp-3">
                    {comp.description}
                  </p>
                  <div className="pt-4 border-t border-border/50">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-destructive font-black block mb-1">Vulnerability</span>
                    <p className="text-[10px] text-destructive/80 leading-relaxed font-semibold line-clamp-2 italic">
                      "{comp.weakness}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features & Strategy Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Essential Features */}
            <div className="backdrop-blur-xl bg-card/40 rounded-[32px] p-8 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Essential Features
              </h3>
              <div className="space-y-4">
                {data.improvements?.improvements?.slice(0, 3).map((imp: any, i: number) => (
                  <div key={i} className="flex gap-3 items-start p-3 rounded-2xl hover:bg-accent/30 transition-all group border border-transparent hover:border-border">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-foreground text-xs mb-1">{imp.feature}</h4>
                      <p className="text-[10px] text-muted-foreground leading-relaxed font-medium line-clamp-2">{imp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Strategy */}
            <div className="bg-linear-to-br from-primary/5 to-card/60 backdrop-blur-3xl rounded-[32px] p-8 border border-primary/10">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" /> Strategy Tiers
              </h3>
              <div className="space-y-4">
                {data.improvements?.better_versions?.slice(0, 2).map((ver: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-background/40 border border-primary/5 hover:border-primary/20 transition-all">
                    <h4 className="font-bold text-primary mb-2 flex items-center justify-between text-xs">
                      {ver.name}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-medium line-clamp-2">{ver.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

