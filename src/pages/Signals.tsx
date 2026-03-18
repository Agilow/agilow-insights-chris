import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash, TicketCheck, Mail, Video, MessageSquare, FileText,
  Sparkles, CheckCircle2, XCircle, ChevronDown, ChevronUp,
  AlertTriangle, ShieldAlert, Gavel, Flag, ListChecks, Lightbulb,
  Clock, User, ArrowRight, Undo2, Filter, ExternalLink,
  ThumbsUp, ThumbsDown,
} from "lucide-react";
import { AppSidebar, MobileMenuButton } from "@/components/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ── Source icon mapping ── */
const sourceConfig: Record<string, { icon: typeof Hash; label: string; color: string }> = {
  slack: { icon: Hash, label: "Slack", color: "bg-[hsl(var(--agilow-teal))]/10 text-[hsl(var(--agilow-teal))]" },
  jira: { icon: TicketCheck, label: "Jira", color: "bg-blue-500/10 text-blue-600" },
  meeting: { icon: Video, label: "Meeting Transcript", color: "bg-violet-500/10 text-violet-600" },
  email: { icon: Mail, label: "Email", color: "bg-amber-500/10 text-amber-600" },
  gdrive: { icon: FileText, label: "Google Drive", color: "bg-emerald-500/10 text-emerald-600" },
};

/* ── Signal type config ── */
const signalTypeConfig: Record<string, { icon: typeof AlertTriangle; label: string; color: string }> = {
  risk: { icon: ShieldAlert, label: "Risk", color: "bg-status-danger/10 text-status-danger" },
  blocker: { icon: AlertTriangle, label: "Blocker", color: "bg-status-danger/10 text-status-danger" },
  decision: { icon: Gavel, label: "Decision", color: "bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]" },
  task: { icon: ListChecks, label: "Task", color: "bg-[hsl(var(--agilow-teal))]/10 text-[hsl(var(--agilow-teal))]" },
  milestone: { icon: Flag, label: "Milestone", color: "bg-violet-500/10 text-violet-600" },
  lessons_learned: { icon: Lightbulb, label: "Lesson Learned", color: "bg-amber-500/10 text-amber-600" },
};

const severityColors: Record<string, string> = {
  critical: "bg-status-danger/10 text-status-danger border-status-danger/20",
  high: "bg-status-danger/10 text-status-danger border-status-danger/20",
  medium: "bg-status-warning/10 text-status-warning border-status-warning/20",
  low: "bg-status-success/10 text-status-success border-status-success/20",
};

/* ── Signal data ── */
interface Signal {
  id: string;
  quote: string;
  context: string;
  source: { type: string; ref: string; link?: string };
  detectedAt: string;
  signalType: string;
  severity: "critical" | "high" | "medium" | "low";
  project: { id: string; name: string };
  owner: string | null;
  dueDate: string | null;
  recommendedAction: string;
  confidence: "high" | "medium" | "low";
  status: "pending" | "validated" | "rejected";
  rejectionReason?: string;
}

