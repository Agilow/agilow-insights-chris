import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  MessageSquare,
  GitBranch,
  Flag,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Plus,
  Pencil,
  StickyNote,
  X,
  ChevronDown,
  Info,
  User,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel } from "@/components/ChatPanel";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface Decision {
  date: string;
  title: string;
  rationale: string;
  project: string;
  flagged: boolean;
  sources: string[];
  author: string;
  notes: string[];
  origin: "ai" | "manual";
}

const initialDecisions: Decision[] = [
  {
    date: "Feb 24, 2026",
    title: "Postpone OAuth to Phase 2",
    rationale: "Avoid 2-week delay on vendor integration. Team consensus in standup.",
    project: "Project Phoenix",
    flagged: false,
    sources: ["Meeting transcript", "JIRA PHX-189"],
    author: "Sarah Chen",
    notes: [],
    origin: "ai",
  },
  {
    date: "Feb 22, 2026",
    title: "Switch to streaming architecture",
    rationale: "Batch processing can't meet SLA. Approved by architecture board after benchmark review.",
    project: "Data Pipeline Refactor",
    flagged: false,
    sources: ["Slack #data-team", "Confluence RFC-12"],
    author: "Raj Mehta",
    notes: ["Benchmarks showed 3x throughput improvement"],
    origin: "ai",
  },
  {
    date: "Feb 20, 2026",
    title: "Custom encryption library adopted",
    rationale: "Chosen for speed, but caused 3-day downtime. Replacement planned Q3.",
    project: "Auth Overhaul",
    flagged: true,
    sources: ["Slack #auth-team", "Post-mortem doc"],
    author: "Leo Nguyen",
    notes: ["Post-mortem completed Feb 22", "Replacement vendor shortlisted"],
    origin: "ai",
  },
  {
    date: "Feb 18, 2026",
    title: "Migrate to GraphQL gateway",
    rationale: "Reduces API calls by 60%. Approved by architecture review board.",
    project: "API Migration v3",
    flagged: false,
    sources: ["Email thread", "JIRA API-402"],
    author: "Marcus Reeves",
    notes: [],
    origin: "ai",
  },
  {
    date: "Feb 16, 2026",
    title: "Skip accessibility audit for MVP",
    rationale: "Deprioritized to hit launch deadline. Flagged for Phase 2 remediation.",
    project: "Mobile App v2",
    flagged: true,
    sources: ["Slack #mobile", "Sprint planning notes"],
    author: "Jade Kim",
    notes: [],
    origin: "ai",
  },
  {
    date: "Feb 14, 2026",
    title: "Hire contractor for design tokens",
    rationale: "Internal team overloaded. 4-week engagement approved.",
    project: "Design System 2.0",
    flagged: false,
    sources: ["Slack #design", "Budget approval email"],
    author: "Amira Patel",
    notes: [],
    origin: "ai",
  },
  {
    date: "Feb 10, 2026",
    title: "Vendor SDK locked to v2.1",
    rationale: "v3.0 has breaking changes. Team decided to pin until migration window in April.",
    project: "Data Pipeline Refactor",
    flagged: false,
    sources: ["Slack #data-team", "JIRA DATA-88"],
    author: "Raj Mehta",
    notes: [],
    origin: "ai",
  },
];

