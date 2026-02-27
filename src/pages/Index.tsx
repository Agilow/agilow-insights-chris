import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  MessageSquare,
  Users,
  Clock,
  Zap,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel } from "@/components/ChatPanel";
import { ProjectCards } from "@/components/ProjectCards";
import { EffortChart } from "@/components/EffortChart";
import { RiskAlerts } from "@/components/RiskAlerts";
import { DecisionTimeline } from "@/components/DecisionTimeline";



const stats = [
  { label: "Active Projects", value: "12", icon: Zap, change: "+2 this month" },
  { label: "Team Members", value: "34", icon: Users, change: "3 squads" },
  { label: "Hours Saved", value: "47", icon: Clock, change: "This week" },
  { label: "Decisions Logged", value: "128", icon: ArrowUpRight, change: "+14 this week" },
];

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [statsCollapsed, setStatsCollapsed] = useState(false);

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

        {/* Main content */}
        <main className="flex-1 p-6 space-y-6 max-w-[1400px]">
          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-foreground">Good morning, Elena</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here's your portfolio health overview — 3 alerts need attention.
            </p>
          </motion.div>




          {/* Collapsible Stats */}
          <div className="glass-card">
            <button
              onClick={() => setStatsCollapsed(!statsCollapsed)}
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-secondary/30 transition-colors rounded-t-xl"
            >
              <span className="text-sm font-semibold text-foreground">Portfolio Overview</span>
              <div className="flex items-center gap-3">
                {statsCollapsed && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {stats.map((s) => (
                      <span key={s.label} className="flex items-center gap-1">
                        <s.icon className="w-3 h-3 text-accent" />
                        <span className="font-semibold text-foreground">{s.value}</span>
                        <span>{s.label}</span>
                      </span>
                    ))}
                  </div>
                )}
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${statsCollapsed ? "" : "rotate-180"}`} />
              </div>
            </button>
            <AnimatePresence initial={false}>
              {!statsCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-5 pb-5">
                    {stats.map((s, i) => (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40 border border-border/50"
                      >
                        <div className="p-2 rounded-lg bg-accent/10">
                          <s.icon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground leading-none">{s.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                          <p className="text-[10px] text-muted-foreground">{s.change}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Project Health</h2>
            <ProjectCards />
          </div>

          {/* Charts & Risks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EffortChart />
            <RiskAlerts />
          </div>

          {/* Decision Timeline */}
          <DecisionTimeline />

          {/* Workflow Integrations */}
          <WorkflowIntegrations />
        </main>
      </div>

      {/* Chat Panel */}
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Index;