const mockSignals: Signal[] = [
  {
    id: "sig-001",
    quote: "I haven't had time to finish the auth token rotation ticket. I'll push it to next week.",
    context: "Jira comment on AUTH-342 by Marcus Chen, posted March 14, 2026",
    source: { type: "jira", ref: "AUTH-342 comment", link: "#" },
    detectedAt: "2 hours ago",
    signalType: "task",
    severity: "medium",
    project: { id: "auth-overhaul", name: "Auth Overhaul" },
    owner: "Marcus Chen",
    dueDate: "Mar 21, 2026",
    recommendedAction: "Follow up with Marcus on auth token rotation — task is slipping from original due date.",
    confidence: "high",
    status: "pending",
  },
  {
    id: "sig-002",
    quote: "John is going to be on vacation starting next Monday for two weeks. Nobody else knows the payment gateway integration well enough to cover.",
    context: "Weekly standup meeting transcript — March 17, 2026, spoken by Elena R.",
    source: { type: "meeting", ref: "Weekly Standup — Mar 17", link: "#" },
    detectedAt: "4 hours ago",
    signalType: "risk",
    severity: "high",
    project: { id: "api-migration-v3", name: "API Migration v3" },
    owner: "Elena R.",
    dueDate: null,
    recommendedAction: "Identify backup coverage for payment gateway integration before John's vacation starts Monday.",
    confidence: "high",
    status: "pending",
  },
  {
    id: "sig-003",
    quote: "We decided to go with Stripe Connect instead of building our own marketplace payment system. The build-vs-buy analysis made it clear.",
    context: "Architecture review meeting transcript — March 15, 2026, spoken by James K.",
    source: { type: "meeting", ref: "Architecture Review — Mar 15", link: "#" },
    detectedAt: "1 day ago",
    signalType: "decision",
    severity: "high",
    project: { id: "api-migration-v3", name: "API Migration v3" },
    owner: "James K.",
    dueDate: null,
    recommendedAction: "Document the build-vs-buy decision and update project plan to reflect Stripe Connect integration timeline.",
    confidence: "high",
    status: "pending",
  },
  {
    id: "sig-004",
    quote: "The staging environment has been down for three days now and nobody has looked at it. We can't run integration tests.",
    context: "#infra-alerts Slack channel, posted by DevOps bot and followed up by Ryan C.",
    source: { type: "slack", ref: "#infra-alerts thread", link: "#" },
    detectedAt: "6 hours ago",
    signalType: "blocker",
    severity: "critical",
    project: { id: "project-phoenix", name: "Project Phoenix" },
    owner: "Ryan C.",
    dueDate: null,
    recommendedAction: "Escalate staging environment outage immediately — blocking all integration testing for Phoenix release.",
    confidence: "high",
    status: "pending",
  },
  {
    id: "sig-005",
    quote: "We hit the 10k concurrent users milestone in load testing yesterday! All latency targets met.",
    context: "#project-phoenix Slack channel, posted by Alex T., March 16, 2026",
    source: { type: "slack", ref: "#project-phoenix", link: "#" },
    detectedAt: "1 day ago",
    signalType: "milestone",
    severity: "low",
    project: { id: "project-phoenix", name: "Project Phoenix" },
    owner: "Alex T.",
    dueDate: null,
    recommendedAction: "Mark the load testing milestone as complete and proceed to production deployment planning.",
    confidence: "high",
    status: "pending",
  },
  {
    id: "sig-006",
    quote: "You need to go over the compliance document before Thursday or we'll miss the regulatory window.",
    context: "1:1 meeting transcript — March 16, 2026, spoken by Sarah L. to David M.",
    source: { type: "meeting", ref: "1:1 Sarah & David — Mar 16", link: "#" },
    detectedAt: "12 hours ago",
    signalType: "task",
    severity: "high",
    project: { id: "regulatory-compliance", name: "Regulatory Compliance" },
    owner: "David M.",
    dueDate: "Mar 20, 2026",
    recommendedAction: "Ensure David reviews the compliance document before Thursday's regulatory deadline.",
    confidence: "medium",
    status: "pending",
  },
  {
    id: "sig-007",
    quote: "Lesson from the last sprint: we should never start integration work without having the API contract finalized. Cost us a full week of rework.",
    context: "Sprint retrospective meeting transcript — March 14, 2026, spoken by Sofia M.",
    source: { type: "meeting", ref: "Sprint Retro — Mar 14", link: "#" },
    detectedAt: "2 days ago",
    signalType: "lessons_learned",
    severity: "medium",
    project: { id: "project-phoenix", name: "Project Phoenix" },
    owner: "Sofia M.",
    dueDate: null,
    recommendedAction: "Add to project playbook: finalize API contracts before starting integration work.",
    confidence: "high",
    status: "pending",
  },
  {
    id: "sig-008",
    quote: "The vendor hasn't responded to our security questionnaire in 10 days. If we don't hear back by Friday we need to evaluate alternatives.",
    context: "#vendor-management Slack channel, posted by Lisa P., March 17, 2026",
    source: { type: "slack", ref: "#vendor-management thread", link: "#" },
    detectedAt: "3 hours ago",
    signalType: "risk",
    severity: "medium",
    project: { id: "data-pipeline-2", name: "Data Pipeline v2" },
    owner: "Lisa P.",
    dueDate: "Mar 21, 2026",
    recommendedAction: "Send a final follow-up to the vendor and begin parallel evaluation of alternative security solutions.",
    confidence: "medium",
    status: "pending",
  },
];

