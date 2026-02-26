import { motion } from "framer-motion";
import { Hash, TicketCheck, Mail, Video, Bot, Inbox, Globe, Zap, ArrowRight, Bell, Calendar, ExternalLink, MessageSquare, Clock } from "lucide-react";

const integrations = [
  {
    name: "Slack Bot",
    icon: Hash,
    description: "Get project summaries and risk alerts directly in Slack. Ask Agilow questions without leaving your workspace.",
    status: "available" as const,
    features: [
      "Daily project digest in #team channels",
      "Ask questions: /agilow status phoenix",
      "Risk alerts pushed to #alerts channel",
      "Decision logging from Slack: /agilow decide",
    ],
    cta: "Add to Slack",
    preview: {
      type: "slack" as const,
      messages: [
        { from: "Agilow Bot", time: "9:02 AM", text: "🔴 API Migration v3: 3 teams still blocked on auth endpoint (Day 4). Vendor support ticket #8834 escalated." },
        { from: "You", time: "9:03 AM", text: "/agilow status phoenix" },
        { from: "Agilow Bot", time: "9:03 AM", text: "📊 Project Phoenix: 78% complete, on track. Next milestone: Load Testing (Mar 1). Velocity trending up 15%." },
      ],
    },
  },
  {
    name: "Email Digest",
    icon: Mail,
    description: "A daily or weekly summary of all project updates, decisions, and risks delivered to your inbox.",
    status: "available" as const,
    features: [
      "Morning brief: overnight activity summary",
      "Weekly portfolio health report",
      "Instant alerts for critical risks",
      "Reply to take action or ask questions",
    ],
    cta: "Configure Digest",
    preview: {
      type: "email" as const,
      subject: "Agilow Daily Brief — Feb 26, 2026",
      items: [
        "🟢 Design System 2.0: Final QA ready (92%)",
        "🔴 API Migration v3: Vendor auth blocker (Day 4)",
        "🟡 Auth Overhaul: Compliance review pending",
        "📝 2 new decisions logged yesterday",
      ],
    },
  },
  {
    name: "Jira Sidebar",
    icon: TicketCheck,
    description: "See Agilow insights right inside your Jira tickets — related decisions, risk context, and team activity.",
    status: "coming-soon" as const,
    features: [
      "Decision context on every ticket",
      "Related Slack threads linked automatically",
      "Risk indicators on blocked tickets",
      "One-click decision logging from Jira",
    ],
    cta: "Coming Soon",
    preview: {
      type: "jira" as const,
      ticket: "API-418",
      insight: "This ticket is linked to 3 blocked downstream tickets. Vendor support ticket #8834 is pending (48hr ETA). Consider temporary auth proxy.",
    },
  },
  {
    name: "Meeting Copilot",
    icon: Video,
    description: "Automatic meeting summaries, action items, and decision extraction from Google Meet and Zoom.",
    status: "available" as const,
    features: [
      "Auto-join and transcribe meetings",
      "Extract decisions and action items",
      "Post summaries to Slack automatically",
      "Flag risks detected in meeting tone",
    ],
    cta: "Connect Calendar",
    preview: {
      type: "meeting" as const,
      title: "Sprint 23 Review — Yesterday",
      items: [
        "✅ Decision: Prioritize load testing over OAuth",
        "⚠️ Risk: Sentiment dip detected (frustration keywords up 40%)",
        "📋 3 action items assigned",
      ],
    },
  },
];

const statusBadge = {
  "available": "bg-status-success/10 text-status-success",
  "coming-soon": "bg-secondary text-muted-foreground",
};

export function WorkflowIntegrations() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-semibold text-foreground">Workflow Integrations</h3>
          <p className="text-xs text-muted-foreground">Agilow meets you where you work — no context switching needed</p>
        </div>
      </div>

      {/* How it fits diagram */}
      <div className="my-5 p-4 rounded-xl bg-secondary/30 border border-border/50">
        <p className="text-xs font-semibold text-foreground mb-3 text-center">How Agilow fits your workflow</p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[
            { icon: Hash, label: "Slack", color: "bg-accent/10 text-accent" },
            { icon: TicketCheck, label: "Jira", color: "bg-primary/10 text-primary" },
            { icon: Mail, label: "Email", color: "bg-destructive/10 text-agilow-coral" },
            { icon: Video, label: "Meetings", color: "bg-status-warning/10 text-status-warning" },
          ].map((tool, i) => (
            <div key={tool.label} className="flex items-center gap-2">
              {i > 0 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${tool.color}`}>
                <tool.icon className="w-3.5 h-3.5" />
                {tool.label}
              </div>
            </div>
          ))}
          <ArrowRight className="w-3 h-3 text-muted-foreground" />
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-soft">
            <Zap className="w-3.5 h-3.5" />
            Agilow
          </div>
          <ArrowRight className="w-3 h-3 text-muted-foreground" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-status-success/10 text-status-success text-xs font-medium">
            <Globe className="w-3.5 h-3.5" />
            Decisions
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          You stay in your tools. Agilow aggregates, analyzes, and pushes insights back.
        </p>
      </div>

      {/* Integration cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {integrations.map((integration, i) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + i * 0.05 }}
            className="p-4 rounded-xl border border-border/50 bg-card hover:shadow-soft transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <integration.icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{integration.name}</h4>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${statusBadge[integration.status]}`}>
                    {integration.status === "available" ? "Available" : "Coming Soon"}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{integration.description}</p>

            {/* Features */}
            <div className="space-y-1 mb-3">
              {integration.features.map((f, j) => (
                <p key={j} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                  <span className="text-accent mt-0.5">•</span>
                  {f}
                </p>
              ))}
            </div>

            {/* Preview */}
            <div className="rounded-lg bg-secondary/50 border border-border/30 p-3 mb-3">
              {integration.preview.type === "slack" && (
                <div className="space-y-2">
                  <p className="text-[10px] font-medium text-muted-foreground mb-1">Preview</p>
                  {integration.preview.messages?.map((m, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <div className={`w-5 h-5 rounded shrink-0 flex items-center justify-center text-[9px] font-bold ${
                        m.from === "Agilow Bot" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                      }`}>
                        {m.from === "Agilow Bot" ? "A" : "Y"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold text-foreground">{m.from}</span>
                          <span className="text-[9px] text-muted-foreground">{m.time}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{m.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {integration.preview.type === "email" && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-1">Preview</p>
                  <p className="text-[11px] font-semibold text-foreground mb-1.5">{integration.preview.subject}</p>
                  {integration.preview.items?.map((item, j) => (
                    <p key={j} className="text-[11px] text-muted-foreground">{item}</p>
                  ))}
                </div>
              )}
              {integration.preview.type === "jira" && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-1">Agilow Insight on {integration.preview.ticket}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{integration.preview.insight}</p>
                </div>
              )}
              {integration.preview.type === "meeting" && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-1">{integration.preview.title}</p>
                  {integration.preview.items?.map((item, j) => (
                    <p key={j} className="text-[11px] text-muted-foreground">{item}</p>
                  ))}
                </div>
              )}
            </div>

            <button
              disabled={integration.status === "coming-soon"}
              className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-opacity ${
                integration.status === "available"
                  ? "bg-accent text-accent-foreground hover:opacity-90"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              }`}
            >
              {integration.cta}
              {integration.status === "available" && <ArrowRight className="w-3 h-3" />}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
