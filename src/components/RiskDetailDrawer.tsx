import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  X, Sparkles, User, AlertTriangle, TrendingUp, TrendingDown,
  ExternalLink, Hash, TicketCheck, Mail, Video, FileText,
  CheckCircle2, Clock, ArrowRight, Plus, Save, Quote,
} from "lucide-react";
import { RiskFeedback } from "./RiskFeedback";

export interface EnhancedRisk {
  id: string;
  description: string;
  severity: "high" | "medium" | "low";
  source: string;
  nextAction: string;
  type: "ai-detected" | "manual";
  owner: string;
  status: "open" | "in-progress" | "mitigated" | "closed";
  impact?: string;
  likelihood?: "high" | "medium" | "low";
  affectedMilestones?: string[];
  signals?: { source: string; summary: string; date: string; quote?: string; signalId?: string }[];
  sourceLinks?: { label: string; type: "jira" | "slack" | "email" | "meeting" | "doc"; url: string }[];
  notes?: { author: string; date: string; text: string }[];
  flaggedReason?: string;
}

const statusConfig: Record<string, { label: string; style: string; icon: React.ElementType }> = {
  open: { label: "Open", style: "text-status-danger bg-status-danger/10 border-status-danger/20", icon: AlertTriangle },
  "in-progress": { label: "In Progress", style: "text-status-warning bg-status-warning/10 border-status-warning/20", icon: Clock },
  mitigated: { label: "Mitigated", style: "text-status-success bg-status-success/10 border-status-success/20", icon: CheckCircle2 },
  closed: { label: "Closed", style: "text-muted-foreground bg-secondary border-border", icon: CheckCircle2 },
};

const likelihoodConfig: Record<string, string> = {
  high: "text-status-danger bg-status-danger/10 border-status-danger/20",
  medium: "text-status-warning bg-status-warning/10 border-status-warning/20",
  low: "text-accent bg-accent/10 border-accent/20",
};

const severityConfig: Record<string, string> = {
  high: "text-status-danger bg-status-danger/10 border-status-danger/20",
  medium: "text-status-warning bg-status-warning/10 border-status-warning/20",
  low: "text-accent bg-accent/10 border-accent/20",
};

const sourceIconMap: Record<string, React.ElementType> = {
  jira: TicketCheck,
  slack: Hash,
  email: Mail,
  meeting: Video,
  doc: FileText,
};

interface Props {
  risk: EnhancedRisk;
  onClose: () => void;
}

