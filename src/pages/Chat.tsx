import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, ExternalLink, Bell, ChevronRight, AlertTriangle, CheckCircle2, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate } from "react-router-dom";
import agilowIcon from "@/assets/agilow-a-icon.png";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ProjectViz {
  name: string;
  slug: string;
  progress: number;
  status: "on-track" | "at-risk" | "blocked";
  completion?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { type: string; label: string }[];
  projectVisuals?: ProjectViz[];
}

// ─── Question groups ─────────────────────────────────────────────────────────
const questionGroups = [
  {
    label: "Risks & Blockers",
    questions: [
      "Which projects have critical risks right now?",
      "What's blocking the Auth Overhaul?",
      "Show me all high-severity risks this week",
    ],
  },
  {
    label: "Timelines & Progress",
    questions: [
      "Which project is furthest behind schedule?",
      "Will API Migration be done by March 3rd?",
      "Show me overall portfolio completion",
    ],
  },
  {
    label: "Scope Changes",
    questions: [
      "Why did scope increase on API Migration?",
      "Show me all decisions flagged as lessons learned",
      "What decisions changed project priorities this month?",
    ],
  },
  {
    label: "Ownership & Activity",
    questions: [
      "Which teams are blocked right now?",
      "What did Elena decide on Project Phoenix?",
      "Show me recent activity across all projects",
    ],
  },
];

// ─── Mock responses ───────────────────────────────────────────────────────────
const statusConfig = {
  "on-track": { label: "On Track", icon: CheckCircle2, chip: "text-status-success bg-status-success/10 border-status-success/20" },
  "at-risk": { label: "At Risk", icon: AlertTriangle, chip: "text-status-danger bg-status-danger/10 border-status-danger/20" },
  blocked: { label: "Blocked", icon: Clock, chip: "text-status-warning bg-status-warning/10 border-status-warning/20" },
};

const buildScheduleResponse = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: "Based on completion % relative to elapsed time, **API Migration v3** is furthest behind — 45% complete with only 8 days remaining. Here are all active projects ordered by completion:",
  sources: [
    { type: "jira", label: "Jira board" },
    { type: "slack", label: "Slack #api-team" },
    { type: "meetings", label: "Last standup" },
  ],
  projectVisuals: [
    { name: "API Migration v3", slug: "api-migration-v3", progress: 45, status: "at-risk", completion: "Mar 3" },
    { name: "Auth Overhaul", slug: "auth-overhaul", progress: 33, status: "blocked", completion: "Mar 20" },
    { name: "Project Phoenix", slug: "project-phoenix", progress: 78, status: "on-track", completion: "Mar 10" },
    { name: "Design System 2.0", slug: "design-system-2", progress: 92, status: "on-track", completion: "Feb 28" },
  ],
});

const buildRisksResponse = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: "I found **3 critical/high-severity risks** across your portfolio right now:",
  sources: [
    { type: "slack", label: "Slack #api-team" },
    { type: "jira", label: "JIRA API-415, API-418" },
    { type: "email", label: "Vendor support ticket" },
  ],
  projectVisuals: [
    { name: "API Migration v3", slug: "api-migration-v3", progress: 45, status: "at-risk" },
    { name: "Auth Overhaul", slug: "auth-overhaul", progress: 33, status: "blocked" },
    { name: "Project Phoenix", slug: "project-phoenix", progress: 78, status: "on-track" },
  ],
});

const buildDefaultResponse = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content:
    "Based on aggregated data from Slack, Jira, and recent meeting transcripts:\n\n**Project Phoenix** is on track at 78% — the last gate is load testing provisioning.\n\n**API Migration v3** is at risk — 3 teams are blocked on an auth endpoint due to outdated vendor docs.\n\nWould you like me to drill into any specific project?",
  sources: [
    { type: "slack", label: "Slack #project-phoenix" },
    { type: "jira", label: "JIRA PHX-234" },
    { type: "meetings", label: "Standup Feb 24" },
  ],
  projectVisuals: [
    { name: "Project Phoenix", slug: "project-phoenix", progress: 78, status: "on-track" },
    { name: "API Migration v3", slug: "api-migration-v3", progress: 45, status: "at-risk" },
  ],
});

