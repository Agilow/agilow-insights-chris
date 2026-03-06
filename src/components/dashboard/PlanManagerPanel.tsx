import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  FileText,
  ExternalLink,
  Sun,
  Moon,
  Users,
  MessageSquare,
} from "lucide-react";

// ─── Weekly Data ────────────────────────────────────────────────────────────
interface WeekItem {
  id: number;
  task: string;
  project: string;
  owner: string;
  status: "done" | "in-progress" | "slipped" | "upcoming" | "at-risk";
  dueDay: string;
}

const thisWeekItems: WeekItem[] = [
  { id: 1, task: "Finalize API auth proxy implementation", project: "API Migration v3", owner: "David P.", status: "done", dueDay: "Mon" },
  { id: 2, task: "Complete load testing environment setup", project: "Project Phoenix", owner: "Elena R.", status: "done", dueDay: "Mon" },
  { id: 3, task: "Design token audit for accessibility", project: "Design System 2.0", owner: "Sofia M.", status: "done", dueDay: "Tue" },
  { id: 4, task: "SSO vendor migration guide review", project: "Auth Overhaul", owner: "James K.", status: "slipped", dueDay: "Wed" },
  { id: 5, task: "Mobile push notification integration", project: "Mobile App v2", owner: "Jade K.", status: "in-progress", dueDay: "Thu" },
  { id: 6, task: "Data pipeline streaming node scaling", project: "Data Pipeline Refactor", owner: "Raj M.", status: "at-risk", dueDay: "Fri" },
];

const nextWeekItems: WeekItem[] = [
  { id: 7, task: "API v3 client SDK beta release", project: "API Migration v3", owner: "David P.", status: "upcoming", dueDay: "Mon" },
  { id: 8, task: "Phoenix production deploy prep", project: "Project Phoenix", owner: "Elena R.", status: "upcoming", dueDay: "Tue" },
  { id: 9, task: "Auth SSO cutover planning", project: "Auth Overhaul", owner: "James K.", status: "upcoming", dueDay: "Wed" },
  { id: 10, task: "Mobile App v2 QA test cycle", project: "Mobile App v2", owner: "Jade K.", status: "upcoming", dueDay: "Thu" },
  { id: 11, task: "Design System 2.0 component library publish", project: "Design System 2.0", owner: "Sofia M.", status: "upcoming", dueDay: "Fri" },
];

// ─── Daily Data ─────────────────────────────────────────────────────────────
interface DailyTask {
  id: number;
  task: string;
  project: string;
  time: string;
  blocked: boolean;
  blockReason?: string;
}

const todayTasks: DailyTask[] = [
  { id: 1, task: "Review load test results and sign off", project: "Project Phoenix", time: "9:00 AM", blocked: false },
  { id: 2, task: "Sync with David on auth proxy status", project: "API Migration v3", time: "10:30 AM", blocked: false },
  { id: 3, task: "Unblock SSO vendor migration guide", project: "Auth Overhaul", time: "2:00 PM", blocked: true, blockReason: "Vendor response pending since Wed" },
  { id: 4, task: "Review mobile push notification PR", project: "Mobile App v2", time: "3:30 PM", blocked: false },
];

interface TomorrowPrep {
  id: number;
  task: string;
  project: string;
  docsNeeded: string[];
  links: string[];
}

const tomorrowPrep: TomorrowPrep[] = [
  { id: 1, task: "Pipeline scaling decision meeting", project: "Data Pipeline Refactor", docsNeeded: ["Streaming architecture RFC", "Cost analysis spreadsheet"], links: ["#", "#"] },
  { id: 2, task: "Phoenix deploy checklist review", project: "Project Phoenix", docsNeeded: ["Production readiness checklist"], links: ["#"] },
  { id: 3, task: "Design System handoff to marketing", project: "Design System 2.0", docsNeeded: ["Component usage guide", "Brand token reference"], links: ["#", "#"] },
];

const statusStyles: Record<string, { label: string; style: string; icon: React.ElementType }> = {
  done: { label: "Done", style: "text-status-success bg-status-success/10 border-status-success/20", icon: CheckCircle2 },
  "in-progress": { label: "In Progress", style: "text-accent bg-accent/10 border-accent/20", icon: Clock },
  slipped: { label: "Slipped", style: "text-status-danger bg-status-danger/10 border-status-danger/20", icon: AlertTriangle },
  "at-risk": { label: "At Risk", style: "text-status-warning bg-status-warning/10 border-status-warning/20", icon: AlertTriangle },
  upcoming: { label: "Upcoming", style: "text-muted-foreground bg-secondary border-border", icon: ArrowRight },
};

