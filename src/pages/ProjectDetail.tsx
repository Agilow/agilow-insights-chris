import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, AlertTriangle, Clock, TrendingUp, TrendingDown, Minus, Hash, TicketCheck, Mail, Video, Users, Calendar, GitBranch, Flag, AlertCircle, Info, ExternalLink } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const sourceIcons = {
  slack: { icon: Hash, label: "Slack" },
  jira: { icon: TicketCheck, label: "Jira" },
  email: { icon: Mail, label: "Email" },
  meeting: { icon: Video, label: "Meetings" },
};

type SourceKey = keyof typeof sourceIcons;

const projectsData: Record<string, {
  name: string;
  status: "on-track" | "at-risk" | "blocked";
  progress: number;
  risk: string;
  team: { name: string; role: string }[];
  dueIn: string;
  trend: "up" | "down" | "flat";
  effort: string;
  sources: SourceKey[];
  signals: string;
  description: string;
  milestones: { name: string; date: string; done: boolean }[];
  decisions: { date: string; title: string; rationale: string; flagged: boolean; sources: string[] }[];
  risks: { description: string; severity: "high" | "medium" | "low"; source: string }[];
  dataBreakdown: { source: string; items: number; lastActivity: string }[];
}> = {
  "project-phoenix": {
    name: "Project Phoenix",
    status: "on-track",
    progress: 78,
    risk: "low",
    team: [
      { name: "Elena R.", role: "PM" },
      { name: "James K.", role: "Lead Engineer" },
      { name: "Sofia M.", role: "Designer" },
      { name: "Alex T.", role: "Backend" },
      { name: "Maya L.", role: "Frontend" },
      { name: "Ryan C.", role: "QA" },
    ],
    dueIn: "12 days",
    trend: "up",
    effort: "High",
    sources: ["slack", "jira", "meeting"],
    signals: "42 Slack threads · 18 Jira updates · 3 meetings",
    description: "Complete platform rebuild with new microservices architecture. Migration of legacy monolith to cloud-native services with zero downtime deployment strategy.",
    milestones: [
      { name: "Architecture Review", date: "Jan 15", done: true },
      { name: "Core API Migration", date: "Feb 1", done: true },
      { name: "Auth Integration", date: "Feb 20", done: true },
      { name: "Load Testing", date: "Mar 1", done: false },
      { name: "Production Deploy", date: "Mar 10", done: false },
    ],
    decisions: [
      { date: "Feb 24", title: "Postpone OAuth to Phase 2", rationale: "Avoid 2-week delay on vendor integration. Team consensus in standup.", flagged: false, sources: ["Meeting transcript", "JIRA PHX-189"] },
      { date: "Feb 18", title: "Switch to Redis for session cache", rationale: "Memcached hitting limits at scale. Redis cluster handles 3x throughput.", flagged: false, sources: ["Slack #phoenix-eng", "JIRA PHX-156"] },
      { date: "Feb 10", title: "Skip E2E tests for internal admin", rationale: "Saved 3 days but caused 2 regressions in admin panel.", flagged: true, sources: ["Post-mortem", "JIRA PHX-142"] },
    ],
    risks: [
      { description: "Load testing environment not yet provisioned", severity: "medium", source: "JIRA PHX-201" },
      { description: "Third-party payment SDK update may break integration", severity: "low", source: "Slack #phoenix-eng" },
    ],
    dataBreakdown: [
      { source: "Slack", items: 42, lastActivity: "2 min ago" },
      { source: "Jira", items: 18, lastActivity: "12 min ago" },
      { source: "Meetings", items: 3, lastActivity: "Yesterday" },
    ],
  },
  "api-migration-v3": {
    name: "API Migration v3",
    status: "at-risk",
    progress: 45,
    risk: "high",
    team: [
      { name: "David P.", role: "PM" },
      { name: "Sarah W.", role: "Lead Engineer" },
      { name: "Tom H.", role: "Backend" },
      { name: "Lisa N.", role: "DevOps" },
    ],
    dueIn: "8 days",
    trend: "down",
    effort: "Critical",
    sources: ["slack", "jira", "email"],
    signals: "67 Slack threads · 24 Jira updates · 8 emails",
    description: "Migrate all public-facing APIs from REST v2 to GraphQL gateway. Three downstream teams depend on completion for their Q1 releases.",
    milestones: [
      { name: "Schema Design", date: "Jan 20", done: true },
      { name: "Gateway Setup", date: "Feb 5", done: true },
      { name: "Endpoint Migration", date: "Feb 25", done: false },
      { name: "Client SDK Update", date: "Mar 3", done: false },
    ],
    decisions: [
      { date: "Feb 20", title: "Migrate to GraphQL gateway", rationale: "Reduces API calls by 60%. Approved by architecture review board.", flagged: false, sources: ["Email thread", "JIRA API-402"] },
      { date: "Feb 15", title: "Use vendor auth library as-is", rationale: "Docs outdated — caused 3 team blocks. Now evaluating alternatives.", flagged: true, sources: ["Slack #api-team", "Incident report"] },
    ],
    risks: [
      { description: "3 teams blocked on auth endpoint — vendor docs outdated", severity: "high", source: "Slack #api-team" },
      { description: "Client SDK deadline conflicts with testing window", severity: "medium", source: "Email / PM sync" },
    ],
    dataBreakdown: [
      { source: "Slack", items: 67, lastActivity: "5 min ago" },
      { source: "Jira", items: 24, lastActivity: "8 min ago" },
      { source: "Email", items: 8, lastActivity: "1 hour ago" },
    ],
  },
  "design-system-2": {
    name: "Design System 2.0",
    status: "on-track",
    progress: 92,
    risk: "low",
    team: [
      { name: "Sofia M.", role: "Lead Designer" },
      { name: "Maya L.", role: "Frontend" },
      { name: "Contractor", role: "Design Tokens" },
    ],
    dueIn: "3 days",
    trend: "up",
    effort: "Medium",
    sources: ["slack", "jira"],
    signals: "12 Slack threads · 9 Jira updates",
    description: "Unify design tokens, component library, and documentation for all product teams.",
    milestones: [
      { name: "Token Audit", date: "Jan 28", done: true },
      { name: "Component Library", date: "Feb 14", done: true },
      { name: "Documentation", date: "Feb 26", done: false },
    ],
    decisions: [
      { date: "Feb 14", title: "Hire contractor for design tokens", rationale: "Internal team overloaded. 4-week engagement approved.", flagged: false, sources: ["Slack #design", "Budget approval email"] },
    ],
    risks: [],
    dataBreakdown: [
      { source: "Slack", items: 12, lastActivity: "20 min ago" },
      { source: "Jira", items: 9, lastActivity: "1 hour ago" },
    ],
  },
  "auth-overhaul": {
    name: "Auth Overhaul",
    status: "blocked",
    progress: 33,
    risk: "medium",
    team: [
      { name: "James K.", role: "Lead Engineer" },
      { name: "Alex T.", role: "Backend" },
      { name: "Ryan C.", role: "QA" },
      { name: "David P.", role: "PM" },
      { name: "Legal Team", role: "Compliance" },
    ],
    dueIn: "21 days",
    trend: "flat",
    effort: "High",
    sources: ["slack", "jira", "email", "meeting"],
    signals: "31 Slack threads · 14 Jira updates · 5 emails · 2 meetings",
    description: "Complete overhaul of authentication system to support SSO, MFA, and new compliance requirements.",
    milestones: [
      { name: "Requirements Gathering", date: "Jan 10", done: true },
      { name: "SSO Integration", date: "Feb 15", done: false },
      { name: "MFA Implementation", date: "Mar 1", done: false },
      { name: "Compliance Audit", date: "Mar 15", done: false },
    ],
    decisions: [
      { date: "Feb 20", title: "Custom encryption library adopted", rationale: "Chosen for speed, but caused 3-day downtime. Replacement planned Q3.", flagged: true, sources: ["Slack #auth-team", "Post-mortem doc"] },
    ],
    risks: [
      { description: "New compliance requirement flagged in email thread", severity: "medium", source: "Email / Legal" },
      { description: "SSO provider API changes scheduled for March", severity: "high", source: "Vendor notification email" },
    ],
    dataBreakdown: [
      { source: "Slack", items: 31, lastActivity: "15 min ago" },
      { source: "Jira", items: 14, lastActivity: "30 min ago" },
      { source: "Email", items: 5, lastActivity: "2 hours ago" },
      { source: "Meetings", items: 2, lastActivity: "Yesterday" },
    ],
  },
};

