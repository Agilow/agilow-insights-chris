import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Bell,
  MessageSquare,
  Plus,
  ArrowUpRight,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel } from "@/components/ChatPanel";

const statusConfig = {
  "on-track": { label: "On Track", icon: CheckCircle2, className: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  "at-risk": { label: "At Risk", icon: AlertTriangle, className: "text-amber-700 bg-amber-50 border-amber-200" },
  "blocked": { label: "Blocked", icon: Clock, className: "text-red-700 bg-red-50 border-red-200" },
  "off-track": { label: "Off Track", icon: XCircle, className: "text-red-700 bg-red-50 border-red-200" },
};

const riskConfig = {
  low: "text-emerald-700 bg-emerald-50 border-emerald-200",
  medium: "text-amber-700 bg-amber-50 border-amber-200",
  high: "text-red-700 bg-red-50 border-red-200",
};

const ownerColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-cyan-500",
];

type ProjectStatus = keyof typeof statusConfig;
type RiskLevel = keyof typeof riskConfig;

interface Project {
  name: string;
  slug: string;
  description: string;
  owner: string;
  ownerInitials: string;
  status: ProjectStatus;
  progress: number;
  stage: string;
  timeInProgress: string;
  lastActivity: string;
  lastActivityWarning: boolean;
  risk: RiskLevel;
}

const projects: Project[] = [
  {
    name: "Project Phoenix",
    slug: "project-phoenix",
    description: "Full platform rebuild with new architecture and improved UX",
    owner: "Sarah",
    ownerInitials: "SC",
    status: "on-track",
    progress: 78,
    stage: "Build",
    timeInProgress: "94d",
    lastActivity: "1d ago",
    lastActivityWarning: false,
    risk: "low",
  },
  {
    name: "API Migration v3",
    slug: "api-migration-v3",
    description: "Migrate legacy REST endpoints to GraphQL gateway",
    owner: "Marcus",
    ownerInitials: "MR",
    status: "at-risk",
    progress: 45,
    stage: "Build",
    timeInProgress: "118d",
    lastActivity: "3d ago",
    lastActivityWarning: false,
    risk: "high",
  },
  {
    name: "Design System 2.0",
    slug: "design-system-2",
    description: "Unified component library with design tokens and accessibility",
    owner: "Amira",
    ownerInitials: "AP",
    status: "on-track",
    progress: 92,
    stage: "Rollout",
    timeInProgress: "178d",
    lastActivity: "2d ago",
    lastActivityWarning: false,
    risk: "low",
  },
  {
    name: "Auth Overhaul",
    slug: "auth-overhaul",
    description: "Replace custom encryption with industry-standard auth stack",
    owner: "Leo",
    ownerInitials: "LN",
    status: "blocked",
    progress: 33,
    stage: "Testing",
    timeInProgress: "136d",
    lastActivity: "7d ago",
    lastActivityWarning: false,
    risk: "high",
  },
  {
    name: "Mobile App v2",
    slug: "mobile-app-v2",
    description: "Native rebuild with offline support and push notifications",
    owner: "Jade",
    ownerInitials: "JK",
    status: "on-track",
    progress: 61,
    stage: "Build",
    timeInProgress: "87d",
    lastActivity: "1d ago",
    lastActivityWarning: false,
    risk: "medium",
  },
  {
    name: "Data Pipeline Refactor",
    slug: "data-pipeline-refactor",
    description: "Modernize ETL processes and add real-time streaming capability",
    owner: "Raj",
    ownerInitials: "RM",
    status: "off-track",
    progress: 28,
    stage: "Testing",
    timeInProgress: "104d",
    lastActivity: "17d ago",
    lastActivityWarning: true,
    risk: "high",
  },
];

function ProgressBar({ value, status }: { value: number; status: ProjectStatus }) {
  const color =
    status === "on-track" && value > 70
      ? "bg-emerald-500"
      : status === "on-track"
      ? "bg-amber-400"
      : status === "at-risk"
      ? "bg-blue-600"
      : status === "blocked"
      ? "bg-blue-600"
      : "bg-blue-600";

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-sm text-foreground font-medium w-10">{value}%</span>
    </div>
  );
}

const Projects = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");
  const navigate = useNavigate();

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  const summary = {
    total: projects.length,
    onTrack: projects.filter((p) => p.status === "on-track").length,
    atRisk: projects.filter((p) => p.status === "at-risk").length,
    blocked: projects.filter((p) => p.status === "blocked").length,
    offTrack: projects.filter((p) => p.status === "off-track").length,
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

        <main className="flex-1 p-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Projects</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {summary.total} active · {summary.onTrack} on track · {summary.atRisk + summary.offTrack} need attention · {summary.blocked} blocked
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </motion.div>

          {/* Filters */}
          <div className="flex gap-2">
            {(["all", "on-track", "at-risk", "blocked", "off-track"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {f === "all"
                  ? `All (${summary.total})`
                  : `${statusConfig[f].label} (${projects.filter((p) => p.status === f).length})`}
              </button>
            ))}
          </div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3.5">
                      Project
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3.5">
                      Owner
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3.5">
                      Status
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3.5">
                      Progress
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3.5">
                      Stage
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3.5">
                      Time in Progress
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3.5">
                      Last Activity
                    </th>
                    <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3.5">
                      Risk
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => {
                    const st = statusConfig[p.status];
                    return (
                      <motion.tr
                        key={p.slug}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => navigate(`/project/${p.slug}`)}
                        className="border-b border-border/50 last:border-0 hover:bg-secondary/30 cursor-pointer transition-colors group"
                      >
                        {/* Project */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <div>
                              <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                                {p.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 max-w-[280px] truncate">
                                {p.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Owner */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-7 h-7 rounded-full ${ownerColors[i % ownerColors.length]} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}
                            >
                              {p.ownerInitials}
                            </span>
                            <span className="text-sm text-foreground">{p.owner}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded border ${st.className}`}
                          >
                            {st.label}
                          </span>
                        </td>

                        {/* Progress */}
                        <td className="px-4 py-4">
                          <ProgressBar value={p.progress} status={p.status} />
                        </td>

                        {/* Stage */}
                        <td className="px-4 py-4">
                          <span className="text-sm text-foreground">{p.stage}</span>
                        </td>

                        {/* Time in Progress */}
                        <td className="px-4 py-4">
                          <span className="text-sm text-foreground">{p.timeInProgress}</span>
                        </td>

                        {/* Last Activity */}
                        <td className="px-4 py-4">
                          <span
                            className={`text-sm ${
                              p.lastActivityWarning ? "text-red-500 font-medium" : "text-foreground"
                            }`}
                          >
                            {p.lastActivity}
                          </span>
                        </td>

                        {/* Risk */}
                        <td className="px-5 py-4 text-right">
                          <span
                            className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded border ${riskConfig[p.risk]}`}
                          >
                            {p.risk.charAt(0).toUpperCase() + p.risk.slice(1)}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Projects;