function pickResponse(text: string): Message {
  const lower = text.toLowerCase();
  if (lower.includes("behind") || lower.includes("schedule") || lower.includes("furthest") || lower.includes("completion")) return buildScheduleResponse();
  if (lower.includes("risk") || lower.includes("critical") || lower.includes("block")) return buildRisksResponse();
  return buildDefaultResponse();
}

// ─── Project visual card ──────────────────────────────────────────────────────
function ProjectBar({ p, onClick }: { p: ProjectViz; onClick: () => void }) {
  const st = statusConfig[p.status];
  const Icon = st.icon;
  return (
    <div
      onClick={onClick}
      className="group p-3 rounded-xl bg-background border border-border hover:border-accent/40 hover:shadow-soft transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="flex-1 text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">{p.name}</span>
        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${st.chip}`}>
          <Icon className="w-2.5 h-2.5" />{st.label}
        </span>
        <span className="text-sm font-bold text-foreground shrink-0">{p.progress}%</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${p.progress}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-accent rounded-full"
          />
        </div>
        {p.completion && (
          <span className="text-[10px] text-muted-foreground shrink-0">Due {p.completion}</span>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm the Agilow Project Context Engine. Ask me about project status, decisions, risks, team activity — anything across your connected tools (Slack, Jira, email, meetings).\n\nWhat would you like to know?",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGroups, setShowGroups] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content }]);
    setInput("");
    setLoading(true);
    setShowGroups(false);

    setTimeout(() => {
      setMessages((prev) => [...prev, pickResponse(content)]);
      setLoading(false);
    }, 1100);
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <div className="flex-1 flex min-w-0">
        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <img src={agilowIcon} alt="" className="w-7 h-7 rounded-md bg-primary p-0.5" />
              <div>
                <h2 className="text-sm font-bold text-foreground">Ask Workspace</h2>
                <p className="text-xs text-muted-foreground">Query all project data in natural language</p>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                {msg.role === "assistant" && (
                  <img src={agilowIcon} alt="" className="w-7 h-7 rounded-md bg-primary p-0.5 mr-2 self-start mt-1 shrink-0" />
                )}
                <div className={`max-w-[80%] ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 text-sm" : ""}`}>
                  {msg.role === "assistant" ? (
                    <div className="space-y-3">
                      <div className="bg-card border border-border text-card-foreground rounded-2xl rounded-bl-md px-4 py-3 text-sm shadow-soft">
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-border/40 flex flex-wrap gap-1.5">
                            <span className="text-[10px] text-muted-foreground self-center">Based on:</span>
                            {msg.sources.map((s, i) => (
                              <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full hover:bg-secondary/80 cursor-pointer transition-colors">
                                <ExternalLink className="w-2.5 h-2.5" />{s.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Rich project visuals */}
                      {msg.projectVisuals && msg.projectVisuals.length > 0 && (
                        <div className="space-y-2 ml-1">
                          {msg.projectVisuals.map((p) => (
                            <ProjectBar key={p.slug} p={p} onClick={() => navigate(`/project/${p.slug}`)} />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <img src={agilowIcon} alt="" className="w-7 h-7 rounded-md bg-primary p-0.5 mr-2 self-start shrink-0" />
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-soft">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-3">
              <Sparkles className="w-4 h-4 text-accent shrink-0" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about projects, people, risks, decisions..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button onClick={() => send()} disabled={!input.trim() || loading}
                className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar: example questions */}
        <div className="hidden lg:flex flex-col w-72 border-l border-border p-4 gap-4 overflow-y-auto bg-background/50">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-0.5">Example Questions</h3>
            <p className="text-[11px] text-muted-foreground">Click to send</p>
          </div>
          {questionGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">{group.label}</p>
              <div className="space-y-1.5">
                {group.questions.map((q) => (
                  <button key={q} onClick={() => send(q)}
                    className="w-full text-left text-xs text-muted-foreground bg-secondary hover:bg-secondary/70 hover:text-foreground px-3 py-2 rounded-lg transition-colors flex items-center gap-2 group">
                    <span className="flex-1">{q}</span>
                    <ChevronRight className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
