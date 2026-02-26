import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, Mail, Video, TicketCheck, RefreshCw, CheckCircle2, Wifi, ChevronDown, ExternalLink, MessageSquare, Clock, AlertTriangle, User } from "lucide-react";

const sources = [
  {
    name: "Slack",
    icon: Hash,
    status: "synced" as const,
    lastSync: "2 min ago",
    detail: "14 channels",
    color: "hsl(203, 97%, 29%)",
    feed: [
      { type: "thread", title: "#phoenix-eng: Load testing blocked", time: "5 min ago", author: "James K.", preview: "We still don't have the staging env provisioned. Can we escalate?", link: "#" },
      { type: "thread", title: "#api-team: Auth endpoint workaround", time: "12 min ago", author: "Sarah W.", preview: "Proposed temporary proxy solution while vendor responds", link: "#" },
      { type: "mention", title: "#general: Sprint 23 retro", time: "1 hr ago", author: "Elena R.", preview: "Great velocity this sprint! Let's keep the momentum going.", link: "#" },
      { type: "thread", title: "#design: Token review complete", time: "2 hrs ago", author: "Amira P.", preview: "All design tokens approved. Ready for final QA.", link: "#" },
      { type: "alert", title: "#auth-team: Encryption library concern", time: "3 hrs ago", author: "Leo N.", preview: "Post-mortem action items still outstanding from last week", link: "#" },
    ],
  },
  {
    name: "Jira",
    icon: TicketCheck,
    status: "synced" as const,
    lastSync: "5 min ago",
    detail: "4 boards",
    color: "hsl(211, 98%, 22%)",
    feed: [
      { type: "ticket", title: "PHX-201: Provision load test env", time: "10 min ago", author: "James K.", preview: "Status: Blocked → Priority: High", link: "#" },
      { type: "ticket", title: "API-418: Auth endpoint migration", time: "25 min ago", author: "Tom H.", preview: "Status: In Progress → Blocked by vendor docs", link: "#" },
      { type: "ticket", title: "DS-45: Design token documentation", time: "1 hr ago", author: "Amira P.", preview: "Status: In Review → Ready for QA", link: "#" },
      { type: "update", title: "Sprint 23 board updated", time: "2 hrs ago", author: "System", preview: "12 stories completed, 2 carried over", link: "#" },
    ],
  },
  {
    name: "Email",
    icon: Mail,
    status: "synced" as const,
    lastSync: "8 min ago",
    detail: "3 inboxes",
    color: "hsl(12, 78%, 52%)",
    feed: [
      { type: "email", title: "RE: Vendor SDK support ticket #8834", time: "30 min ago", author: "Vendor Support", preview: "We're investigating the auth docs issue. ETA 48 hours.", link: "#" },
      { type: "email", title: "Compliance review: Auth encryption", time: "2 hrs ago", author: "Legal Team", preview: "New GDPR requirement flagged for data-at-rest encryption", link: "#" },
      { type: "email", title: "Budget approval: Design contractor", time: "Yesterday", author: "Finance", preview: "4-week contractor engagement approved. Start date confirmed.", link: "#" },
    ],
  },
  {
    name: "Meetings",
    icon: Video,
    status: "syncing" as const,
    lastSync: "Syncing now...",
    detail: "12 transcripts",
    color: "hsl(40, 90%, 52%)",
    feed: [
      { type: "meeting", title: "Sprint 23 Review", time: "Yesterday", author: "Elena R.", preview: "Key decisions: prioritize load testing, defer OAuth. 12 stories demoed.", link: "#" },
      { type: "meeting", title: "Architecture Review Board", time: "2 days ago", author: "Marcus R.", preview: "GraphQL gateway approved. Migration plan finalized.", link: "#" },
      { type: "meeting", title: "Auth Overhaul Standup", time: "2 days ago", author: "Leo N.", preview: "Compliance blocker discussed. Legal team to provide guidance by Friday.", link: "#" },
    ],
  },
];

const statusStyles = {
  synced: "text-status-success",
  syncing: "text-status-warning",
  error: "text-status-danger",
};

const feedTypeIcons: Record<string, React.ElementType> = {
  thread: MessageSquare,
  mention: User,
  alert: AlertTriangle,
  ticket: TicketCheck,
  update: RefreshCw,
  email: Mail,
  meeting: Video,
};

export function DataSourcesBanner() {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="glass-card"
    >
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10">
            <Wifi className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Connected Sources</h3>
            <p className="text-[11px] text-muted-foreground">
              Click a source to see recent activity · Aggregating from {sources.length} platforms
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary">
          <RefreshCw className="w-3 h-3" />
          Sync all
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 pb-4">
        {sources.map((source, i) => (
          <motion.div
            key={source.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => setExpandedSource(expandedSource === source.name ? null : source.name)}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              expandedSource === source.name
                ? "bg-secondary border-accent/30 shadow-soft"
                : "bg-secondary/50 border-border/50 hover:bg-secondary/80"
            }`}
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
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expandedSource === source.name ? "rotate-180" : ""}`} />
          </motion.div>
        ))}
      </div>

      {/* Expanded source feed */}
      <AnimatePresence>
        {expandedSource && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-4 py-4">
              {sources.filter(s => s.name === expandedSource).map(source => (
                <div key={source.name}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <source.icon className="w-4 h-4 text-accent" />
                      Recent {source.name} Activity
                    </h4>
                    <button className="flex items-center gap-1 text-xs text-accent hover:underline">
                      Open in {source.name} <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {source.feed.map((item, j) => {
                      const FeedIcon = feedTypeIcons[item.type] || MessageSquare;
                      return (
                        <div
                          key={j}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
                        >
                          <div className="p-1.5 rounded bg-secondary shrink-0 mt-0.5">
                            <FeedIcon className="w-3 h-3 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                              <span className="text-[10px] text-muted-foreground shrink-0">{item.time}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{item.preview}</p>
                            <span className="text-[10px] text-muted-foreground">{item.author}</span>
                          </div>
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