const Decisions = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [decisions, setDecisions] = useState<Decision[]>(initialDecisions);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<number, string>>({});

  // New decision form state
  const [newDecision, setNewDecision] = useState({
    title: "",
    rationale: "",
    project: "",
    flagged: false,
  });

  const filtered = decisions.filter((d) => {
    if (showFlaggedOnly && !d.flagged) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return d.title.toLowerCase().includes(q) || d.project.toLowerCase().includes(q) || d.rationale.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAddDecision = () => {
    if (!newDecision.title || !newDecision.rationale) return;
    const d: Decision = {
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      title: newDecision.title,
      rationale: newDecision.rationale,
      project: newDecision.project || "Unassigned",
      flagged: newDecision.flagged,
      sources: ["Manual entry"],
      author: "You",
      notes: [],
      origin: "manual",
    };
    setDecisions([d, ...decisions]);
    setNewDecision({ title: "", rationale: "", project: "", flagged: false });
    setShowAddForm(false);
  };

  const handleAddNote = (index: number) => {
    const note = noteInputs[index]?.trim();
    if (!note) return;
    setDecisions(prev => prev.map((d, i) => i === index ? { ...d, notes: [...d.notes, note] } : d));
    setNoteInputs(prev => ({ ...prev, [index]: "" }));
  };

  const handleToggleFlag = (index: number) => {
    setDecisions(prev => prev.map((d, i) => i === index ? { ...d, flagged: !d.flagged } : d));
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Portfolio Decisions</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Track the "why" behind every project decision · {decisions.length} decisions logged
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Log Decision
              </button>
            </div>
          </motion.div>

          {/* How decisions are recognized */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/10 shrink-0">
                <Info className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">How are decisions detected?</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Agilow's AI scans Slack threads, meeting transcripts, email chains, and Jira ticket updates for decision-language patterns 
                  (e.g., "we decided", "approved", "going with", "postponed"). Detected decisions are auto-logged with source links. 
                  You can also <button onClick={() => setShowAddForm(true)} className="text-accent hover:underline font-medium">log decisions manually</button> when 
                  the AI misses something or you want to record an offline conversation.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Add Decision Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="glass-card p-5 border-2 border-accent/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Pencil className="w-4 h-4 text-accent" />
                      Log a New Decision
                    </h3>
                    <button onClick={() => setShowAddForm(false)} className="p-1 rounded hover:bg-secondary transition-colors">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Decision Title *</label>
                      <input
                        value={newDecision.title}
                        onChange={(e) => setNewDecision({ ...newDecision, title: e.target.value })}
                        placeholder="e.g., Switch from REST to gRPC for internal services"
                        className="w-full h-9 rounded-lg bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Rationale *</label>
                      <textarea
                        value={newDecision.rationale}
                        onChange={(e) => setNewDecision({ ...newDecision, rationale: e.target.value })}
                        placeholder="Why was this decision made? What alternatives were considered?"
                        rows={3}
                        className="w-full rounded-lg bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1 block">Project</label>
                        <input
                          value={newDecision.project}
                          onChange={(e) => setNewDecision({ ...newDecision, project: e.target.value })}
                          placeholder="e.g., Project Phoenix"
                          className="w-full h-9 rounded-lg bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newDecision.flagged}
                            onChange={(e) => setNewDecision({ ...newDecision, flagged: e.target.checked })}
                            className="rounded border-border"
                          />
                          <Flag className="w-3.5 h-3.5 text-agilow-coral" />
                          Flag as Lesson Learned
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setShowAddForm(false)} className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                        Cancel
                      </button>
                      <button
                        onClick={handleAddDecision}
                        disabled={!newDecision.title || !newDecision.rationale}
                        className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Decision
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFlaggedOnly(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                !showFlaggedOnly ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All Decisions ({decisions.length})
            </button>
            <button
              onClick={() => setShowFlaggedOnly(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                showFlaggedOnly ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <Flag className="w-3 h-3" />
              Lessons Learned ({decisions.filter(d => d.flagged).length})
            </button>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border" />

            <div className="space-y-5">
              {filtered.map((d, i) => (
                <motion.div
                  key={`${d.date}-${d.title}-${i}`}
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

                  <div className="flex-1 glass-card hover:shadow-card transition-shadow">
                    {/* Main card content */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {d.date}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" /> {d.author}
                        </span>
                        {d.origin === "manual" && (
                          <span className="text-[10px] font-medium text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
                            Manual Entry
                          </span>
                        )}
                        {d.origin === "ai" && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full cursor-help">
                                AI Detected
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs max-w-[200px]">This decision was automatically detected from {d.sources.join(" and ")}.</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
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
                          <span key={j} className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                            <GitBranch className="w-2.5 h-2.5" /> {s}
                          </span>
                        ))}
                      </div>

                      {/* Notes preview */}
                      {d.notes.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-border/50">
                          <p className="text-[10px] font-medium text-muted-foreground mb-1 flex items-center gap-1">
                            <StickyNote className="w-3 h-3" /> {d.notes.length} note{d.notes.length > 1 ? "s" : ""}
                          </p>
                          {d.notes.slice(0, 2).map((n, j) => (
                            <p key={j} className="text-[11px] text-muted-foreground ml-4">• {n}</p>
                          ))}
                          {d.notes.length > 2 && (
                            <p className="text-[10px] text-accent ml-4">+{d.notes.length - 2} more</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions bar */}
                    <div className="border-t border-border flex items-center">
                      <button
                        onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] text-muted-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <StickyNote className="w-3 h-3" />
                        Add Note
                        <ChevronDown className={`w-3 h-3 transition-transform ${expandedIndex === i ? "rotate-180" : ""}`} />
                      </button>
                      <div className="w-px h-6 bg-border" />
                      <button
                        onClick={() => handleToggleFlag(i)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] transition-colors ${
                          d.flagged ? "text-agilow-coral hover:bg-destructive/5" : "text-muted-foreground hover:bg-secondary/50"
                        }`}
                      >
                        <Flag className="w-3 h-3" />
                        {d.flagged ? "Unflag" : "Flag as Lesson"}
                      </button>
                      <div className="w-px h-6 bg-border" />
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] text-muted-foreground hover:bg-secondary/50 transition-colors">
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                    </div>

                    {/* Expanded note input */}
                    <AnimatePresence>
                      {expandedIndex === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-3 pt-1 border-t border-border/50 space-y-2">
                            {d.notes.map((n, j) => (
                              <div key={j} className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/50 p-2 rounded-lg">
                                <StickyNote className="w-3 h-3 shrink-0 mt-0.5" />
                                {n}
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <input
                                value={noteInputs[i] || ""}
                                onChange={(e) => setNoteInputs({ ...noteInputs, [i]: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && handleAddNote(i)}
                                placeholder="Add a note or follow-up..."
                                className="flex-1 h-8 rounded-lg bg-secondary px-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30"
                              />
                              <button
                                onClick={() => handleAddNote(i)}
                                className="px-3 h-8 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
