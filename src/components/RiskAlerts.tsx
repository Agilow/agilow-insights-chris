import { motion } from "framer-motion";
import { AlertTriangle, ArrowUpRight, Shield, Zap } from "lucide-react";

const risks = [
  {
    project: "API Migration v3",
    severity: "high" as const,
    description: "3 teams blocked on auth endpoint — vendor docs outdated",
    source: "Slack #api-team",
    icon: AlertTriangle,
  },
  {
    project: "Project Phoenix",
    severity: "medium" as const,
    description: "Sentiment declining — 'blocker' mentions up 40% this week",
    source: "Slack analysis",
    icon: Zap,
  },
  {
    project: "Auth Overhaul",
    severity: "low" as const,
    description: "New compliance requirement flagged in email thread",
    source: "Email / Legal",
    icon: Shield,
  },
];

const severityStyles = {
  high: "border-l-status-danger bg-status-danger/5",
  medium: "border-l-status-warning bg-status-warning/5",
  low: "border-l-agilow-teal bg-accent/5",
};

export function RiskAlerts() {
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
          <div
            key={i}
            className={`border-l-[3px] rounded-lg p-3 ${severityStyles[risk.severity]} cursor-pointer hover:shadow-soft transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <risk.icon className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{risk.project}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{risk.description}</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>
            <div className="mt-2 ml-6">
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {risk.source}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
