import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  BarChart3,
  ArrowUpRight,
  Plus,
  Hash,
  TicketCheck,
  Mail,
  Video,
  Pencil,
  Info,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel } from "@/components/ChatPanel";
import { MessageSquare, Bell } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const sourceIcons = {
  slack: { icon: Hash, label: "Slack" },
  jira: { icon: TicketCheck, label: "Jira" },
  email: { icon: Mail, label: "Email" },
  meeting: { icon: Video, label: "Meetings" },
};

type SourceKey = keyof typeof sourceIcons;

const projects = [
  {
    name: "Project Phoenix",
    slug: "project-phoenix",
    description: "Full platform rebuild with new architecture and improved UX",
    status: "on-track" as const,
    progress: 78,
    risk: "low" as const,
    team: 6,
    dueDate: "Mar 10, 2026",
    trend: "up" as const,
    effort: "High",
    lead: "Sarah Chen",
    decisions: 14,
    openRisks: 1,
    recentActivity: "Sprint review completed — 12 stories delivered",
    sources: ["slack", "jira", "meeting"] as SourceKey[],
    signals: "42 Slack threads · 18 Jira updates · 3 meetings",
    whyStatus: "Velocity trending up 15% over last 3 sprints. All critical-path milestones hit on time. Team sentiment positive in standups.",
    nextMilestone: "Load Testing — Mar 1",
    blockers: [],
    velocityTrend: [38, 42, 44, 48],
  },
  {
    name: "API Migration v3",
    slug: "api-migration-v3",
    description: "Migrate legacy REST endpoints to GraphQL gateway",
    status: "at-risk" as const,
    progress: 45,
    risk: "high" as const,
    team: 4,
    dueDate: "Mar 6, 2026",
    trend: "down" as const,
    effort: "Critical",
    lead: "Marcus Reeves",
    decisions: 8,
    openRisks: 3,
    recentActivity: "Vendor docs flagged as outdated — team blocked",
    sources: ["slack", "jira", "email"] as SourceKey[],
    signals: "67 Slack threads · 24 Jira updates · 8 emails",
    whyStatus: "3 downstream teams blocked on auth endpoint. Vendor documentation outdated. 'Blocked' mentions in Slack up 40% this week.",
    nextMilestone: "Endpoint Migration — Feb 25 (overdue)",
    blockers: ["Vendor auth docs outdated", "SDK breaking changes"],
    velocityTrend: [44, 41, 36, 30],
  },
  {
    name: "Design System 2.0",
    slug: "design-system-2",
    description: "Unified component library with design tokens and accessibility",
    status: "on-track" as const,
    progress: 92,
    risk: "low" as const,
    team: 3,
    dueDate: "Mar 1, 2026",
    trend: "up" as const,
    effort: "Medium",
    lead: "Amira Patel",
    decisions: 6,
    openRisks: 0,
    recentActivity: "Final tokens reviewed — ready for QA",
    sources: ["slack", "jira"] as SourceKey[],
    signals: "12 Slack threads · 9 Jira updates",
    whyStatus: "92% complete with zero open risks. Final QA review scheduled. Contractor engagement finishing on time.",
    nextMilestone: "Documentation — Feb 26",
    blockers: [],
    velocityTrend: [30, 34, 38, 40],
  },
  {
    name: "Auth Overhaul",
    slug: "auth-overhaul",
    description: "Replace custom encryption with industry-standard auth stack",
    status: "blocked" as const,
    progress: 33,
    risk: "medium" as const,
    team: 5,
    dueDate: "Mar 19, 2026",
    trend: "flat" as const,
    effort: "High",
    lead: "Leo Nguyen",
    decisions: 11,
    openRisks: 2,
    recentActivity: "Compliance review pending — legal team notified",
    sources: ["slack", "jira", "email", "meeting"] as SourceKey[],
    signals: "31 Slack threads · 14 Jira updates · 5 emails · 2 meetings",
    whyStatus: "Blocked on compliance review from Legal. SSO provider announced API changes in March. Previous encryption choice caused 3-day downtime.",
    nextMilestone: "SSO Integration — Feb 15 (overdue)",
    blockers: ["Compliance review pending", "SSO API changes incoming"],
    velocityTrend: [28, 25, 22, 22],
  },
  {
    name: "Mobile App v2",
    slug: "mobile-app-v2",
    description: "Native rebuild with offline support and push notifications",
    status: "on-track" as const,
    progress: 61,
    risk: "low" as const,
    team: 4,
    dueDate: "Apr 2, 2026",
    trend: "up" as const,
    effort: "High",
    lead: "Jade Kim",
    decisions: 9,
    openRisks: 1,
    recentActivity: "Offline sync prototype passed internal review",
    sources: ["slack", "jira", "meeting"] as SourceKey[],
    signals: "28 Slack threads · 15 Jira updates · 2 meetings",
    whyStatus: "Offline sync prototype validated. Team velocity increasing. Minor risk around accessibility audit deferral.",
    nextMilestone: "Push Notifications — Mar 10",
    blockers: [],
    velocityTrend: [32, 35, 38, 42],
  },
  {
    name: "Data Pipeline Refactor",
    slug: "data-pipeline-refactor",
    description: "Modernize ETL processes and add real-time streaming capability",
    status: "at-risk" as const,
    progress: 28,
    risk: "medium" as const,
    team: 3,
    dueDate: "Apr 15, 2026",
    trend: "down" as const,
    effort: "Critical",
    lead: "Raj Mehta",
    decisions: 5,
    openRisks: 2,
    recentActivity: "Dependency on vendor SDK update — ETA unknown",
    sources: ["slack", "jira", "email"] as SourceKey[],
    signals: "19 Slack threads · 11 Jira updates · 3 emails",
    whyStatus: "Vendor SDK dependency with unknown ETA. Batch processing can't meet SLA. Team pivoted to streaming but needs ramp-up time.",
    nextMilestone: "Streaming PoC — Mar 5",
    blockers: ["Vendor SDK update ETA unknown"],
    velocityTrend: [22, 20, 18, 15],
  },
];

