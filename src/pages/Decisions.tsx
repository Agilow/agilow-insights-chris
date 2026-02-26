import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  MessageSquare,
  GitBranch,
  Flag,
  CheckCircle2,
  AlertCircle,
  Filter,
  Calendar,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel } from "@/components/ChatPanel";

const decisions = [
  {
    date: "Feb 24, 2026",
    title: "Postpone OAuth to Phase 2",
    rationale: "Avoid 2-week delay on vendor integration. Team consensus in standup.",
    project: "Project Phoenix",
    flagged: false,
    sources: ["Meeting transcript", "JIRA PHX-189"],
    author: "Sarah Chen",
  },
  {
    date: "Feb 22, 2026",
    title: "Switch to streaming architecture",
    rationale: "Batch processing can't meet SLA. Approved by architecture board after benchmark review.",
    project: "Data Pipeline Refactor",
    flagged: false,
    sources: ["Slack #data-team", "Confluence RFC-12"],
    author: "Raj Mehta",
  },
  {
    date: "Feb 20, 2026",
    title: "Custom encryption library adopted",
    rationale: "Chosen for speed, but caused 3-day downtime. Replacement planned Q3.",
    project: "Auth Overhaul",
    flagged: true,
    sources: ["Slack #auth-team", "Post-mortem doc"],
    author: "Leo Nguyen",
  },
  {
    date: "Feb 18, 2026",
    title: "Migrate to GraphQL gateway",
    rationale: "Reduces API calls by 60%. Approved by architecture review board.",
    project: "API Migration v3",
    flagged: false,
    sources: ["Email thread", "JIRA API-402"],
    author: "Marcus Reeves",
  },
  {
    date: "Feb 16, 2026",
    title: "Skip accessibility audit for MVP",
    rationale: "Deprioritized to hit launch deadline. Flagged for Phase 2 remediation.",
    project: "Mobile App v2",
    flagged: true,
    sources: ["Slack #mobile", "Sprint planning notes"],
    author: "Jade Kim",
  },
  {
    date: "Feb 14, 2026",
    title: "Hire contractor for design tokens",
    rationale: "Internal team overloaded. 4-week engagement approved.",
    project: "Design System 2.0",
    flagged: false,
    sources: ["Slack #design", "Budget approval email"],
    author: "Amira Patel",
  },
  {
    date: "Feb 10, 2026",
    title: "Vendor SDK locked to v2.1",
    rationale: "v3.0 has breaking changes. Team decided to pin until migration window in April.",
    project: "Data Pipeline Refactor",
    flagged: false,
    sources: ["Slack #data-team", "JIRA DATA-88"],
    author: "Raj Mehta",
  },
];

const Decisions = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = decisions.filter((d) => {
    if (showFlaggedOnly && !d.flagged) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return d.title.toLowerCase().includes(q) || d.project.toLowerCase().includes(q) || d.rationale.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search decisions, rationale, projects..."
                className="h-9 w-80 rounded-lg bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30 transition"
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

        <main className="flex-1 p-6 space-y-6 max-w-[1000px]">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-foreground">Decision Ledger</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track the "why" behind every project decision · {decisions.length} decisions logged
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFlaggedOnly(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                !showFlaggedOnly ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All Decisions
            </button>
            <button
              onClick={() => setShowFlaggedOnly(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                showFlaggedOnly ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <Flag className="w-3 h-3" />
              Lessons Learned
            </button>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border" />

            <div className="space-y-5">
              {filtered.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 relative"
                >
                  <div className="shrink-0 mt-1 z-10">
                    {d.flagged ? (
                      <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-agilow-coral" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 glass-card p-4 hover:shadow-card transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {d.date}
                      </span>
                      <span className="text-xs text-muted-foreground">· {d.author}</span>
                      {d.flagged && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-agilow-coral bg-destructive/10 px-1.5 py-0.5 rounded-full">
                          <Flag className="w-2.5 h-2.5" /> Lesson Learned
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">{d.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{d.rationale}</p>
                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                      <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-medium">
                        {d.project}
                      </span>
                      {d.sources.map((s, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full"
                        >
                          <GitBranch className="w-2.5 h-2.5" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Decisions;
