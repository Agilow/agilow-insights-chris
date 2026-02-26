import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
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
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel } from "@/components/ChatPanel";
import { MessageSquare, Bell } from "lucide-react";

const projects = [
  {
    name: "Project Phoenix",
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
  },
  {
    name: "API Migration v3",
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
  },
  {
    name: "Design System 2.0",
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
  },
  {
    name: "Auth Overhaul",
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
  },
  {
    name: "Mobile App v2",
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
  },
  {
    name: "Data Pipeline Refactor",
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
  },
];

const statusConfig = {
  "on-track": { label: "On Track", icon: CheckCircle2, className: "text-status-success bg-status-success/10" },
  "at-risk": { label: "At Risk", icon: AlertTriangle, className: "text-status-danger bg-status-danger/10" },
  blocked: { label: "Blocked", icon: Clock, className: "text-status-warning bg-status-warning/10" },
};

const trendIcons = { up: TrendingUp, down: TrendingDown, flat: Minus };

const Projects = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "on-track" | "at-risk" | "blocked">("all");

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

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
                  {projects.length} active projects · {projects.filter((p) => p.status === "at-risk").length} at risk
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
                {f === "all" ? "All" : statusConfig[f].label}
              </button>
            ))}
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((p, i) => {
              const st = statusConfig[p.status];
              const TrendIcon = trendIcons[p.trend];
              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card p-5 hover:shadow-card transition-shadow cursor-pointer group"
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

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> {p.team} members · {p.lead}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Due {p.dueDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5" /> {p.decisions} decisions logged
                    </span>
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> {p.openRisks} open risks
                    </span>
                  </div>

                  {/* Recent activity */}
                  <div className="border-t border-border pt-2 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate flex-1">{p.recentActivity}</p>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2 shrink-0">
                      <TrendIcon className="w-3.5 h-3.5" /> Velocity
                    </span>
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
