import { motion } from "framer-motion";
import { GitBranch, Flag, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

const decisions = [
  {
    date: "Feb 24, 2026",
    title: "Postpone OAuth to Phase 2",
    rationale: "Avoid 2-week delay on vendor integration. Team consensus in standup.",
    project: "Project Phoenix",
    flagged: false,
    sources: ["Meeting transcript", "JIRA PHX-189"],
  },
  {
    date: "Feb 20, 2026",
    title: "Custom encryption library adopted",
    rationale: "Chosen for speed, but caused 3-day downtime. Replacement planned Q3.",
    project: "Auth Overhaul",
    flagged: true,
    sources: ["Slack #auth-team", "Post-mortem doc"],
  },
  {
    date: "Feb 18, 2026",
    title: "Migrate to GraphQL gateway",
    rationale: "Reduces API calls by 60%. Approved by architecture review board.",
    project: "API Migration v3",
    flagged: false,
    sources: ["Email thread", "JIRA API-402"],
  },
  {
    date: "Feb 14, 2026",
    title: "Hire contractor for design tokens",
    rationale: "Internal team overloaded. 4-week engagement approved.",
    project: "Design System 2.0",
    flagged: false,
    sources: ["Slack #design", "Budget approval email"],
  },
];

export function DecisionTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Decision Ledger</h3>
          <p className="text-xs text-muted-foreground">Recent project decisions with rationale</p>
        </div>
        <button className="text-xs font-medium text-accent flex items-center gap-1 hover:underline">
          View all <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

        <div className="space-y-4">
          {decisions.map((d, i) => (
            <div key={i} className="flex gap-3 relative">
              <div className="shrink-0 mt-1 z-10">
                {d.flagged ? (
                  <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5 text-agilow-coral" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                  </div>
                )}
              </div>

              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs text-muted-foreground">{d.date}</span>
                  {d.flagged && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-agilow-coral bg-destructive/10 px-1.5 py-0.5 rounded-full">
                      <Flag className="w-2.5 h-2.5" /> Lesson Learned
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-medium text-foreground">{d.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{d.rationale}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
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
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
