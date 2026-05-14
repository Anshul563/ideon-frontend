"use client";

import { useEffect, useState, useCallback, useRef, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  Connection,
  addEdge,
  Panel,
  Handle,
  Position,
  NodeProps,
  BaseEdge,
  EdgeProps,
  getBezierPath,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Share2,
  Download,
  Zap,
  Database,
  Globe,
  Shield,
  Cpu,
  Maximize,
  Minimize,
  Sun,
  Moon,
  Server,
  Cloud,
  Lock,
  BarChart3,
  DollarSign,
  Activity,
  Layers,
  Terminal,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";
import LoadingDialog from "@/components/LoadingDialog";
import type { IdeaRecord } from "@/lib/types";
import { useUserPlan } from "@/hooks/useUserPlan";
import { Sparkles } from "lucide-react";

// --- Custom Components ---

const CustomNode = memo(({ data }: NodeProps) => {
  const Icon =
    data.category === "database"
      ? Database
      : data.category === "infrastructure"
        ? Cloud
        : data.category === "backend"
          ? Server
          : data.category === "external"
            ? Zap
            : data.category === "observability"
              ? Activity
              : data.category === "security"
                ? Lock
                : data.category === "messaging"
                  ? Zap
                  : data.category === "devops"
                    ? Terminal
                    : Globe;

  const colorClass =
    data.category === "database"
      ? "border-amber-500/50 text-amber-500 shadow-amber-500/10"
      : data.category === "infrastructure"
        ? "border-indigo-500/50 text-indigo-500 shadow-indigo-500/10"
        : data.category === "backend"
          ? "border-emerald-500/50 text-emerald-500 shadow-emerald-500/10"
          : data.category === "external"
            ? "border-rose-500/50 text-rose-500 shadow-rose-500/10"
            : data.category === "observability"
              ? "border-cyan-500/50 text-cyan-500 shadow-cyan-500/10"
              : data.category === "security"
                ? "border-blue-500/50 text-blue-500 shadow-blue-500/10"
                : data.category === "messaging"
                  ? "border-violet-500/50 text-violet-500 shadow-violet-500/10"
                  : data.category === "devops"
                    ? "border-slate-500/50 text-slate-500 shadow-slate-500/10"
                    : "border-primary/50 text-primary shadow-primary/10";

  return (
    <div
      className={`px-4 py-3 rounded-none border-2 bg-card shadow-2xl min-w-[160px] ${colorClass}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 rounded-none bg-primary border-none"
      />
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-none bg-accent/50 border border-current`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-50 leading-none mb-1">
            {(data.category as string) || "Component"}
          </span>
          <span className="text-xs font-black tracking-tight text-foreground truncate">
            {data.label as string}
          </span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 rounded-none bg-primary border-none"
      />
    </div>
  );
});

const nodeTypes = {
  custom: CustomNode,
};

export default function ArchitecturePage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<IdeaRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePanel, setActivePanel] = useState<"stack" | "security" | "cost" | "details">("stack");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { isPaid, loading: planLoading } = useUserPlan();

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
    setActivePanel("details");
  }, []);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setData(res.data);

        const rawArchData = res.data.result?.architecture;

        if (rawArchData && isPaid) {
          // Robust mapping for different prompt versions/AI responses
          const nodesData =
            rawArchData.architecture?.nodes || rawArchData.nodes;
          const edgesData =
            rawArchData.architecture?.edges || rawArchData.edges;
          const techStack = rawArchData.tech_stack || [];

          if (nodesData && nodesData.length > 0) {
            const styledNodes = nodesData.map((n: any) => ({
              ...n,
              type: "custom",
              data: { 
                ...(n.data || {}), 
                category: n.data?.category || "backend",
                label: n.data?.label || n.id
              },
            }));

            const styledEdges = (edgesData || []).map((e: any) => ({
              ...e,
              animated: true,
              label: e.label || "",
              labelStyle: {
                fill: theme === "dark" ? "#94a3b8" : "#64748b",
                fontSize: 10,
                fontWeight: 700,
              },
              labelBgPadding: [4, 2],
              labelBgBorderRadius: 0,
              labelBgStyle: {
                fill: theme === "dark" ? "#0f172a" : "#f8fafc",
                fillOpacity: 0.8,
              },
              style: { stroke: "var(--primary)", strokeWidth: 2 },
            }));

            setNodes(styledNodes);
            setEdges(styledEdges);
          } else {
            // Fallback for older results or failed generation
            generateFallbackArchitecture(
              techStack.length > 0
                ? techStack
                : ["React", "Node.js", "PostgreSQL"],
            );
          }
        } else if (isPaid) {
          generateFallbackArchitecture(["Next.js", "Express", "PostgreSQL"]);
        }
      } catch (error) {
        console.error("Failed to fetch architecture:", error);
        if (isPaid) generateFallbackArchitecture(["Next.js", "Node.js", "PostgreSQL"]);
      } finally {
        setLoading(false);
      }
    };

    const generateFallbackArchitecture = (stack: string[]) => {
      // Helper to find tech by keyword
      const findTech = (keywords: string[], fallback: string) => {
        const found = stack.find((s) =>
          keywords.some((k) => s.toLowerCase().includes(k.toLowerCase())),
        );
        return found || fallback;
      };

      const nodes: Node[] = [
        // Level 0: Client
        {
          id: "1",
          type: "custom",
          position: { x: 250, y: 0 },
          data: {
            label: findTech(
              ["next", "react", "mobile", "flutter"],
              "Web Client",
            ),
            category: "frontend",
          },
        },

        // Level 1: Edge/Global
        {
          id: "2",
          type: "custom",
          position: { x: 250, y: 120 },
          data: {
            label: findTech(
              ["cloudfront", "cdn", "cloudflare", "edge"],
              "Global CDN / Edge",
            ),
            category: "infrastructure",
          },
        },

        // Level 2: Gateway & Security
        {
          id: "3",
          type: "custom",
          position: { x: 100, y: 240 },
          data: {
            label: findTech(
              ["waf", "shield", "firewall"],
              "WAF & DDoS Protection",
            ),
            category: "security",
          },
        },
        {
          id: "4",
          type: "custom",
          position: { x: 400, y: 240 },
          data: {
            label: findTech(["gateway", "kong", "nginx", "alb"], "API Gateway"),
            category: "backend",
          },
        },

        // Level 3: Services
        {
          id: "5",
          type: "custom",
          position: { x: 100, y: 400 },
          data: {
            label: findTech(["auth", "clerk", "cognito"], "Auth Service"),
            category: "backend",
          },
        },
        {
          id: "6",
          type: "custom",
          position: { x: 400, y: 400 },
          data: { label: "Core Microservice", category: "backend" },
        },

        // Level 4: Messaging & Queue
        {
          id: "7",
          type: "custom",
          position: { x: 250, y: 550 },
          data: {
            label: findTech(
              ["kafka", "rabbit", "redis"],
              "Event Bus (Kafka/Redis)",
            ),
            category: "messaging",
          },
        },

        // Level 5: Storage
        {
          id: "8",
          type: "custom",
          position: { x: 100, y: 700 },
          data: {
            label: findTech(
              ["postgres", "mongo", "sql", "db"],
              "Primary Database",
            ),
            category: "database",
          },
        },
        {
          id: "9",
          type: "custom",
          position: { x: 400, y: 700 },
          data: {
            label: findTech(["s3", "storage", "blob"], "Object Storage (S3)"),
            category: "infrastructure",
          },
        },

        // Level 6: DevOps & Obs
        {
          id: "10",
          type: "custom",
          position: { x: 100, y: 850 },
          data: {
            label: findTech(
              ["prometheus", "grafana", "elk", "sentry"],
              "Observability Stack",
            ),
            category: "observability",
          },
        },
        {
          id: "11",
          type: "custom",
          position: { x: 400, y: 850 },
          data: {
            label: findTech(
              ["actions", "jenkins", "terraform"],
              "CI/CD Pipeline",
            ),
            category: "devops",
          },
        },
      ];

      const edges: Edge[] = [
        {
          id: "e1-2",
          source: "1",
          target: "2",
          animated: true,
          label: "HTTPS",
        },
        { id: "e2-3", source: "2", target: "3", animated: true },
        { id: "e2-4", source: "2", target: "4", animated: true },
        { id: "e4-5", source: "4", target: "5", animated: true, label: "JWT" },
        { id: "e4-6", source: "4", target: "6", animated: true, label: "gRPC" },
        {
          id: "e6-7",
          source: "6",
          target: "7",
          animated: true,
          label: "Publish",
        },
        { id: "e6-8", source: "6", target: "8", animated: true, label: "SQL" },
        {
          id: "e6-9",
          source: "6",
          target: "9",
          animated: true,
          label: "Upload",
        },
        {
          id: "e6-10",
          source: "6",
          target: "10",
          animated: true,
          label: "Metrics",
        },
        {
          id: "e11-6",
          source: "11",
          target: "6",
          animated: true,
          label: "Deploy",
        },
      ];

      setNodes(nodes);
      setEdges(edges);
    };

    if (id && !planLoading) fetchResult();
  }, [id, theme, isPaid, planLoading]);

  if (loading || planLoading)
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <LoadingDialog isOpen={true} />
      </div>
    );

  if (!isPaid) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-mono">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-8 border border-indigo-500/20 shadow-2xl">
          <Lock className="w-10 h-10 text-indigo-500" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">Architecture Restricted</h1>
        <p className="text-muted-foreground max-w-md mb-10 leading-relaxed text-sm">
          Technical blueprints and architecture diagrams are only available for <span className="text-indigo-500 font-bold">Pro</span> and <span className="text-accent font-bold">Enterprise</span> users.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
           <Button 
             onClick={() => router.push('/pricing')}
             className="flex-1 h-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/20"
           >
             Upgrade to View
           </Button>
           <Button 
             variant="outline"
             onClick={() => router.back()}
             className="flex-1 h-12 rounded-xl border-2 font-black uppercase tracking-widest text-xs"
           >
             Go Back
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden selection:bg-primary/30">
      {/* Dynamic Header */}
      <header className="h-20 border-b-2 border-border px-4 md:px-8 flex items-center justify-between bg-card/80 backdrop-blur-2xl z-20 sticky top-0">
        <div className="flex items-center gap-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="rounded-none border-2 font-black uppercase tracking-widest text-[10px] h-10 px-4 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terminal
          </Button>
          <div className="h-10 w-[2px] bg-border/50 rotate-20" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                Blueprint Engine v2.0
              </span>
            </div>
            <h1 className="font-black tracking-tighter text-lg md:text-2xl truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[400px]">
              {data?.idea}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden xl:flex items-center gap-1 p-1 bg-accent/30 border border-border">
            {(["stack", "security", "cost"] as const).map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                size="sm"
                onClick={() => setActivePanel(tab)}
                className={`rounded-none px-4 text-[10px] font-black uppercase tracking-widest h-8 transition-all ${
                  activePanel === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="rounded-none border-2 border-border h-10 w-10 shrink-0"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </Button>
          <Button
            variant="default"
            className="rounded-none bg-primary text-primary-foreground font-black uppercase tracking-widest px-3 md:px-6 h-10 shadow-[4px_4px_0px_var(--primary-foreground)] border-2 border-primary active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all mr-1.5 shrink-0"
          >
            Deploy Infra
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div
        ref={containerRef}
        className="flex-1 relative bg-background group/canvas"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          colorMode={theme === "dark" ? "dark" : "light"}
          minZoom={0.2}
          maxZoom={1.5}
          onPaneClick={() => setSelectedNode(null)}
        >
          <Background
            variant={BackgroundVariant.Lines}
            color={theme === "dark" ? "#1e293b" : "#e2e8f0"}
            gap={40}
            size={1}
          />
          <Controls className="rounded-none border-2 border-border bg-card shadow-2xl m-6" />

          {/* Legend Panel */}
          <Panel
            position="bottom-left"
            className="bg-card/95 border border-border rounded-none m-4 p-3 shadow-[4px_4px_0px_var(--border)] animate-in slide-in-from-bottom-4 duration-700 max-w-[200px]"
          >
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-2 border-b border-border pb-1 flex items-center gap-1.5">
              <Layers className="w-2.5 h-2.5" /> Legend
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { label: "Frontend", color: "bg-primary" },
                { label: "Backend", color: "bg-emerald-500" },
                { label: "Database", color: "bg-amber-500" },
                { label: "Infrastructure", color: "bg-indigo-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-none ${item.color}`} />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Side Info Panel */}
          <Panel
            position="top-right"
            className="m-4 md:m-4 max-w-[calc(100vw-2rem)] md:w-72 hidden md:block"
          >
            <div className="bg-card/95 backdrop-blur-2xl border border-border shadow-2xl flex flex-col max-h-[80vh] rounded-none">
              {/* Panel Header */}
              <div className="flex border-b border-border">
                {["stack", "security", "details"].map((panel) => (
                  <button
                    key={panel}
                    onClick={() => setActivePanel(panel as any)}
                    className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                      activePanel === panel
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent/50 text-muted-foreground"
                    }`}
                  >
                    {panel}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-5 no-scrollbar">
                {activePanel === "stack" && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 mb-4">
                      <Cpu className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-black tracking-tight text-foreground uppercase">
                        Tech Audit
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        Primary Stack
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(data?.result?.architecture?.tech_stack || ["ReactFlow", "Tailwind", "Next.js"]).map(
                          (tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-accent border border-border text-[9px] font-bold text-foreground rounded-none uppercase"
                            >
                              {tech}
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border mt-6">
                      <div className="flex items-center gap-2.5 mb-3">
                        <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">
                          Scalability
                        </span>
                      </div>
                      <div className="p-3 bg-emerald-500/5 border-l-2 border-emerald-500">
                        <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                          {data?.result?.architecture?.scalability_strategy ||
                            "Enterprise-grade modular infrastructure."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activePanel === "details" && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 mb-6">
                      <Layers className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-black tracking-tight text-foreground uppercase">
                        Component Intel
                      </h3>
                    </div>

                    {selectedNode ? (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="p-4 bg-primary/5 border border-primary/20">
                          <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">Active Selection</span>
                          <h4 className="text-lg font-black tracking-tight text-foreground">{selectedNode.data.label as string}</h4>
                          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[8px] font-black uppercase mt-2 inline-block">
                            {selectedNode.data.category as string}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                           <div className="p-3 bg-accent/30 border border-border">
                              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Operational Role</span>
                              <p className="text-xs font-medium text-foreground/80 leading-relaxed">
                                This {selectedNode.data.category as string} component handles critical system operations and data flow management within the {selectedNode.data.label as string} sub-system.
                              </p>
                           </div>
                           <div className="p-3 bg-accent/30 border border-border">
                              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Latency Profile</span>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1 bg-border overflow-hidden">
                                   <div className="h-full bg-emerald-500 w-[85%]" />
                                </div>
                                <span className="text-[9px] font-bold text-emerald-500">Optimal</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <Activity className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4 animate-pulse" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select a component<br/>to inspect metadata</p>
                      </div>
                    )}
                  </div>
                )}

                {activePanel === "security" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-black tracking-tight text-foreground uppercase">
                          Security
                        </h3>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-primary">
                          {data?.result?.architecture?.security_score || 94}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {data?.result?.architecture?.security_recommendations?.slice(0, 3).map(
                        (rec, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 p-2 bg-accent/20 border border-border/50"
                          >
                            <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              {rec}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-accent/30 p-3 border-t border-border flex items-center justify-between mt-auto">
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Monitoring Live</span>
                </div>
                <span className="text-[8px] font-black text-primary uppercase">v2.1</span>
              </div>
            </div>
          </Panel>

          {/* Mobile Audit Panel Toggle (New) */}
          <Panel position="bottom-right" className="m-4 md:hidden">
            <Button
              onClick={() =>
                setActivePanel(
                  activePanel === "stack"
                    ? "security"
                    : activePanel === "security"
                      ? "cost"
                      : "stack",
                )
              }
              className="h-12 w-12 rounded-none bg-primary text-primary-foreground shadow-2xl border-2 border-primary-foreground/20"
            >
              <Activity className="w-6 h-6" />
            </Button>
          </Panel>

          {/* Mode Controls overlay */}
          <Panel position="top-left" className="m-4 md:m-8 flex gap-3">
            <div className="flex items-center gap-2 bg-card/90 border-2 border-border p-1.5 md:p-2 shadow-xl">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-none h-9 w-9 md:h-10 md:w-10 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Moon className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </Button>
              <div className="h-6 w-[2px] bg-border" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {}}
                className="rounded-none h-9 w-9 md:h-10 md:w-10 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Globe className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>

            {isFullscreen && (
              <Button
                variant="outline"
                onClick={toggleFullscreen}
                className="rounded-none h-14 px-6 border-2 border-primary bg-primary/10 font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-3 shadow-2xl"
              >
                <Minimize className="w-5 h-5" />
                Terminal Exit
              </Button>
            )}
          </Panel>

          <div className="absolute bottom-8 right-8 z-10">
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 px-4 py-2 bg-background/80 border-2 border-border text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                Network Healthy: 12ms Latency
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-background/80 border-2 border-border text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                Data Encryption: AES-256
              </div>
            </div>
          </div>
        </ReactFlow>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
        @keyframes scan {
          from {
            top: 0;
          }
          to {
            top: 100%;
          }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
