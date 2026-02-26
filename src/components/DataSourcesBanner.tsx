import { motion } from "framer-motion";
import { Hash, Mail, Video, TicketCheck, RefreshCw, CheckCircle2, Wifi } from "lucide-react";

const sources = [
  {
    name: "Slack",
    icon: Hash,
    status: "synced" as const,
    lastSync: "2 min ago",
    channels: 14,
    detail: "14 channels",
  },
  {
    name: "Jira",
    icon: TicketCheck,
    status: "synced" as const,
    lastSync: "5 min ago",
    channels: 4,
    detail: "4 boards",
  },
  {
    name: "Email",
    icon: Mail,
    status: "synced" as const,
    lastSync: "8 min ago",
    channels: 3,
    detail: "3 inboxes",
  },
  {
    name: "Meetings",
    icon: Video,
    status: "syncing" as const,
    lastSync: "Syncing now...",
    channels: 0,
    detail: "12 transcripts",
  },
];

const statusStyles = {
  synced: "text-status-success",
  syncing: "text-status-warning",
  error: "text-status-danger",
};

export function DataSourcesBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="glass-card p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10">
            <Wifi className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Data Sources</h3>
            <p className="text-[11px] text-muted-foreground">
              Aggregating context from {sources.length} platforms in real time
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary">
          <RefreshCw className="w-3 h-3" />
          Sync all
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {sources.map((source, i) => (
          <motion.div
            key={source.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50 hover:bg-secondary/80 transition-colors cursor-pointer group"
          >
            <div className="p-2 rounded-lg bg-background">
              <source.icon className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-foreground">{source.name}</span>
                {source.status === "synced" ? (
                  <CheckCircle2 className={`w-3 h-3 ${statusStyles[source.status]}`} />
                ) : (
                  <RefreshCw className={`w-3 h-3 animate-spin ${statusStyles[source.status]}`} />
                )}
              </div>
              <p className="text-[11px] text-muted-foreground truncate">{source.detail} · {source.lastSync}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
