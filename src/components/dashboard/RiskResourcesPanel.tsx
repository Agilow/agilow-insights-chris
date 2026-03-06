import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";

// ─── Risk Register Data ─────────────────────────────────────────────────────
interface RiskRegisterItem {
  id: number;
  title: string;
  owner: string;
  project: string;
  status: "open" | "mitigating" | "overdue" | "resolved";
  severity: "critical" | "high" | "medium" | "low";
  mitigation: string;
  occurrences: number;
  lastSeen: string;
  dueDate: string;
}

const riskRegister: RiskRegisterItem[] = [
  { id: 1, title: "Auth endpoint blocking downstream teams", owner: "David P.", project: "API Migration v3", status: "overdue", severity: "critical", mitigation: "Schedule vendor sync; implement auth proxy", occurrences: 4, lastSeen: "Today", dueDate: "Mar 1" },
  { id: 2, title: "SSO provider API deprecation", owner: "James K.", project: "Auth Overhaul", status: "open", severity: "high", mitigation: "Contact vendor for migration guide", occurrences: 3, lastSeen: "Yesterday", dueDate: "Mar 8" },
  { id: 3, title: "Negative sentiment in Phoenix channels", owner: "Elena R.", project: "Project Phoenix", status: "mitigating", severity: "high", mitigation: "Load-testing env review with DevOps", occurrences: 2, lastSeen: "2 days ago", dueDate: "Mar 5" },
  { id: 4, title: "Client SDK deadline conflict", owner: "David P.", project: "API Migration v3", status: "open", severity: "medium", mitigation: "Negotiate deadline extension", occurrences: 1, lastSeen: "Today", dueDate: "Mar 10" },
  { id: 5, title: "GDPR compliance gap in encryption", owner: "James K.", project: "Auth Overhaul", status: "mitigating", severity: "medium", mitigation: "Review with Legal team", occurrences: 2, lastSeen: "3 days ago", dueDate: "Mar 12" },
  { id: 6, title: "Data pipeline throughput degradation", owner: "Raj M.", project: "Data Pipeline Refactor", status: "overdue", severity: "high", mitigation: "Scale streaming nodes; add monitoring", occurrences: 5, lastSeen: "Today", dueDate: "Feb 28" },
];

const statusStyles: Record<string, string> = {
  open: "text-accent bg-accent/10 border-accent/20",
  mitigating: "text-status-warning bg-status-warning/10 border-status-warning/20",
  overdue: "text-status-danger bg-status-danger/10 border-status-danger/20",
  resolved: "text-status-success bg-status-success/10 border-status-success/20",
};

const sevStyles: Record<string, string> = {
  critical: "text-status-danger bg-status-danger/10 border-status-danger/20",
  high: "text-status-warning bg-status-warning/10 border-status-warning/20",
  medium: "text-accent bg-accent/10 border-accent/20",
  low: "text-muted-foreground bg-secondary border-border",
};

// ─── Resource Data ──────────────────────────────────────────────────────────
interface PersonLoad {
  name: string;
  initials: string;
  projects: string[];
  thisWeek: number; // hours committed
  nextWeek: number;
  capacity: number; // max hours
  vacation: string | null; // date range or null
  color: string;
}

const resourceData: PersonLoad[] = [
  { name: "Elena R.", initials: "ER", projects: ["Phoenix", "Mobile v2"], thisWeek: 35, nextWeek: 38, capacity: 40, vacation: null, color: "bg-blue-500" },
  { name: "David P.", initials: "DP", projects: ["API Migration", "Auth Overhaul", "Pipeline"], thisWeek: 42, nextWeek: 45, capacity: 40, vacation: null, color: "bg-emerald-500" },
  { name: "Sofia M.", initials: "SM", projects: ["Design System"], thisWeek: 28, nextWeek: 20, capacity: 40, vacation: "Mar 10–14", color: "bg-violet-500" },
  { name: "James K.", initials: "JK", projects: ["Auth Overhaul", "Phoenix"], thisWeek: 38, nextWeek: 40, capacity: 40, vacation: null, color: "bg-rose-500" },
  { name: "Jade K.", initials: "JD", projects: ["Mobile v2", "Design System"], thisWeek: 30, nextWeek: 32, capacity: 40, vacation: null, color: "bg-amber-500" },
  { name: "Raj M.", initials: "RM", projects: ["Pipeline", "API Migration", "Phoenix", "Mobile v2"], thisWeek: 44, nextWeek: 46, capacity: 40, vacation: null, color: "bg-cyan-500" },
];

