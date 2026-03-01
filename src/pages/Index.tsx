import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  Hash,
  TicketCheck,
  Mail,
  Video,
  Shield,
  Zap,
  Lightbulb,
  Info,
  X,
  ArrowUpRight,
  Filter,
  ChevronDown,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel } from "@/components/ChatPanel";
import { useNavigate } from "react-router-dom";

// ─── Project Data ───────────────────────────────────────────────────────────
type ProjectStatus = "on-track" | "at-risk" | "blocked";
type RiskSeverity = "critical" | "high" | "medium" | "low";

const projects = [
  {
    name: "Project Phoenix",
    slug: "project-phoenix",
    status: "on-track" as ProjectStatus,
    progress: 78,
    dueDate: "Mar 10, 2026",
    team: 6,
    owner: "Elena R.",
    lastActivity: "2 min ago",
    signals: "42 Slack · 18 Jira · 3 meetings",
  },
  {
    name: "API Migration v3",
    slug: "api-migration-v3",
    status: "at-risk" as ProjectStatus,
    progress: 45,
    dueDate: "Mar 3, 2026",
    team: 4,
    owner: "David P.",
    lastActivity: "5 min ago",
    signals: "67 Slack · 24 Jira · 8 emails",
  },
  {
    name: "Design System 2.0",
    slug: "design-system-2",
    status: "on-track" as ProjectStatus,
    progress: 92,
    dueDate: "Feb 28, 2026",
    team: 3,
    owner: "Sofia M.",
    lastActivity: "20 min ago",
    signals: "12 Slack · 9 Jira",
  },
  {
    name: "Auth Overhaul",
    slug: "auth-overhaul",
    status: "blocked" as ProjectStatus,
    progress: 33,
    dueDate: "Mar 20, 2026",
    team: 5,
    owner: "James K.",
    lastActivity: "15 min ago",
    signals: "31 Slack · 14 Jira · 5 emails · 2 meetings",
  },
  {
    name: "Mobile App v2",
    slug: "mobile-app-v2",
    status: "on-track" as ProjectStatus,
    progress: 61,
    dueDate: "Apr 5, 2026",
    team: 4,
    owner: "Jade K.",
    lastActivity: "1 hr ago",
    signals: "28 Slack · 16 Jira · 1 meeting",
  },
  {
    name: "Data Pipeline Refactor",
    slug: "data-pipeline-refactor",
    status: "at-risk" as ProjectStatus,
    progress: 28,
    dueDate: "Mar 28, 2026",
    team: 3,
    owner: "Raj M.",
    lastActivity: "3 days ago",
    signals: "19 Slack · 11 Jira · 4 emails",
  },
];

const statusConfig = {
  "on-track": { label: "On Track", icon: CheckCircle2, chip: "text-status-success bg-status-success/10 border-status-success/20" },
  "at-risk": { label: "At Risk", icon: AlertTriangle, chip: "text-status-danger bg-status-danger/10 border-status-danger/20" },
  blocked: { label: "Blocked", icon: Clock, chip: "text-status-warning bg-status-warning/10 border-status-warning/20" },
};


// ─── Risk Data ───────────────────────────────────────────────────────────────
const allRisks = [
  {
    id: 0,
    title: "Auth endpoint blocking 3 downstream teams",
    severity: "critical" as RiskSeverity,
    project: "API Migration v3",
    projectSlug: "api-migration-v3",
    impact: "12–15 person-days delay if unresolved by Friday",
    nextAction: "Schedule emergency sync with vendor support; consider a temporary auth proxy",
    sources: ["Slack", "Jira", "Email"],
    detectedAgo: "2 days ago",
  },
  {
    id: 1,
    title: "Negative sentiment up 40% in Phoenix channels",
    severity: "high" as RiskSeverity,
    project: "Project Phoenix",
    projectSlug: "project-phoenix",
    impact: "2–3 day timeline slip if trend continues",
    nextAction: "Review load-testing environment provisioning with DevOps in next standup",
    sources: ["Slack", "Jira", "Meetings"],
    detectedAgo: "3 days ago",
  },
  {
    id: 2,
    title: "SSO provider API changes scheduled for March",
    severity: "high" as RiskSeverity,
    project: "Auth Overhaul",
    projectSlug: "auth-overhaul",
    impact: "Potential full SSO rework if not addressed before March cutover",
    nextAction: "Contact SSO vendor for migration guide; update timeline in Jira",
    sources: ["Email"],
    detectedAgo: "4 days ago",
  },
  {
    id: 3,
    title: "Client SDK deadline conflicts with testing window",
    severity: "medium" as RiskSeverity,
    project: "API Migration v3",
    projectSlug: "api-migration-v3",
    impact: "Testing window shrinks from 5 to 2 days",
    nextAction: "Negotiate SDK deadline extension with client team",
    sources: ["Email", "Jira"],
    detectedAgo: "1 day ago",
  },
  {
    id: 4,
    title: "New GDPR compliance requirement flagged",
    severity: "medium" as RiskSeverity,
    project: "Auth Overhaul",
    projectSlug: "auth-overhaul",
    impact: "3–5 additional days if encryption approach needs changing",
    nextAction: "30-min review with Legal to assess scope",
    sources: ["Email", "Slack"],
    detectedAgo: "Yesterday",
  },
  {
    id: 5,
    title: "Load testing environment not provisioned",
    severity: "low" as RiskSeverity,
    project: "Project Phoenix",
    projectSlug: "project-phoenix",
    impact: "Cannot validate performance targets ahead of production deploy",
    nextAction: "DevOps to provision staging cluster this sprint",
    sources: ["Jira", "Meetings"],
    detectedAgo: "5 days ago",
  },
];

