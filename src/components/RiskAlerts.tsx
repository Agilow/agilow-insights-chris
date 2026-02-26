import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowUpRight, Shield, Zap, X, Info, Hash, TicketCheck, Mail, Video, Lightbulb, ExternalLink } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const risks = [
  {
    project: "API Migration v3",
    severity: "high" as const,
    description: "3 teams blocked on auth endpoint — vendor docs outdated",
    source: "Slack #api-team",
    icon: AlertTriangle,
    detail: {
      summary: "Three downstream teams (Payments, Dashboard, Mobile) are blocked waiting for the v3 auth endpoint migration. The vendor's OAuth2 documentation is outdated and doesn't cover the latest breaking changes in their SDK.",
      impact: "Estimated 12-15 person-days of delay across blocked teams if unresolved by Friday.",
      evidence: [
        { source: "Slack", detail: "67 threads in #api-team mentioning 'blocked' or 'auth' in last 7 days" },
        { source: "Jira", detail: "3 tickets marked 'Blocked' with auth dependency — API-415, API-418, API-421" },
        { source: "Email", detail: "Vendor support ticket #8834 escalated, awaiting response" },
      ],
      recommendation: "Schedule emergency sync with vendor support. Consider implementing a temporary auth proxy as a workaround while vendor resolves docs.",
      timeline: "First flagged 4 days ago. Escalated to high severity 2 days ago based on sentiment shift in Slack.",
    },
  },
  {
    project: "Project Phoenix",
    severity: "medium" as const,
    description: "Sentiment declining — 'blocker' mentions up 40% this week",
    source: "Slack analysis",
    icon: Zap,
    detail: {
      summary: "Natural language analysis of Slack channels related to Project Phoenix shows a 40% increase in negative sentiment keywords ('blocker', 'stuck', 'waiting', 'delayed') compared to the previous week.",
      impact: "Early indicator of potential timeline slip. Current velocity suggests 2-3 day delay if trend continues.",
      evidence: [
        { source: "Slack", detail: "42 threads analyzed — negative sentiment ratio increased from 12% to 17%" },
        { source: "Jira", detail: "Sprint burndown showing 18% deviation from ideal line" },
        { source: "Meetings", detail: "Standup transcript mentions 'load testing environment' as recurring blocker" },
      ],
      recommendation: "Review load testing environment provisioning with DevOps. Address in next standup to prevent further escalation.",
      timeline: "Sentiment shift detected 3 days ago. Trend confirmed over 48-hour window.",
    },
  },
  {
    project: "Auth Overhaul",
    severity: "low" as const,
    description: "New compliance requirement flagged in email thread",
    source: "Email / Legal",
    icon: Shield,
    detail: {
      summary: "Legal team flagged a new GDPR-related requirement in an email thread regarding data encryption at rest. This may require changes to the planned auth token storage approach.",
      impact: "Low immediate impact. Potential 3-5 day additional work if encryption approach needs changing.",
      evidence: [
        { source: "Email", detail: "Thread between Legal and Engineering — 5 messages over 3 days" },
        { source: "Slack", detail: "2 mentions in #auth-team about compliance review" },
      ],
      recommendation: "Schedule 30-minute review with Legal to assess scope. May be addressable with existing encryption library.",
      timeline: "Flagged yesterday. No urgency but should be triaged within the week.",
    },
  },
];

const severityStyles = {
  high: "border-l-status-danger bg-status-danger/5",
  medium: "border-l-status-warning bg-status-warning/5",
  low: "border-l-agilow-teal bg-accent/5",
};

const severityLabels = {
  high: { label: "Critical", className: "text-status-danger bg-status-danger/10" },
  medium: { label: "Medium", className: "text-status-warning bg-status-warning/10" },
  low: { label: "Low", className: "text-accent bg-accent/10" },
};

const sourceIconMap: Record<string, React.ElementType> = {
  Slack: Hash,
  Jira: TicketCheck,
  Email: Mail,
  Meetings: Video,
};

export function RiskAlerts() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Risk Alerts</h3>
          <p className="text-xs text-muted-foreground">AI-detected from team activity</p>
        </div>
        <span className="text-xs font-medium text-agilow-coral bg-destructive/10 px-2 py-1 rounded-full">
          {risks.filter((r) => r.severity === "high").length} critical
        </span>
      </div>

      <div className="space-y-3">
        {risks.map((risk, i) => (
          <div key={i}>
            <div
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className={`border-l-[3px] rounded-lg p-3 ${severityStyles[risk.severity]} cursor-pointer hover:shadow-soft transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <risk.icon className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{risk.project}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{risk.description}</p>
                  </div>
                </div>
                <ArrowUpRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${expandedIndex === i ? "rotate-90" : ""}`} />
              </div>
              <div className="mt-2 ml-6">
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {risk.source}
                </span>
              </div>
            </div>

            {/* Expanded Detail */}
            <AnimatePresence>
              {expandedIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-1 mt-2 p-4 rounded-lg bg-card border border-border space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityLabels[risk.severity].className}`}>
                        {severityLabels[risk.severity].label} Risk
                      </span>
                      <button onClick={(e) => { e.stopPropagation(); setExpandedIndex(null); }} className="p-1 rounded hover:bg-secondary transition-colors">
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Summary */}
                    <p className="text-sm text-foreground">{risk.detail.summary}</p>

                    {/* Impact */}
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                      <p className="text-xs font-semibold text-foreground mb-1">Estimated Impact</p>
                      <p className="text-xs text-muted-foreground">{risk.detail.impact}</p>
                    </div>

                    {/* Evidence */}
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">Evidence from Data Sources</p>
                      <div className="space-y-2">
                        {risk.detail.evidence.map((e, j) => {
                          const SourceIcon = sourceIconMap[e.source] || Info;
                          return (
                            <div key={j} className="flex items-start gap-2 text-xs">
                              <div className="p-1 rounded bg-secondary shrink-0 mt-0.5">
                                <SourceIcon className="w-3 h-3 text-accent" />
                              </div>
                              <div>
                                <span className="font-medium text-foreground">{e.source}: </span>
                                <span className="text-muted-foreground">{e.detail}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-status-warning/5 border border-status-warning/20">
                      <Lightbulb className="w-4 h-4 text-status-warning shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-0.5">AI Recommendation</p>
                        <p className="text-xs text-muted-foreground">{risk.detail.recommendation}</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <p className="text-[10px] text-muted-foreground">{risk.detail.timeline}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
