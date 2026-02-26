import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, MessageSquare, Download, Calendar, Info, Lightbulb, ChevronDown, Pencil, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel } from "@/components/ChatPanel";
import { EffortChart } from "@/components/EffortChart";
import { RiskAlerts } from "@/components/RiskAlerts";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const velocityData = [
  { sprint: "Sprint 18", planned: 42, delivered: 38, carryover: 4 },
  { sprint: "Sprint 19", planned: 45, delivered: 44, carryover: 1 },
  { sprint: "Sprint 20", planned: 40, delivered: 36, carryover: 4 },
  { sprint: "Sprint 21", planned: 48, delivered: 41, carryover: 7 },
  { sprint: "Sprint 22", planned: 44, delivered: 43, carryover: 1 },
  { sprint: "Sprint 23", planned: 46, delivered: 45, carryover: 1 },
];

const velocityInsights = [
  { text: "Average velocity: 41.2 points/sprint — up 8% from previous 6-sprint window.", type: "positive" as const },
  { text: "Sprint 21 had the largest gap (7 pts carryover) — coincided with API Migration blockers.", type: "warning" as const },
  { text: "Last 2 sprints show consistent delivery (97%+ hit rate). Team is stabilizing.", type: "positive" as const },
  { text: "Recommendation: Cap sprint commitment at 44 points based on sustainable velocity.", type: "info" as const },
];

const allocationData = [
  { name: "Feature Work", value: 42, color: "hsl(211, 98%, 22%)", hours: 168, people: 12, detail: "Across 14 active feature tickets. Largest: Phoenix UI migration (52 hrs)." },
  { name: "Tech Debt", value: 25, color: "hsl(12, 78%, 52%)", hours: 100, people: 6, detail: "Auth Overhaul accounts for 60% of debt work. Remaining is API cleanup." },
  { name: "Bug Fixes", value: 18, color: "hsl(40, 90%, 52%)", hours: 72, people: 8, detail: "18 bugs closed this sprint. 5 were regressions from API Migration." },
  { name: "Meetings", value: 15, color: "hsl(203, 97%, 29%)", hours: 60, people: 34, detail: "Down from 18% last month after standup format change. Avg 1.8 hrs/person/week." },
];

const allocationInsights = [
  { text: "Feature-to-maintenance ratio is 42:43 — aim for 60:40 to accelerate delivery.", type: "warning" as const },
  { text: "Meeting time decreased 3pp after standup optimization — saving ~20 hrs/week team-wide.", type: "positive" as const },
  { text: "Tech debt is concentrated in Auth Overhaul — consider dedicated sprint to clear backlog.", type: "warning" as const },
];

