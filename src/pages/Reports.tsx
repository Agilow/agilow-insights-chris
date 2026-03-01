import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  MessageSquare,
  Download,
  FileText,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  Plus,
  Filter,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { AppSidebar, MobileMenuButton } from "@/components/AppSidebar";
import { ChatPanel } from "@/components/ChatPanel";
import { ReportGenerator, REPORT_CONFIGS, type ReportConfig } from "@/components/ReportGenerator";

const categoryLabels: Record<string, string> = {
  strategic: "Strategic",
  sprint: "Sprint & Delivery",
  stakeholder: "Stakeholder Updates",
  team: "Team & Capacity",
};

// Map report ids to categories for filter
const reportCategories: Record<string, string> = {
  "progress-update": "stakeholder",
  "exec-update": "stakeholder",
  "sprint-retro": "sprint",
  "risk-assessment": "strategic",
  "swot": "strategic",
  "team-health": "team",
};

const categoryColors: Record<string, string> = {
  strategic: "bg-accent/10 text-accent",
  sprint: "bg-status-success/10 text-status-success",
  stakeholder: "bg-agilow-coral/10 text-destructive",
  team: "bg-status-warning/10 text-status-warning",
};

const estimatedTimes: Record<string, string> = {
  "progress-update": "~2 min",
  "exec-update": "~1 min",
  "sprint-retro": "~1 min",
  "risk-assessment": "~2 min",
  "swot": "~2 min",
  "team-health": "~2 min",
};

const lastGenerated: Record<string, string> = {
  "exec-update": "5 days ago",
  "sprint-retro": "1 day ago",
  "progress-update": "2 days ago",
  "swot": "3 days ago",
};

type GeneratedReport = {
  id: string;
  reportType: string;
  title: string;
  generatedAt: string;
  preview: string;
};

const recentReports: GeneratedReport[] = [
  { id: "1", reportType: "exec-update", title: "Executive Weekly Update — Week of Feb 17", generatedAt: "Feb 22, 2026", preview: "Portfolio health: 3/5 projects on track. Key risk: Auth Overhaul delayed 1 week due to vendor dependency. Mobile App v2 ahead of schedule on two milestones." },
  { id: "2", reportType: "sprint-retro", title: "Sprint 23 Retrospective — All Projects", generatedAt: "Feb 21, 2026", preview: "Aggregate velocity: 159 pts delivered (92% hit rate). Top win: Design System 2.0 component library published. Concern: Auth Overhaul team morale signals flagged." },
  { id: "3", reportType: "swot", title: "Q1 Portfolio SWOT Analysis", generatedAt: "Feb 18, 2026", preview: "Strengths: High team velocity, strong cross-functional collaboration. Weaknesses: Single point of failure on auth. Threat: SSO vendor responsiveness." },
  { id: "4", reportType: "progress-update", title: "Project Phoenix — Progress Report", generatedAt: "Feb 20, 2026", preview: "Milestone: UI Migration 85% complete. Sprint 24 delivered 45 pts (97% hit rate). Load testing environment 2 days behind — not yet critical." },
];

const Reports = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<ReportConfig | null>(null);
  const [showRecentReports, setShowRecentReports] = useState(true);

  const filteredReports = selectedCategory
    ? REPORT_CONFIGS.filter((r) => reportCategories[r.id] === selectedCategory)
    : REPORT_CONFIGS;

  const reportTypeIcon = (typeId: string) => {
    const rt = REPORT_CONFIGS.find((r) => r.id === typeId);
    return rt ? rt.icon : FileText;
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-3 sm:px-6 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <MobileMenuButton />
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search reports..."
                className="h-9 w-48 lg:w-72 rounded-lg bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30 transition"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Agilow</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-[1400px]">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Generate Reports</h1>
                <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
                  AI-powered reports from your connected sources — Slack, Jira, meetings, email — ready to export and share.
                </p>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity shrink-0">
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
            {filteredReports.map((report, i) => {
              const category = reportCategories[report.id] || "strategic";
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.04 }}
                  className="glass-card p-5 group hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${categoryColors[category]}`}>
                      <report.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-sm">{report.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{report.promptLabel}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryColors[category]}`}>
                          {categoryLabels[category]}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">
                          {report.scope === "project" ? "Per project" : "Portfolio-wide"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {estimatedTimes[report.id]}
                      </span>
                      {lastGenerated[report.id] && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-status-success" /> Last: {lastGenerated[report.id]}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveReport(report)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate
                    </button>
                  </div>
                </motion.div>
              );
            })}
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

      {/* Report Generator Modal */}
      <AnimatePresence>
        {activeReport && (
          <ReportGenerator
            report={activeReport}
            onClose={() => setActiveReport(null)}
          />
        )}
      </AnimatePresence>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Reports;