/* ── Rejection reasons ── */
const rejectionReasons = [
  "Wrong project",
  "Not a real signal",
  "Already captured",
  "Outdated / resolved",
  "Low relevance",
];

/* ── Component ── */
export default function Signals() {
  const [signals, setSignals] = useState<Signal[]>(mockSignals);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const filteredSignals = signals.filter((s) => {
    if (filterType !== "all" && s.signalType !== filterType) return false;
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    if (filterSource !== "all" && s.source.type !== filterSource) return false;
    return true;
  });

  const pendingCount = signals.filter((s) => s.status === "pending").length;
  const validatedCount = signals.filter((s) => s.status === "validated").length;
  const rejectedCount = signals.filter((s) => s.status === "rejected").length;

  const handleValidate = (id: string) => {
    setSignals((prev) => prev.map((s) => s.id === id ? { ...s, status: "validated" as const } : s));
    setRejectingId(null);
  };

  const handleReject = (id: string, reason: string) => {
    setSignals((prev) => prev.map((s) => s.id === id ? { ...s, status: "rejected" as const, rejectionReason: reason } : s));
    setRejectingId(null);
  };

  const handleUndo = (id: string) => {
    setSignals((prev) => prev.map((s) => s.id === id ? { ...s, status: "pending" as const, rejectionReason: undefined } : s));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MobileMenuButton />
                <h1 className="text-2xl font-bold text-foreground">Signal Validation</h1>
                <Badge className="bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/20 text-[10px]">
                  <Sparkles className="w-3 h-3 mr-1" /> AI-Detected
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Review and validate signals extracted from your workspace sources. Confirm what's accurate, reject what's not.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => setFilterStatus("pending")}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                filterStatus === "pending" ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/5 ring-1 ring-[hsl(var(--accent))]/20" : "border-border bg-card hover:border-[hsl(var(--accent))]/30"
              )}
            >
              <div className="text-2xl font-bold text-foreground">{pendingCount}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Pending review</div>
            </button>
            <button
              onClick={() => setFilterStatus("validated")}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                filterStatus === "validated" ? "border-status-success bg-status-success/5 ring-1 ring-status-success/20" : "border-border bg-card hover:border-status-success/30"
              )}
            >
              <div className="text-2xl font-bold text-foreground">{validatedCount}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Validated</div>
            </button>
            <button
              onClick={() => setFilterStatus("rejected")}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                filterStatus === "rejected" ? "border-status-danger bg-status-danger/5 ring-1 ring-status-danger/20" : "border-border bg-card hover:border-status-danger/30"
              )}
            >
              <div className="text-2xl font-bold text-foreground">{rejectedCount}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</div>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </div>
            {/* Type filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs rounded-lg border border-border bg-card px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All types</option>
              {Object.entries(signalTypeConfig).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
            {/* Source filter */}
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="text-xs rounded-lg border border-border bg-card px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All sources</option>
              {Object.entries(sourceConfig).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="text-[10px] text-muted-foreground hover:text-foreground underline"
              >
                Show all statuses
              </button>
            )}
          </div>

          {/* Signal list */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredSignals.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 text-muted-foreground"
                >
                  <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No signals match the current filters.</p>
                </motion.div>
              )}
              {filteredSignals.map((signal) => {
                const typeCfg = signalTypeConfig[signal.signalType];
                const srcCfg = sourceConfig[signal.source.type];
                const isExpanded = expandedId === signal.id;
                const TypeIcon = typeCfg?.icon || AlertTriangle;
                const SrcIcon = srcCfg?.icon || MessageSquare;

                return (
                  <motion.div
                    key={signal.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "rounded-xl border bg-card overflow-hidden transition-all",
                      signal.status === "validated" && "border-status-success/30 bg-status-success/[0.02]",
                      signal.status === "rejected" && "border-border opacity-60",
                    )}
                  >
                    {/* Main row */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : signal.id)}
                      className="w-full text-left px-4 py-3.5 flex items-start gap-3"
                    >
                      {/* Type icon */}
                      <div className={cn("shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5", typeCfg?.color)}>
                        <TypeIcon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded", typeCfg?.color)}>
                            {typeCfg?.label}
                          </span>
                          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border", severityColors[signal.severity])}>
                            {signal.severity}
                          </span>
                          <span className={cn("text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1", srcCfg?.color)}>
                            <SrcIcon className="w-2.5 h-2.5" /> {srcCfg?.label}
                          </span>
                          {signal.confidence !== "high" && (
                            <span className="text-[10px] text-muted-foreground italic">
                              {signal.confidence} confidence
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground leading-snug line-clamp-2 italic">
                          "{signal.quote}"
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" /> {signal.project.name}
                          </span>
                          {signal.owner && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" /> {signal.owner}
                            </span>
                          )}
                          {signal.dueDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {signal.dueDate}
                            </span>
                          )}
                          <span>{signal.detectedAt}</span>
                        </div>
                      </div>

                      {/* Status / actions */}
                      <div className="shrink-0 flex items-center gap-2">
                        {signal.status === "validated" && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-status-success font-medium">Validated ✓</span>
                            <button onClick={(e) => { e.stopPropagation(); handleUndo(signal.id); }} className="p-0.5 rounded hover:bg-secondary text-muted-foreground/40 hover:text-muted-foreground"><Undo2 className="w-3 h-3" /></button>
                          </div>
                        )}
                        {signal.status === "rejected" && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground italic">Rejected{signal.rejectionReason ? ` — ${signal.rejectionReason}` : ""}</span>
                            <button onClick={(e) => { e.stopPropagation(); handleUndo(signal.id); }} className="p-0.5 rounded hover:bg-secondary text-muted-foreground/40 hover:text-muted-foreground"><Undo2 className="w-3 h-3" /></button>
                          </div>
                        )}
                        {signal.status === "pending" && (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleValidate(signal.id)}
                              className="p-1.5 rounded-lg hover:bg-status-success/10 text-muted-foreground/40 hover:text-status-success transition-colors"
                              title="Validate — confirm this signal"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setRejectingId(rejectingId === signal.id ? null : signal.id)}
                              className="p-1.5 rounded-lg hover:bg-status-danger/10 text-muted-foreground/40 hover:text-status-danger transition-colors"
                              title="Reject — not a valid signal"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground/40" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/40" />}
                      </div>
                    </button>

                    {/* Rejection reason picker */}
                    <AnimatePresence>
                      {rejectingId === signal.id && signal.status === "pending" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-border"
                        >
                          <div className="px-4 py-3 bg-secondary/30">
                            <p className="text-xs text-foreground font-medium mb-2">Why is this signal not valid?</p>
                            <div className="flex flex-wrap gap-1.5">
                              {rejectionReasons.map((reason) => (
                                <button
                                  key={reason}
                                  onClick={() => handleReject(signal.id, reason)}
                                  className="text-[10px] px-2.5 py-1 rounded-full border border-border bg-card text-foreground hover:bg-secondary/70 transition-colors"
                                >
                                  {reason}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => handleReject(signal.id, "")}
                              className="text-[10px] text-muted-foreground hover:text-foreground underline mt-2"
                            >
                              Skip — just reject
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-border"
                        >
                          <div className="px-4 py-4 space-y-4 bg-muted/30">
                            {/* Source & Context */}
                            <div>
                              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Source & Context</h4>
                              <div className="rounded-lg border border-border bg-card p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={cn("text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-medium", srcCfg?.color)}>
                                    <SrcIcon className="w-3 h-3" /> {srcCfg?.label}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground">{signal.source.ref}</span>
                                  {signal.source.link && (
                                    <a href={signal.source.link} className="text-[10px] text-[hsl(var(--accent))] flex items-center gap-0.5 hover:underline ml-auto">
                                      <ExternalLink className="w-3 h-3" /> View source
                                    </a>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">{signal.context}</p>
                                <blockquote className="mt-2 pl-3 border-l-2 border-[hsl(var(--accent))]/30 text-sm text-foreground italic">
                                  "{signal.quote}"
                                </blockquote>
                              </div>
                            </div>

                            {/* AI Analysis */}
                            <div>
                              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">AI Analysis</h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg border border-border bg-card p-3">
                                  <div className="text-[10px] text-muted-foreground mb-1">Detected Type</div>
                                  <div className="flex items-center gap-1.5">
                                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1", typeCfg?.color)}>
                                      <TypeIcon className="w-3 h-3" /> {typeCfg?.label}
                                    </span>
                                  </div>
                                </div>
                                <div className="rounded-lg border border-border bg-card p-3">
                                  <div className="text-[10px] text-muted-foreground mb-1">Severity / Priority</div>
                                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded border", severityColors[signal.severity])}>
                                    {signal.severity}
                                  </span>
                                </div>
                                <div className="rounded-lg border border-border bg-card p-3">
                                  <div className="text-[10px] text-muted-foreground mb-1">Assigned Project</div>
                                  <span className="text-xs font-medium text-foreground">{signal.project.name}</span>
                                </div>
                                <div className="rounded-lg border border-border bg-card p-3">
                                  <div className="text-[10px] text-muted-foreground mb-1">Confidence</div>
                                  <span className={cn(
                                    "text-xs font-medium px-2 py-0.5 rounded",
                                    signal.confidence === "high" ? "bg-status-success/10 text-status-success" :
                                    signal.confidence === "medium" ? "bg-status-warning/10 text-status-warning" :
                                    "bg-status-danger/10 text-status-danger"
                                  )}>
                                    {signal.confidence}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Owner & Due Date */}
                            <div className="flex gap-3">
                              {signal.owner && (
                                <div className="flex-1 rounded-lg border border-border bg-card p-3">
                                  <div className="text-[10px] text-muted-foreground mb-1">Owner</div>
                                  <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                                    <User className="w-3 h-3" /> {signal.owner}
                                  </div>
                                </div>
                              )}
                              {signal.dueDate && (
                                <div className="flex-1 rounded-lg border border-border bg-card p-3">
                                  <div className="text-[10px] text-muted-foreground mb-1">Due Date</div>
                                  <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                                    <Clock className="w-3 h-3" /> {signal.dueDate}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Recommended Action */}
                            <div className="rounded-lg border border-[hsl(var(--accent))]/20 bg-[hsl(var(--accent))]/5 p-3">
                              <div className="text-[10px] font-semibold text-[hsl(var(--accent))] uppercase tracking-wider mb-1">Recommended Action</div>
                              <p className="text-xs text-foreground">{signal.recommendedAction}</p>
                            </div>

                            {/* Action buttons (when pending) */}
                            {signal.status === "pending" && (
                              <div className="flex items-center gap-3 pt-1">
                                <button
                                  onClick={() => handleValidate(signal.id)}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-status-success/10 border border-status-success/20 text-status-success text-xs font-medium hover:bg-status-success/20 transition-colors"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" /> Validate Signal
                                </button>
                                <button
                                  onClick={() => setRejectingId(rejectingId === signal.id ? null : signal.id)}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary border border-border text-muted-foreground text-xs font-medium hover:bg-secondary/70 transition-colors"
                                >
                                  <ThumbsDown className="w-3.5 h-3.5" /> Reject Signal
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