const statusConfig = {
  "on-track": { label: "On Track", icon: CheckCircle2, className: "text-status-success bg-status-success/10" },
  "at-risk": { label: "At Risk", icon: AlertTriangle, className: "text-status-danger bg-status-danger/10" },
  blocked: { label: "Blocked", icon: Clock, className: "text-status-warning bg-status-warning/10" },
};

const trendIcons = { up: TrendingUp, down: TrendingDown, flat: Minus };

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const Projects = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "on-track" | "at-risk" | "blocked">("all");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  const summary = {
    total: projects.length,
    onTrack: projects.filter((p) => p.status === "on-track").length,
    atRisk: projects.filter((p) => p.status === "at-risk").length,
    blocked: projects.filter((p) => p.status === "blocked").length,
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search projects..."
                className="h-9 w-72 rounded-lg bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30 transition"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-agilow-coral" />
            </button>
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="w-4 h-4" />
              Ask Agilow
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 max-w-[1400px]">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Projects</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {summary.total} active projects · {summary.atRisk} at risk · {summary.blocked} blocked
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </motion.div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "On Track", count: summary.onTrack, total: summary.total, color: "bg-status-success", textColor: "text-status-success" },
              { label: "At Risk", count: summary.atRisk, total: summary.total, color: "bg-status-danger", textColor: "text-status-danger" },
              { label: "Blocked", count: summary.blocked, total: summary.total, color: "bg-status-warning", textColor: "text-status-warning" },
            ].map((s) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                  <span className={`text-lg font-bold ${s.textColor}`}>{s.count}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${(s.count / s.total) * 100}%` }} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(["all", "on-track", "at-risk", "blocked"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {f === "all" ? `All (${summary.total})` : `${statusConfig[f].label} (${projects.filter(p => p.status === f).length})`}
              </button>
            ))}
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((p, i) => {
              const st = statusConfig[p.status];
              const TrendIcon = trendIcons[p.trend];
              const isExpanded = expandedCard === p.slug;
              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card hover:shadow-card transition-shadow group"
                >
                  {/* Clickable card header */}
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => navigate(`/project/${p.slug}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                            {p.name}
                          </h3>
                          <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0 ${st.className}`}>
                        <st.icon className="w-3 h-3" />
                        {st.label}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{p.progress}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.progress}%` }}
                          transition={{ duration: 0.8, delay: i * 0.06 }}
                          className="h-full bg-accent rounded-full"
                        />
                      </div>
                    </div>

                    {/* Metadata row */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> {p.team} members · {p.lead}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Due {p.dueDate}
                      </span>
                    </div>

                    {/* Source + Velocity row */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span className="mr-1">Sources:</span>
                        {p.sources.map((src) => {
                          const S = sourceIcons[src];
                          return (
                            <Tooltip key={src}>
                              <TooltipTrigger>
                                <span className="w-5 h-5 rounded bg-secondary flex items-center justify-center">
                                  <S.icon className="w-3 h-3 text-accent" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent><p className="text-xs">{S.label}</p></TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MiniSparkline data={p.velocityTrend} color={p.trend === "up" ? "hsl(152, 60%, 42%)" : p.trend === "down" ? "hsl(12, 78%, 52%)" : "hsl(215, 15%, 50%)"} />
                        <span className="flex items-center gap-1">
                          <TrendIcon className="w-3.5 h-3.5" /> Velocity
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expand for "Why this status" */}
                  <div className="border-t border-border">
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedCard(isExpanded ? null : p.slug); }}
                      className="flex items-center justify-between w-full px-5 py-2.5 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        Why is this {st.label.toLowerCase()}?
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-4 space-y-3">
                            {/* AI Explanation */}
                            <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                              <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-medium text-foreground mb-0.5">AI Analysis</p>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{p.whyStatus}</p>
                                </div>
                              </div>
                            </div>

                            {/* Next milestone */}
                            <div className="flex items-center gap-2 text-xs">
                              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground">Next milestone:</span>
                              <span className="font-medium text-foreground">{p.nextMilestone}</span>
                            </div>

                            {/* Blockers */}
                            {p.blockers.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-foreground">Active Blockers</p>
                                {p.blockers.map((b, j) => (
                                  <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <AlertTriangle className="w-3 h-3 text-status-danger shrink-0" />
                                    {b}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Signals */}
                            <p className="text-[10px] text-muted-foreground">{p.signals}</p>

                            {/* Manual override hint */}
                            <button className="flex items-center gap-1.5 text-[11px] text-accent hover:underline">
                              <Pencil className="w-3 h-3" />
                              Override status manually
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Projects;
