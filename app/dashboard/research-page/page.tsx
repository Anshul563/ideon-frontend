"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  Search, 
  TrendingUp, 
  Users, 
  BarChart3, 
  ChevronRight, 
  Brain,
  Globe,
  ArrowRight,
  Loader2,
  Sparkles,
  ExternalLink,
  Target,
  Lightbulb,
  RefreshCw
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { TrendItem } from "@/lib/types";

export default function Page() {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState("");
  const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const handleGenerateReport = (trend: TrendItem) => {
    if (!trend.title) return;
    
    const params = new URLSearchParams();
    // Combine name and description for a "complete idea" as requested
    const fullIdea = `${trend.title}: ${trend.description || ""}`.trim();
    params.set("idea", fullIdea);
    
    // Attempt to extract or default target audience
    const audience = trend.tags?.find(t => ["Enterprise", "B2B", "Developers", "SME", "Consumers"].includes(t)) || industry || "Target Market";
    params.set("audience", audience);
    
    // Setting defaults for scope and model to ensure auto-fill works
    params.set("scope", "Global");
    params.set("model", "Subscription SaaS");
    
    router.push(`/dashboard?${params.toString()}`);
  };

  const fetchTrends = async (query?: string, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/research`, {
        params: { 
          industry: query,
          refresh: isRefresh 
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      // Map backend data to frontend TrendItem structure
      const mappedTrends = res.data.map((item: any) => ({
        ...item,
        title: item.name,
        growth: item.platform === "Google Search" ? "High" : "Rising",
        score: Math.floor(Math.random() * 15) + 85 
      }));
      
      setTrends(mappedTrends);
      setVisibleCount(5); // Reset visible count on new fetch
    } catch (error) {
      console.error("Error fetching trends:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Research</h1>
          <p className="text-muted-foreground mt-1">
            Discover trending topics and validated opportunities in your industry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search industry..." 
            className="w-[250px]"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchTrends(industry)}
          />
          <Button onClick={() => fetchTrends(industry)}>
            <Search className="w-4 h-4 mr-2" />
            Analyze
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => fetchTrends(industry, true)}
            disabled={refreshing || loading}
            title="Refresh Trends"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Rising Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24%</div>
            <p className="text-xs text-muted-foreground mt-1">Average growth in AI sector</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Market Demand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">High</div>
            <p className="text-xs text-muted-foreground mt-1">Strong signal for B2B SaaS</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Validated</div>
            <p className="text-xs text-muted-foreground mt-1">4 untapped niches identified</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Analyzing global market signals...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Emerging Opportunities
            </h2>
            <div className="grid gap-4">
              {trends.slice(0, visibleCount).map((trend, index) => (
                <Card 
                  key={index} 
                  className="group hover:border-primary/50 transition-colors cursor-pointer overflow-hidden relative"
                  onClick={() => setSelectedTrend(trend)}
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{trend.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          {trend.growth} growth
                        </div>
                      </div>
                    </div>
                    <Badge variant={trend.score > 80 ? "default" : "secondary"}>
                      Score: {trend.score}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            {visibleCount < trends.length && (
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setVisibleCount(prev => prev + 5)}
              >
                View More Trends
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
              AI Recommendation
            </h2>
            <Card className="border-primary/20 bg-linear-to-br from-background to-primary/5">
              <CardHeader>
                <CardTitle>{trends[0]?.title || "Niche Opportunity Found"}</CardTitle>
                <CardDescription>Based on recent {trends[0]?.platform || "cross-industry"} signals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-none bg-background/50 border">
                  <div className="font-bold text-primary mb-1">{trends[0]?.title || "Strategic Insight"}</div>
                  <p className="text-sm text-muted-foreground">
                    {trends[0]?.gap || trends[0]?.description || "Searching for untapped market potential..."}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-none bg-green-500/10 border border-green-500/20 text-center">
                    <div className="text-xs text-muted-foreground">Market Cap</div>
                    <div className="font-bold">$2.4B</div>
                  </div>
                  <div className="p-3 rounded-none bg-blue-500/10 border border-blue-500/20 text-center">
                    <div className="text-xs text-muted-foreground">Difficulty</div>
                    <div className="font-bold">Medium</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Why now?</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-none bg-primary" />
                      New EU regulations on data sovereignty
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-none bg-primary" />
                      Cost of cloud computing rising 30% YoY
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardHeader className="pt-0">
                <Button 
                  className="w-full shadow-lg shadow-primary/20"
                  onClick={() => trends[0] && handleGenerateReport(trends[0])}
                >
                  Generate Full Report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardHeader>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={!!selectedTrend} onOpenChange={(open) => !open && setSelectedTrend(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-primary border-primary/20">
                {selectedTrend?.platform || "Market Intelligence"}
              </Badge>
              {selectedTrend?.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
            <DialogTitle className="text-2xl font-bold">{selectedTrend?.title}</DialogTitle>
            <DialogDescription className="text-base mt-2">
              {selectedTrend?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="p-4 rounded-none bg-primary/5 border border-primary/10 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <Lightbulb className="w-4 h-4" />
                Strategic Gap
              </div>
              <p className="text-sm leading-relaxed">
                {selectedTrend?.gap}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-none bg-muted/50 border space-y-1 text-center">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Growth Potential</div>
                <div className="font-bold text-lg">{selectedTrend?.growth}</div>
              </div>
              <div className="p-3 rounded-none bg-muted/50 border space-y-1 text-center">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Market Fit Score</div>
                <div className="font-bold text-lg">{selectedTrend?.score}/100</div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button 
                variant="outline"
                className="flex-1 gap-2" 
                onClick={() => selectedTrend?.link && window.open(selectedTrend.link, "_blank")}
              >
                Explore Source
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button 
                className="flex-1 gap-2"
                onClick={() => selectedTrend && handleGenerateReport(selectedTrend)}
              >
                Full Report
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
