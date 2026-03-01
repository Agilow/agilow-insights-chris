import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  MessageSquare,
  Download,
  FileText,
  Target,
  TrendingUp,
  BarChart3,
  Users,
  Shield,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  Plus,
  Filter,
  ArrowUpRight,
  Lightbulb,
  Calendar,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel } from "@/components/ChatPanel";

type ReportType = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: "strategic" | "sprint" | "stakeholder" | "team";
  estimatedTime: string;
  lastGenerated?: string;
  tags: string[];
};

const reportTypes: ReportType[] = [
  {
    id: "swot",
    title: "SWOT Analysis",
    description: "Strengths, weaknesses, opportunities, and threats across your portfolio based on sprint data, team signals, and market context.",
    icon: Target,
    category: "strategic",
    estimatedTime: "~2 min",
    lastGenerated: "3 days ago",
    tags: ["Strategic", "Portfolio-wide"],
  },
  {
    id: "sprint-retro",
    title: "Sprint Retrospective",
    description: "Auto-generated retro summary with velocity analysis, blockers, wins, and team sentiment pulled from Jira, Slack, and meeting transcripts.",
    icon: TrendingUp,
    category: "sprint",
    estimatedTime: "~1 min",
    lastGenerated: "1 day ago",
    tags: ["Sprint", "Team"],
  },
  {
    id: "sprint-goals",
    title: "Sprint Goals & Planning",
    description: "Recommended sprint goals based on backlog priority, team capacity, carryover items, and strategic alignment.",
    icon: BarChart3,
    category: "sprint",
    estimatedTime: "~2 min",
    tags: ["Sprint", "Planning"],
  },
  {
    id: "exec-update",
    title: "Executive Weekly Update",
    description: "High-level portfolio summary for leadership — key metrics, milestone progress, risks, and decisions made this week.",
    icon: ArrowUpRight,
    category: "stakeholder",
    estimatedTime: "~1 min",
    lastGenerated: "5 days ago",
    tags: ["Stakeholder", "Weekly"],
  },
  {
    id: "progress-update",
    title: "Progress Report",
    description: "Detailed project-level progress with burndown, scope changes, dependency status, and timeline projections.",
    icon: FileText,
    category: "stakeholder",
    estimatedTime: "~2 min",
    lastGenerated: "2 days ago",
    tags: ["Stakeholder", "Project"],
  },
  {
    id: "team-health",
    title: "Team Health Check",
    description: "Workload distribution, overtime patterns, collaboration density, and morale indicators from Slack and calendar data.",
    icon: Users,
    category: "team",
    estimatedTime: "~2 min",
    tags: ["Team", "Wellbeing"],
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment Report",
    description: "Comprehensive risk register with probability, impact scoring, mitigation status, and early warning signals from integrated sources.",
    icon: Shield,
    category: "strategic",
    estimatedTime: "~2 min",
    lastGenerated: "1 week ago",
    tags: ["Strategic", "Risk"],
  },
  {
    id: "capacity-forecast",
    title: "Capacity & Forecast",
    description: "Forward-looking capacity model with hiring gaps, velocity projections, and delivery date estimates for active initiatives.",
    icon: Lightbulb,
    category: "team",
    estimatedTime: "~3 min",
    tags: ["Planning", "Forecast"],
  },
];

const categoryLabels: Record<string, string> = {
  strategic: "Strategic",
  sprint: "Sprint & Delivery",
  stakeholder: "Stakeholder Updates",
  team: "Team & Capacity",
};

const categoryColors: Record<string, string> = {
  strategic: "bg-accent/10 text-accent",
  sprint: "bg-status-success/10 text-status-success",
  stakeholder: "bg-agilow-coral/10 text-destructive",
  team: "bg-status-warning/10 text-status-warning",
};

type GeneratedReport = {
  id: string;
  reportType: string;
  title: string;
  generatedAt: string;
  status: "ready" | "generating";
  preview: string;
};

const recentReports: GeneratedReport[] = [
  { id: "1", reportType: "exec-update", title: "Executive Weekly Update — Week of Feb 17", generatedAt: "Feb 22, 2026", status: "ready", preview: "Portfolio health: 3/5 projects on track. Key risk: Auth Overhaul delayed 1 week due to vendor dependency..." },
  { id: "2", reportType: "sprint-retro", title: "Sprint 23 Retrospective", generatedAt: "Feb 21, 2026", status: "ready", preview: "Velocity: 45 pts delivered (97% hit rate). Top win: Phoenix UI migration completed ahead of schedule..." },
  { id: "3", reportType: "swot", title: "Q1 Portfolio SWOT Analysis", generatedAt: "Feb 18, 2026", status: "ready", preview: "Strengths: High team velocity, strong cross-functional collaboration. Weaknesses: Single point of failure on auth..." },
  { id: "4", reportType: "progress-update", title: "Project Phoenix — Progress Report", generatedAt: "Feb 20, 2026", status: "ready", preview: "Milestone: UI Migration 85% complete. Burndown on track. 2 dependencies resolved this week..." },
];

const Reports = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [showRecentReports, setShowRecentReports] = useState(true);

  const filteredReports = selectedCategory
    ? reportTypes.filter((r) => r.category === selectedCategory)
    : reportTypes;

  const handleGenerate = (reportId: string) => {
    setGeneratingReport(reportId);
    setTimeout(() => setGeneratingReport(null), 3000);
  };

  const reportTypeIcon = (typeId: string) => {
    const rt = reportTypes.find((r) => r.id === typeId);
    return rt ? rt.icon : FileText;
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
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Generate Reports</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  AI-powered reports from your connected sources (Slack, Jira, meetings, email) — ready to export and share.
                </p>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
                Custom Report
              </button>
            </div>
          </motion.div>

          {/* Category filter */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !selectedCategory ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All Types
            </button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {/* Report type cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.04 }}
                className="glass-card p-5 group hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${categoryColors[report.category]}`}>
                      <report.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-sm">{report.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{report.description}</p>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {report.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {report.estimatedTime}
                    </span>
                    {report.lastGenerated && (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-status-success" /> Last: {report.lastGenerated}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGenerate(report.id)}
                      disabled={generatingReport === report.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        generatingReport === report.id
                          ? "bg-accent/10 text-accent cursor-wait"
                          : "bg-accent text-accent-foreground hover:opacity-90"
                      }`}
                    >
                      {generatingReport === report.id ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          Generating…
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent generated reports */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
          >
            <button
              onClick={() => setShowRecentReports(!showRecentReports)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors rounded-t-xl"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-foreground text-sm">Recently Generated</h3>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">
                  {recentReports.length} reports
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showRecentReports ? "rotate-90" : ""}`} />
            </button>

            <AnimatePresence>
              {showRecentReports && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 space-y-2">
                    {recentReports.map((report) => {
                      const Icon = reportTypeIcon(report.reportType);
                      return (
                        <div
                          key={report.id}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
                        >
                          <div className="p-2 rounded-lg bg-secondary shrink-0 mt-0.5">
                            <Icon className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground truncate">{report.title}</p>
                              <span className="flex items-center gap-1 text-[10px] text-status-success shrink-0">
                                <CheckCircle2 className="w-3 h-3" /> Ready
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{report.preview}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {report.generatedAt}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button className="p-1.5 rounded-md hover:bg-secondary transition-colors" title="Export">
                              <Download className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            <button className="p-1.5 rounded-md hover:bg-secondary transition-colors" title="View">
                              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Reports;