const severityConfig: Record<RiskSeverity, { label: string; chip: string; bar: string }> = {
  critical: { label: "Critical", chip: "text-status-danger bg-status-danger/10 border-status-danger/20", bar: "bg-status-danger" },
  high: { label: "High", chip: "text-status-warning bg-status-warning/10 border-status-warning/20", bar: "bg-status-warning" },
  medium: { label: "Medium", chip: "text-accent bg-accent/10 border-accent/20", bar: "bg-accent" },
  low: { label: "Low", chip: "text-muted-foreground bg-secondary border-border", bar: "bg-muted-foreground" },
};

const sourceIconMap: Record<string, React.ElementType> = {
  Slack: Hash, Jira: TicketCheck, Email: Mail, Meetings: Video,
};

// ─── Component ───────────────────────────────────────────────────────────────
type StatusFilter = "all" | ProjectStatus;
type OwnershipFilter = "all" | "mine" | "team";
type SeverityFilter = "all" | RiskSeverity;

const Index = () => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [healthCollapsed, setHealthCollapsed] = useState(false);

  // Project filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilter>("all");

  // Risk filters
  const [riskSeverity, setRiskSeverity] = useState<SeverityFilter>("all");
  const [riskProject, setRiskProject] = useState<string>("all");
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null);

  const filteredProjects = projects.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (ownershipFilter === "mine" && p.owner !== "Elena R.") return false;
    return true;
  });

  const filteredRisks = allRisks.filter((r) => {
    if (riskSeverity !== "all" && r.severity !== riskSeverity) return false;
    if (riskProject !== "all" && r.project !== riskProject) return false;
    return true;
  });

  const criticalAndHighCount = allRisks.filter((r) => r.severity === "critical" || r.severity === "high").length;

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search projects, decisions, people..."
                className="h-9 w-72 rounded-lg bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30 transition"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
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

        {/* Main content */}
        <main className="flex-1 p-6 space-y-6 max-w-[1400px]">
          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-foreground">Good morning, Elena</h1>
          </motion.div>


          {/* ── Project Health Overview ───────────────────────────────────── */}
          <div>
            {/* Collapsible header */}
            <button
              onClick={() => setHealthCollapsed(!healthCollapsed)}
              className="w-full flex items-center justify-between mb-3 group"
            >
              <div className="text-left">
                <h2 className="text-lg font-semibold text-foreground">Project Health Overview</h2>
                <p className="text-xs text-muted-foreground">All projects · click any card to drill in</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${healthCollapsed ? "-rotate-90" : ""}`} />
            </button>

            <AnimatePresence initial={false}>
              {!healthCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {/* Filters */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                    {(["all", "on-track", "at-risk", "blocked"] as StatusFilter[]).map((f) => (
                      <button key={f} onClick={() => setStatusFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          statusFilter === f ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/70"
                        }`}>
                        {f === "all" ? "All" : statusConfig[f as ProjectStatus].label}
                      </button>
                    ))}
                    <div className="h-4 w-px bg-border mx-1" />
                    {(["all", "mine", "team"] as OwnershipFilter[]).map((f) => (
                      <button key={f} onClick={() => setOwnershipFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          ownershipFilter === f ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/70"
                        }`}>
                        {f === "all" ? "All Ownership" : f === "mine" ? "My Projects" : "My Team"}
                      </button>
                    ))}
                  </div>

                  {/* 2-column card grid */}
                  {filteredProjects.length === 0 && (
                    <div className="p-8 text-center text-sm text-muted-foreground glass-card">No projects match the current filters.</div>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredProjects.map((p, i) => {
                      const st = statusConfig[p.status];
                      const riskCount = allRisks.filter(r => r.projectSlug === p.slug && (r.severity === "critical" || r.severity === "high")).length;
                      return (
                        <motion.div
                          key={p.slug}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => navigate(`/project/${p.slug}`)}
                          className="glass-card p-5 hover:shadow-card cursor-pointer group transition-all"
                        >
                          {/* Card top row */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="min-w-0 flex-1 pr-3">
                              <p className="text-base font-semibold text-foreground group-hover:text-accent transition-colors truncate">{p.name}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{p.team} members</span>
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due {p.dueDate}</span>
                              </div>
                            </div>
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${st.chip}`}>
                              <st.icon className="w-3 h-3" />{st.label}
                            </span>
                          </div>

                          {/* Progress */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold text-foreground">{p.progress}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${p.progress}%` }}
                                transition={{ duration: 0.8, delay: i * 0.05 }}
                                className="h-full bg-accent rounded-full"
                              />
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="truncate opacity-70">{p.signals}</span>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              {riskCount > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-status-danger bg-status-danger/10 border border-status-danger/20 px-2 py-0.5 rounded-full">
                                  <AlertTriangle className="w-2.5 h-2.5" />{riskCount} risk{riskCount > 1 ? "s" : ""}
                                </span>
                              )}
                              <span className="text-[10px] opacity-60">{p.lastActivity}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Risk Overview & Alerts ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-5"
          >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-status-danger" />
                    <h3 className="font-semibold text-foreground">Risk Overview &amp; Alerts</h3>
                    <span className="text-[10px] font-medium text-status-danger bg-status-danger/10 border border-status-danger/20 px-2 py-0.5 rounded-full">
                      {criticalAndHighCount} critical & high
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-accent" />
                    AI-detected risks from Slack, Jira, meetings &amp; email across all projects.
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {(["all", "critical", "high", "medium", "low"] as ("all" | RiskSeverity)[]).map((s) => (
                  <button key={s} onClick={() => setRiskSeverity(s)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                      riskSeverity === s ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/70"
                    }`}>
                    {s === "all" ? "All severity" : severityConfig[s].label}
                  </button>
                ))}
                <select
                  value={riskProject}
                  onChange={(e) => setRiskProject(e.target.value)}
                  className="ml-auto text-[10px] bg-secondary border-0 rounded-lg px-2 py-1 text-muted-foreground outline-none cursor-pointer"
                >
                  <option value="all">All projects</option>
                  {[...new Set(allRisks.map(r => r.project))].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Risk list */}
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-0.5">
                {filteredRisks.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">No risks match the current filters.</div>
                )}
                {filteredRisks.map((risk) => {
                  const sev = severityConfig[risk.severity];
                  return (
                    <div key={risk.id}>
                      <div
                        onClick={() => setExpandedRisk(expandedRisk === risk.id ? null : risk.id)}
                        className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border/60 hover:bg-secondary/60 cursor-pointer transition-all group"
                      >
                        <div className={`w-1 self-stretch rounded-full shrink-0 ${sev.bar}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sev.chip}`}>{sev.label}</span>
                            <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{risk.project}</span>
                            <span className="text-[10px] text-muted-foreground ml-auto hidden sm:inline">{risk.detectedAgo}</span>
                          </div>
                          <p className="text-sm font-medium text-foreground mt-1">{risk.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{risk.impact}</p>
                          {/* Source icons */}
                          <div className="flex items-center gap-1 mt-1.5">
                            <span className="text-[10px] text-muted-foreground mr-1">From:</span>
                            {risk.sources.map((s) => {
                              const Icon = sourceIconMap[s] || Info;
                              return (
                                <span key={s} title={s} className="w-5 h-5 rounded bg-background border border-border flex items-center justify-center">
                                  <Icon className="w-2.5 h-2.5 text-accent" />
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform ${expandedRisk === risk.id ? "rotate-180" : ""}`} />
                      </div>

                      <AnimatePresence>
                        {expandedRisk === risk.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden"
                          >
                            <div className="mx-1 mb-2 p-3 rounded-xl border border-border bg-card space-y-2">
                              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-status-warning/5 border border-status-warning/20">
                                <Lightbulb className="w-3.5 h-3.5 text-status-warning shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-[10px] font-semibold text-foreground uppercase tracking-wide mb-0.5">Suggested Next Action</p>
                                  <p className="text-xs text-muted-foreground">{risk.nextAction}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={() => navigate(`/project/${risk.projectSlug}`)}
                                  className="text-xs text-accent hover:underline flex items-center gap-1"
                                >
                                  View project <ArrowUpRight className="w-3 h-3" />
                                </button>
                                <button onClick={() => setExpandedRisk(null)} className="p-1 rounded hover:bg-secondary transition-colors">
                                  <X className="w-3 h-3 text-muted-foreground" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
          </motion.div>

        </main>
      </div>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Index;
