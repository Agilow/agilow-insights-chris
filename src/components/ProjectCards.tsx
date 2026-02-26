import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Clock, Hash, TicketCheck, Mail, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sourceIcons = {
  slack: { icon: Hash, label: "Slack" },
  jira: { icon: TicketCheck, label: "Jira" },
  email: { icon: Mail, label: "Email" },
  meeting: { icon: Video, label: "Meetings" },
};

type SourceKey = keyof typeof sourceIcons;

const projects = [
  {
    name: "Project Phoenix",
    slug: "project-phoenix",
    status: "on-track" as const,
    progress: 78,
    risk: "low" as const,
    team: 6,
    dueIn: "12 days",
    trend: "up" as const,
    effort: "High",
    sources: ["slack", "jira", "meeting"] as SourceKey[],
    signals: "42 Slack threads · 18 Jira updates · 3 meetings",
  },
  {
    name: "API Migration v3",
    slug: "api-migration-v3",
    status: "at-risk" as const,
    progress: 45,
    risk: "high" as const,
    team: 4,
    dueIn: "8 days",
    trend: "down" as const,
    effort: "Critical",
    sources: ["slack", "jira", "email"] as SourceKey[],
    signals: "67 Slack threads · 24 Jira updates · 8 emails",
  },
  {
    name: "Design System 2.0",
    status: "on-track" as const,
    progress: 92,
    risk: "low" as const,
    team: 3,
    dueIn: "3 days",
    trend: "up" as const,
    effort: "Medium",
    sources: ["slack", "jira"] as SourceKey[],
    signals: "12 Slack threads · 9 Jira updates",
  },
  {
    name: "Auth Overhaul",
    status: "blocked" as const,
    progress: 33,
    risk: "medium" as const,
    team: 5,
    dueIn: "21 days",
    trend: "flat" as const,
    effort: "High",
    sources: ["slack", "jira", "email", "meeting"] as SourceKey[],
    signals: "31 Slack threads · 14 Jira updates · 5 emails · 2 meetings",
  },
];

const statusConfig = {
  "on-track": { label: "On Track", icon: CheckCircle2, className: "text-status-success bg-status-success/10" },
  "at-risk": { label: "At Risk", icon: AlertTriangle, className: "text-status-danger bg-status-danger/10" },
  blocked: { label: "Blocked", icon: Clock, className: "text-status-warning bg-status-warning/10" },
};

const trendIcons = { up: TrendingUp, down: TrendingDown, flat: Minus };

export function ProjectCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((p, i) => {
        const st = statusConfig[p.status];
        const TrendIcon = trendIcons[p.trend];
        return (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5 hover:shadow-card transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.team} members · Due in {p.dueIn}
                </p>
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${st.className}`}>
                <st.icon className="w-3 h-3" />
                {st.label}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{p.progress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.progress}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  className="h-full bg-accent rounded-full"
                />
              </div>
            </div>

            {/* Source indicators */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground mr-1">Sources:</span>
                {p.sources.map((src) => {
                  const S = sourceIcons[src];
                  return (
                    <span
                      key={src}
                      title={S.label}
                      className="w-5 h-5 rounded bg-secondary flex items-center justify-center"
                    >
                      <S.icon className="w-3 h-3 text-accent" />
                    </span>
                  );
                })}
              </div>
              <span className="flex items-center gap-1">
                <TrendIcon className="w-3.5 h-3.5" />
                Velocity
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">{p.signals}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
