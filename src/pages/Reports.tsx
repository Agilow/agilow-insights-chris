import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Bell, MessageSquare, Download, Calendar } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel } from "@/components/ChatPanel";
import { EffortChart } from "@/components/EffortChart";
import { RiskAlerts } from "@/components/RiskAlerts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

const velocityData = [
  { sprint: "Sprint 18", planned: 42, delivered: 38 },
  { sprint: "Sprint 19", planned: 45, delivered: 44 },
  { sprint: "Sprint 20", planned: 40, delivered: 36 },
  { sprint: "Sprint 21", planned: 48, delivered: 41 },
  { sprint: "Sprint 22", planned: 44, delivered: 43 },
  { sprint: "Sprint 23", planned: 46, delivered: 45 },
];

const allocationData = [
  { name: "Feature Work", value: 42, color: "hsl(203, 97%, 29%)" },
  { name: "Tech Debt", value: 25, color: "hsl(12, 78%, 52%)" },
  { name: "Bug Fixes", value: 18, color: "hsl(40, 90%, 52%)" },
  { name: "Meetings", value: 15, color: "hsl(211, 98%, 22%)" },
];

const sentimentData = [
  { week: "W1", score: 72 },
  { week: "W2", score: 68 },
  { week: "W3", score: 74 },
  { week: "W4", score: 61 },
  { week: "W5", score: 58 },
  { week: "W6", score: 65 },
];

const Reports = () => {
  const [chatOpen, setChatOpen] = useState(false);

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

          {/* Velocity + Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-5"
            >
              <h3 className="font-semibold text-foreground mb-1">Sprint Velocity</h3>
              <p className="text-xs text-muted-foreground mb-4">Planned vs delivered story points</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={velocityData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214, 25%, 90%)" />
                  <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }} />
                  <Tooltip />
                  <Bar dataKey="planned" fill="hsl(214, 25%, 93%)" radius={[4, 4, 0, 0]} name="Planned" />
                  <Bar dataKey="delivered" fill="hsl(203, 97%, 29%)" radius={[4, 4, 0, 0]} name="Delivered" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-5"
            >
              <h3 className="font-semibold text-foreground mb-1">Time Allocation</h3>
              <p className="text-xs text-muted-foreground mb-4">Where your team spends their effort</p>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={allocationData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                    {allocationData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" iconType="circle" formatter={(value) => <span className="text-xs text-foreground">{value}</span>} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Sentiment trend */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-5"
          >
            <h3 className="font-semibold text-foreground mb-1">Team Sentiment Trend</h3>
            <p className="text-xs text-muted-foreground mb-4">
              AI-detected morale score from Slack activity and meeting tone
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214, 25%, 90%)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="hsl(203, 97%, 29%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(203, 97%, 29%)" }} name="Sentiment Score" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </main>
      </div>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Reports;