const Reports = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [expandedAllocation, setExpandedAllocation] = useState<string | null>(null);
  const [showVelocityInsights, setShowVelocityInsights] = useState(true);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search reports..."
                className="h-9 w-72 rounded-lg bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30 transition"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
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
                <h1 className="text-2xl font-bold text-foreground">Reports</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Team effort, velocity, and risk insights across your portfolio
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <Calendar className="w-4 h-4" />
                  Last 30 days
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </motion.div>

          {/* Effort + Risk row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EffortChart />
            <RiskAlerts />
          </div>

          {/* Sprint Velocity — Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="font-semibold text-foreground">Sprint Velocity</h3>
                <p className="text-xs text-muted-foreground">Planned vs delivered story points with carryover tracking</p>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-1 rounded hover:bg-secondary transition-colors cursor-help">
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[280px]">
                    <p className="text-xs font-medium mb-1">How is this calculated?</p>
                    <p className="text-xs text-muted-foreground">Story points are pulled from Jira sprint reports. Carryover = planned − delivered. Trends are calculated over a rolling 6-sprint window.</p>
                  </TooltipContent>
                </Tooltip>
                <button className="flex items-center gap-1 text-[11px] text-accent hover:underline">
                  <Pencil className="w-3 h-3" /> Edit data
                </button>
              </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-4 gap-3 my-4">
              {[
                { label: "Avg Velocity", value: "41.2 pts", trend: "up" },
                { label: "Delivery Rate", value: "93%", trend: "up" },
                { label: "Avg Carryover", value: "3.0 pts", trend: "down" },
                { label: "Best Sprint", value: "Sprint 23", trend: "up" },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-foreground">{m.value}</p>
                    {m.trend === "up" ? <TrendingUp className="w-3 h-3 text-status-success" /> : <TrendingDown className="w-3 h-3 text-status-danger" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={velocityData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214, 25%, 90%)" />
                <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }} />
                <RTooltip
                  contentStyle={{ background: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 25%, 90%)", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="planned" fill="hsl(214, 25%, 93%)" radius={[4, 4, 0, 0]} name="Planned" />
                <Bar dataKey="delivered" fill="hsl(203, 97%, 29%)" radius={[4, 4, 0, 0]} name="Delivered" />
                <Bar dataKey="carryover" fill="hsl(12, 78%, 52%)" radius={[4, 4, 0, 0]} name="Carryover" />
              </BarChart>
            </ResponsiveContainer>

            {/* Velocity Insights */}
            <div className="mt-4 pt-4 border-t border-border">
              <button
                onClick={() => setShowVelocityInsights(!showVelocityInsights)}
                className="flex items-center gap-1.5 mb-2"
              >
                <Lightbulb className="w-4 h-4 text-status-warning" />
                <h4 className="text-xs font-semibold text-foreground">Key Insights</h4>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${showVelocityInsights ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showVelocityInsights && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-1.5">
                    {velocityInsights.map((t, i) => (
                      <div key={i} className={`flex items-start gap-2 text-xs px-2 py-1.5 rounded-md ${
                        t.type === "positive" ? "bg-status-success/5" : t.type === "warning" ? "bg-status-warning/5" : "bg-accent/5"
                      }`}>
                        <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                          t.type === "positive" ? "bg-status-success" : t.type === "warning" ? "bg-status-warning" : "bg-accent"
                        }`} />
                        <span className="text-foreground">{t.text}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Time Allocation — Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="font-semibold text-foreground">Time Allocation</h3>
                <p className="text-xs text-muted-foreground">Where your team spends their effort — click a category for details</p>
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <div className="p-1 rounded hover:bg-secondary transition-colors cursor-help">
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[280px]">
                  <p className="text-xs font-medium mb-1">How is this calculated?</p>
                  <p className="text-xs text-muted-foreground">Time allocation is derived from Jira ticket categories, calendar events, Slack activity patterns, and PR review cycles. Hours are estimated via MCP aggregation.</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-start gap-6 mt-4">
              <div className="w-52 h-52 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocationData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                      {allocationData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.color}
                          cursor="pointer"
                          onClick={() => setExpandedAllocation(expandedAllocation === entry.name ? null : entry.name)}
                          stroke={expandedAllocation === entry.name ? "hsl(0, 0%, 100%)" : "none"}
                          strokeWidth={expandedAllocation === entry.name ? 3 : 0}
                        />
                      ))}
                    </Pie>
                    <RTooltip contentStyle={{ background: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 25%, 90%)", borderRadius: "8px", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 space-y-2">
                {allocationData.map((item) => (
                  <div key={item.name}>
                    <div
                      className={`flex items-center justify-between text-sm p-2 rounded-lg cursor-pointer transition-colors ${
                        expandedAllocation === item.name ? "bg-secondary" : "hover:bg-secondary/50"
                      }`}
                      onClick={() => setExpandedAllocation(expandedAllocation === item.name ? null : item.name)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-foreground font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{item.hours} hrs</span>
                        <span className="font-semibold text-foreground">{item.value}%</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expandedAllocation === item.name ? "rotate-180" : ""}`} />
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedAllocation === item.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-5 p-3 text-xs text-muted-foreground border-l-2 border-border">
                            <p className="mb-1"><span className="font-medium text-foreground">{item.people} people</span> contributed</p>
                            <p>{item.detail}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Allocation Insights */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-4 h-4 text-status-warning" />
                <h4 className="text-xs font-semibold text-foreground">Key Takeaways</h4>
              </div>
              <div className="space-y-1.5">
                {allocationInsights.map((t, i) => (
                  <div key={i} className={`flex items-start gap-2 text-xs px-2 py-1.5 rounded-md ${
                    t.type === "positive" ? "bg-status-success/5" : "bg-status-warning/5"
                  }`}>
                    <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                      t.type === "positive" ? "bg-status-success" : "bg-status-warning"
                    }`} />
                    <span className="text-foreground">{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Reports;