// ─── Component ──────────────────────────────────────────────────────────────
interface Props {
  showDaily: boolean;
}

export function PlanManagerPanel({ showDaily }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<"weekly" | "daily">(showDaily ? "daily" : "weekly");

  const doneCount = thisWeekItems.filter(i => i.status === "done").length;
  const slippedCount = thisWeekItems.filter(i => i.status === "slipped" || i.status === "at-risk").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glass-card p-4 sm:p-5"
    >
      {/* Header */}
      <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-start justify-between mb-1 group">
        <div className="text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <CalendarDays className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-foreground">Plan Manager</h3>
            <span className="text-[10px] font-medium text-status-success bg-status-success/10 border border-status-success/20 px-2 py-0.5 rounded-full">
              {doneCount}/{thisWeekItems.length} done this week
            </span>
            {slippedCount > 0 && (
              <span className="text-[10px] font-medium text-status-danger bg-status-danger/10 border border-status-danger/20 px-2 py-0.5 rounded-full">
                {slippedCount} need attention
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 ml-6">Weekly overview &amp; daily focus across all projects</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 mt-1 transition-transform ${collapsed ? "-rotate-90" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Mode toggle */}
            <div className="flex items-center gap-1 mt-3 mb-4 bg-secondary rounded-lg p-0.5 w-fit">
              <button
                onClick={() => setMode("weekly")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  mode === "weekly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" /> Weekly
              </button>
              <button
                onClick={() => setMode("daily")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  mode === "daily" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Daily
              </button>
            </div>

            {mode === "weekly" ? (
              <div className="space-y-4">
                {/* This Week */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">This Week</h4>
                  <div className="space-y-1.5">
                    {thisWeekItems.map(item => {
                      const st = statusStyles[item.status];
                      const StIcon = st.icon;
                      return (
                        <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40 border border-border/60 hover:bg-secondary/60 transition-colors">
                          <span className="text-[10px] text-muted-foreground font-medium w-7 shrink-0">{item.dueDay}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium ${item.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}>{item.task}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{item.project} · {item.owner}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${st.style}`}>
                            <StIcon className="w-2.5 h-2.5" /> {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Next Week */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Next Week</h4>
                  <div className="space-y-1.5">
                    {nextWeekItems.map(item => {
                      const st = statusStyles[item.status];
                      const StIcon = st.icon;
                      return (
                        <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40 border border-border/60">
                          <span className="text-[10px] text-muted-foreground font-medium w-7 shrink-0">{item.dueDay}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">{item.task}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{item.project} · {item.owner}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button className="text-[10px] text-accent hover:underline flex items-center gap-0.5" title="Ping owner">
                              <MessageSquare className="w-3 h-3" /> Ping
                            </button>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${st.style}`}>
                              <StIcon className="w-2.5 h-2.5" /> {st.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Today */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-status-warning" /> Today's Focus
                  </h4>
                  <div className="space-y-1.5">
                    {todayTasks.map(task => (
                      <div key={task.id} className={`p-2.5 rounded-lg border transition-colors ${task.blocked ? "bg-status-danger/5 border-status-danger/20" : "bg-secondary/40 border-border/60"}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-muted-foreground font-medium w-14 shrink-0">{task.time}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">{task.task}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{task.project}</p>
                          </div>
                          {task.blocked && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-status-danger bg-status-danger/10 border border-status-danger/20 px-2 py-0.5 rounded-full shrink-0">
                              <AlertTriangle className="w-2.5 h-2.5" /> Blocked
                            </span>
                          )}
                        </div>
                        {task.blocked && task.blockReason && (
                          <p className="text-[10px] text-status-danger mt-1.5 ml-[68px]">⚠ {task.blockReason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prep for Tomorrow */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-accent" /> Prep for Tomorrow
                  </h4>
                  <div className="space-y-2">
                    {tomorrowPrep.map(item => (
                      <div key={item.id} className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                        <p className="text-xs font-medium text-foreground">{item.task}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{item.project}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Documents needed:
                          </p>
                          {item.docsNeeded.map((doc, di) => (
                            <a key={di} href={item.links[di] || "#"} className="flex items-center gap-1.5 text-xs text-accent hover:underline ml-4">
                              <ExternalLink className="w-3 h-3" /> {doc}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