// ─── Component ──────────────────────────────────────────────────────────────
interface Props {
  visibleWidgets: { riskRegister: boolean; riskEvolution: boolean; resourceLoad: boolean };
  onToggleWidget: (key: "riskRegister" | "riskEvolution" | "resourceLoad") => void;
}

export function RiskResourcesPanel({ visibleWidgets, onToggleWidget }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const overdueCount = riskRegister.filter(r => r.status === "overdue").length;
  const recurringCount = riskRegister.filter(r => r.occurrences >= 3 && r.status !== "resolved").length;
  const overloadedCount = resourceData.filter(p => p.thisWeek > p.capacity || p.nextWeek > p.capacity).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-4 sm:p-5"
    >
      {/* Header */}
      <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-start justify-between mb-1 group">
        <div className="text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <Shield className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-foreground">Risk &amp; Resources</h3>
            {overdueCount > 0 && (
              <span className="text-[10px] font-medium text-status-danger bg-status-danger/10 border border-status-danger/20 px-2 py-0.5 rounded-full">
                {overdueCount} overdue
              </span>
            )}
            {recurringCount > 0 && (
              <span className="text-[10px] font-medium text-status-warning bg-status-warning/10 border border-status-warning/20 px-2 py-0.5 rounded-full">
                {recurringCount} recurring
              </span>
            )}
            {overloadedCount > 0 && (
              <span className="text-[10px] font-medium text-status-danger bg-status-danger/10 border border-status-danger/20 px-2 py-0.5 rounded-full">
                {overloadedCount} overloaded
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 ml-6">Portfolio-wide risk register, evolution tracking &amp; resource allocation</p>
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
            {/* Widget toggles */}
            <div className="flex items-center gap-2 flex-wrap mt-3 mb-4">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Show:</span>
              {(["riskRegister", "riskEvolution", "resourceLoad"] as const).map(key => (
                <button
                  key={key}
                  onClick={() => onToggleWidget(key)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                    visibleWidgets[key] ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/70"
                  }`}
                >
                  {visibleWidgets[key] ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {key === "riskRegister" ? "Risk Register" : key === "riskEvolution" ? "Risk Evolution" : "Resource Load"}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {/* ── Risk Register ──────────────────────────────────────── */}
              {visibleWidgets.riskRegister && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-status-danger" />
                    Risk Register ({riskRegister.length} items)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-2 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">Risk</th>
                          <th className="text-left py-2 px-2 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">Project</th>
                          <th className="text-left py-2 px-2 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">Owner</th>
                          <th className="text-left py-2 px-2 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">Severity</th>
                          <th className="text-left py-2 px-2 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">Status</th>
                          <th className="text-left py-2 px-2 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">Signals</th>
                          <th className="text-left py-2 px-2 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">Due</th>
                        </tr>
                      </thead>
                      <tbody>
                        {riskRegister.map(r => (
                          <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                            <td className="py-2.5 px-2">
                              <p className="font-medium text-foreground">{r.title}</p>
                              <p className="text-muted-foreground mt-0.5 text-[10px]">{r.mitigation}</p>
                            </td>
                            <td className="py-2.5 px-2 text-muted-foreground whitespace-nowrap">{r.project}</td>
                            <td className="py-2.5 px-2 text-foreground whitespace-nowrap">{r.owner}</td>
                            <td className="py-2.5 px-2">
                              <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sevStyles[r.severity]}`}>
                                {r.severity.charAt(0).toUpperCase() + r.severity.slice(1)}
                              </span>
                            </td>
                            <td className="py-2.5 px-2">
                              <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyles[r.status]}`}>
                                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-2.5 px-2">
                              <span className={`font-medium ${r.occurrences >= 3 ? "text-status-danger" : "text-foreground"}`}>
                                {r.occurrences}× seen
                              </span>
                              <span className="text-muted-foreground ml-1">· {r.lastSeen}</span>
                            </td>
                            <td className={`py-2.5 px-2 whitespace-nowrap font-medium ${r.status === "overdue" ? "text-status-danger" : "text-foreground"}`}>
                              {r.dueDate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Risk Evolution ─────────────────────────────────────── */}
              {visibleWidgets.riskEvolution && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-status-warning" />
                    Mitigation Status
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-status-danger/20 bg-status-danger/5 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <XCircle className="w-4 h-4 text-status-danger" />
                        <span className="text-sm font-semibold text-status-danger">{overdueCount}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Overdue mitigations</p>
                      <p className="text-[10px] text-status-danger font-medium mt-1">Action needed immediately</p>
                    </div>
                    <div className="rounded-xl border border-status-warning/20 bg-status-warning/5 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-status-warning" />
                        <span className="text-sm font-semibold text-status-warning">{recurringCount}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Recurring signals (3+ times)</p>
                      <p className="text-[10px] text-status-warning font-medium mt-1">No mitigation progress</p>
                    </div>
                    <div className="rounded-xl border border-status-success/20 bg-status-success/5 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-status-success" />
                        <span className="text-sm font-semibold text-status-success">
                          {riskRegister.filter(r => r.status === "mitigating").length}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Actively mitigating</p>
                      <p className="text-[10px] text-status-success font-medium mt-1">On track for resolution</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Resource Load ──────────────────────────────────────── */}
              {visibleWidgets.resourceLoad && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-accent" />
                    Resource Load
                  </h4>
                  <div className="space-y-2">
                    {resourceData.map(person => {
                      const thisWeekPct = Math.min((person.thisWeek / person.capacity) * 100, 120);
                      const nextWeekPct = Math.min((person.nextWeek / person.capacity) * 100, 120);
                      const isOverloaded = person.thisWeek > person.capacity || person.nextWeek > person.capacity;
                      return (
                        <div key={person.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40 border border-border/60">
                          <span className={`w-7 h-7 rounded-full ${person.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                            {person.initials}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-medium text-foreground">{person.name}</span>
                              <span className="text-[10px] text-muted-foreground">{person.projects.length} projects</span>
                              {isOverloaded && (
                                <span className="text-[10px] font-medium text-status-danger bg-status-danger/10 border border-status-danger/20 px-1.5 py-0.5 rounded-full">Overloaded</span>
                              )}
                              {person.vacation && (
                                <span className="text-[10px] font-medium text-accent bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  <Calendar className="w-2.5 h-2.5" /> OOO {person.vacation}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1.5">
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-[10px] mb-0.5">
                                  <span className="text-muted-foreground">This week</span>
                                  <span className={`font-medium ${person.thisWeek > person.capacity ? "text-status-danger" : "text-foreground"}`}>
                                    {person.thisWeek}/{person.capacity}h
                                  </span>
                                </div>
                                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${person.thisWeek > person.capacity ? "bg-status-danger" : person.thisWeek > person.capacity * 0.85 ? "bg-status-warning" : "bg-accent"}`}
                                    style={{ width: `${Math.min(thisWeekPct, 100)}%` }}
                                  />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-[10px] mb-0.5">
                                  <span className="text-muted-foreground">Next week</span>
                                  <span className={`font-medium ${person.nextWeek > person.capacity ? "text-status-danger" : "text-foreground"}`}>
                                    {person.nextWeek}/{person.capacity}h
                                  </span>
                                </div>
                                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${person.nextWeek > person.capacity ? "bg-status-danger" : person.nextWeek > person.capacity * 0.85 ? "bg-status-warning" : "bg-accent"}`}
                                    style={{ width: `${Math.min(nextWeekPct, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">{person.projects.join(" · ")}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