const statusConfig = {
  "on-track": { label: "On Track", icon: CheckCircle2, className: "text-status-success bg-status-success/10" },
  "at-risk": { label: "At Risk", icon: AlertTriangle, className: "text-status-danger bg-status-danger/10" },
  blocked: { label: "Blocked", icon: Clock, className: "text-status-warning bg-status-warning/10" },
};

const trendIcons = { up: TrendingUp, down: TrendingDown, flat: Minus };

const severityColors = {
  high: "border-l-status-danger bg-status-danger/5",
  medium: "border-l-status-warning bg-status-warning/5",
  low: "border-l-agilow-teal bg-accent/5",
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = projectsData[slug || ""];

  if (!project) {
    return (
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground mb-2">Project not found</h1>
            <Link to="/" className="text-sm text-accent hover:underline">Back to dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const st = statusConfig[project.status];
  const TrendIcon = trendIcons[project.trend];

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 space-y-6 max-w-[1400px]">
          {/* Back + Header */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{project.description}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${st.className}`}>
                <st.icon className="w-4 h-4" />
                {st.label}
              </span>
            </div>
          </motion.div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Progress", value: `${project.progress}%`, sub: project.effort + " effort" },
              { label: "Team", value: `${project.team.length}`, sub: "members" },
              { label: "Due In", value: project.dueIn, sub: "remaining" },
              { label: "Decisions", value: `${project.decisions.length}`, sub: "logged" },
              { label: "Risks", value: `${project.risks.length}`, sub: "identified" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Progress bar full width */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">Progress</h3>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendIcon className="w-4 h-4" /> Velocity {project.trend === "up" ? "↑" : project.trend === "down" ? "↓" : "—"}
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 1 }} className="h-full bg-accent rounded-full" />
            </div>
          </motion.div>

          {/* Data Provenance */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-foreground">Data Sources</h3>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-[200px]">All project insights are derived from these connected data sources via MCP aggregation.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {project.dataBreakdown.map((d) => (
                <div
                  key={d.source}
                  onClick={() => navigate(`/sources?source=${d.source.toLowerCase()}&project=${slug}`)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50 cursor-pointer hover:bg-secondary hover:shadow-soft transition-all group"
                >
                   <div className="p-2 rounded-lg bg-background">
                     {d.source === "Slack" && <Hash className="w-4 h-4 text-accent" />}
                     {d.source === "Jira" && <TicketCheck className="w-4 h-4 text-accent" />}
                     {d.source === "Email" && <Mail className="w-4 h-4 text-accent" />}
                     {d.source === "Meetings" && <Video className="w-4 h-4 text-accent" />}
                   </div>
                   <div className="flex-1">
                     <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{d.source}</p>
                     <p className="text-[11px] text-muted-foreground">{d.items} items · {d.lastActivity}</p>
                   </div>
                   <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Milestones */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5">
              <h3 className="font-semibold text-foreground mb-3">Milestones</h3>
              <div className="space-y-3">
                {project.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${m.done ? "bg-status-success/10" : "bg-secondary"}`}>
                      {m.done ? <CheckCircle2 className="w-3.5 h-3.5 text-status-success" /> : <Clock className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${m.done ? "text-foreground" : "text-muted-foreground"}`}>{m.name}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{m.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Team */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-foreground">Team</h3>
              </div>
              <div className="space-y-2">
                {project.team.map((t) => (
                  <div key={t.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                        {t.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium text-foreground">{t.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{t.role}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Risks */}
          {project.risks.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
              <h3 className="font-semibold text-foreground mb-3">Risks</h3>
              <div className="space-y-2">
                {project.risks.map((r, i) => (
                  <div key={i} className={`border-l-[3px] rounded-lg p-3 ${severityColors[r.severity]}`}>
                    <p className="text-sm text-foreground">{r.description}</p>
                    <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full mt-1 inline-block">{r.source}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Decision History */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Decision History</h3>
            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-4">
                {project.decisions.map((d, i) => (
                  <div key={i} className="flex gap-3 relative">
                    <div className="shrink-0 mt-1 z-10">
                      {d.flagged ? (
                        <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                          <AlertCircle className="w-3.5 h-3.5 text-agilow-coral" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-muted-foreground">{d.date}</span>
                        {d.flagged && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-agilow-coral bg-destructive/10 px-1.5 py-0.5 rounded-full">
                            <Flag className="w-2.5 h-2.5" /> Lesson Learned
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-foreground">{d.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{d.rationale}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {d.sources.map((s, j) => (
                          <span key={j} className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                            <GitBranch className="w-2.5 h-2.5" /> {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