export function RiskDetailDrawer({ risk, onClose }: Props) {
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState(risk.notes || []);
  const st = statusConfig[risk.status];
  const StIcon = st.icon;

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes(prev => [...prev, { author: "You", date: "Just now", text: newNote.trim() }]);
    setNewNote("");
  };

  return (
    <>
      <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40" onClick={onClose} />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-card border-l border-border shadow-elevated overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 sm:p-5 z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${severityConfig[risk.severity]}`}>
                  {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} Severity
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${st.style}`}>
                  <StIcon className="w-2.5 h-2.5" /> {st.label}
                </span>
                {risk.type === "ai-detected" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-2.5 h-2.5" /> AI Detected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary border border-border px-2 py-0.5 rounded-full">
                    <User className="w-2.5 h-2.5" /> Manual
                  </span>
                )}
              </div>
              <h2 className="text-sm font-semibold text-foreground leading-snug">{risk.description}</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors shrink-0">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-5">
          {/* Why flagged */}
          {risk.flaggedReason && (
            <div className="p-3.5 rounded-lg bg-accent/5 border border-accent/15">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <h4 className="text-xs font-semibold text-foreground">Why this was flagged</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{risk.flaggedReason}</p>
            </div>
          )}

          {/* Impact & Likelihood */}
          <div className="grid grid-cols-2 gap-3">
            {risk.impact && (
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/60">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Impact</p>
                <p className="text-xs text-foreground">{risk.impact}</p>
              </div>
            )}
            {risk.likelihood && (
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/60">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Likelihood</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${likelihoodConfig[risk.likelihood]}`}>
                  {risk.likelihood.charAt(0).toUpperCase() + risk.likelihood.slice(1)}
                </span>
              </div>
            )}
          </div>

          {/* Owner & affected milestones */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Owner:</span>
              <span className="text-xs font-medium text-foreground">{risk.owner}</span>
            </div>
            {risk.affectedMilestones && risk.affectedMilestones.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Affected Milestones
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {risk.affectedMilestones.map((m, i) => (
                    <span key={i} className="text-[10px] font-medium text-foreground bg-secondary border border-border px-2 py-0.5 rounded-full">{m}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Signals */}
          {risk.signals && risk.signals.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Key Signals</h4>
              <div className="space-y-2">
                {risk.signals.map((sig, i) => (
                  <div key={i} className="rounded-lg bg-secondary/40 border border-border/60 overflow-hidden">
                    <div className="flex items-start gap-2.5 p-2.5">
                      <div className="p-1.5 rounded-md bg-background shrink-0 mt-0.5">
                        {sig.source === "Slack" ? <Hash className="w-3 h-3 text-accent" /> :
                         sig.source === "Jira" ? <TicketCheck className="w-3 h-3 text-accent" /> :
                         sig.source === "Meeting" ? <Video className="w-3 h-3 text-accent" /> :
                         <Mail className="w-3 h-3 text-accent" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground font-medium">{sig.summary}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{sig.source} · {sig.date}</p>
                      </div>
                    </div>
                    {sig.quote && (
                      <div className="mx-2.5 mb-2.5 p-2.5 rounded-md bg-background/60 border-l-2 border-accent/40">
                        <div className="flex items-start gap-1.5">
                          <Quote className="w-3 h-3 text-accent/60 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-muted-foreground italic leading-relaxed">"{sig.quote}"</p>
                        </div>
                      </div>
                    )}
                    {sig.signalId && (
                      <button
                        onClick={() => { onClose(); navigate(`/signals?highlight=${sig.signalId}`); }}
                        className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium text-accent hover:bg-accent/5 border-t border-border/60 transition-colors"
                      >
                        View signal details <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next recommended action */}
          <div className="p-3.5 rounded-lg bg-status-success/5 border border-status-success/15">
            <div className="flex items-center gap-1.5 mb-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-status-success" />
              <h4 className="text-xs font-semibold text-foreground">Recommended Next Action</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{risk.nextAction}</p>
          </div>

          {/* Source Links */}
          {risk.sourceLinks && risk.sourceLinks.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Source Links</h4>
              <div className="space-y-1.5">
                {risk.sourceLinks.map((link, i) => {
                  const LinkIcon = sourceIconMap[link.type] || FileText;
                  return (
                    <a key={i} href={link.url} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-secondary/40 border border-border/60 hover:bg-secondary/60 transition-colors group">
                      <LinkIcon className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="text-xs text-foreground group-hover:text-accent transition-colors flex-1">{link.label}</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className="p-3.5 rounded-lg bg-secondary/50 border border-border/60">
            <h4 className="text-xs font-semibold text-foreground mb-2">Is this risk relevant?</h4>
            <RiskFeedback riskId={risk.id} variant="expanded" />
          </div>

          {/* Team Notes */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Team Notes</h4>
            {notes.length === 0 && (
              <p className="text-xs text-muted-foreground italic mb-2">No notes yet. Add context or mitigation details below.</p>
            )}
            <div className="space-y-2 mb-3">
              {notes.map((note, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-secondary/40 border border-border/60">
                  <p className="text-xs text-foreground">{note.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{note.author} · {note.date}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                placeholder="Add a note…"
                className="flex-1 text-xs bg-secondary border border-border rounded-lg px-3 py-2 text-foreground outline-none focus:border-accent/40 placeholder:text-muted-foreground"
              />
              <button onClick={addNote} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
