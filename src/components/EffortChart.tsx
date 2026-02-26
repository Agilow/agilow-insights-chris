import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { motion } from "framer-motion";
import { Info, Lightbulb, Hash, TicketCheck, Video } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const data = [
  {
    name: "Feature Work",
    value: 42,
    color: "hsl(211, 98%, 22%)",
    provenance: "Cross-referenced active Jira tickets tagged 'feature' with related Slack threads and meeting transcripts.",
    takeaway: "Feature velocity is healthy — 42% of effort is value-creating work.",
  },
  {
    name: "Bug Fixes",
    value: 18,
    color: "hsl(12, 78%, 52%)",
    provenance: "Counted Jira tickets labeled 'bug' opened this sprint, plus Slack #bugs channel mentions.",
    takeaway: "Bug rate up 5% from last week — driven by API Migration regressions.",
  },
  {
    name: "Tech Debt",
    value: 22,
    color: "hsl(203, 97%, 29%)",
    provenance: "Jira 'tech-debt' label + Slack threads mentioning refactoring, cleanup, or migration work.",
    takeaway: "Tech debt is high at 22% — Auth Overhaul accounts for most of this.",
  },
  {
    name: "Meetings",
    value: 10,
    color: "hsl(40, 90%, 52%)",
    provenance: "Calendar events with 2+ attendees, cross-referenced with meeting transcript data.",
    takeaway: "Meeting load is healthy at 10% — down from 15% last month.",
  },
  {
    name: "Code Review",
    value: 8,
    color: "hsl(152, 60%, 42%)",
    provenance: "Jira status transitions to 'In Review' + Slack code-review channel activity.",
    takeaway: "Review throughput is stable. Average review cycle: 4.2 hours.",
  },
];

const keyTakeaways = [
  { text: "Feature work is the top category at 42%, indicating healthy value delivery.", type: "positive" as const },
  { text: "Bug fixes + tech debt combined = 40% — consider allocating a dedicated sprint.", type: "warning" as const },
  { text: "Meeting time dropped 5pp vs. last month after standup optimization.", type: "positive" as const },
];

export function EffortChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-foreground">Effort Distribution</h3>
        <Tooltip>
          <TooltipTrigger>
            <div className="p-1 rounded hover:bg-secondary transition-colors cursor-help">
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-[280px]">
            <p className="text-xs font-medium mb-1">How is this calculated?</p>
            <p className="text-xs text-muted-foreground">Effort is estimated by cross-referencing Jira ticket activity, Slack thread volume, meeting transcripts, and email threads per category. Updated in real time via MCP aggregation.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-xs text-muted-foreground mb-4">This week's team activity breakdown</p>

      <div className="flex items-center gap-6">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <RTooltip
                contentStyle={{
                  background: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(214, 25%, 90%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm group">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-foreground">{item.name}</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[260px]">
                    <p className="text-xs font-medium mb-1">Data Source</p>
                    <p className="text-[11px] text-muted-foreground">{item.provenance}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="font-medium text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 mb-2">
          <Lightbulb className="w-4 h-4 text-status-warning" />
          <h4 className="text-xs font-semibold text-foreground">Key Takeaways</h4>
        </div>
        <div className="space-y-1.5">
          {keyTakeaways.map((t, i) => (
            <div key={i} className={`flex items-start gap-2 text-xs px-2 py-1.5 rounded-md ${t.type === "positive" ? "bg-status-success/5 text-foreground" : "bg-status-warning/5 text-foreground"}`}>
              <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${t.type === "positive" ? "bg-status-success" : "bg-status-warning"}`} />
              <span>{t.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Source footnote */}
      <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> Slack</span>
        <span className="flex items-center gap-1"><TicketCheck className="w-3 h-3" /> Jira</span>
        <span className="flex items-center gap-1"><Video className="w-3 h-3" /> Meetings</span>
        <span className="ml-auto">Updated 2 min ago</span>
      </div>
    </motion.div>
  );
}
