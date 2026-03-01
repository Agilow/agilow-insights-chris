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

// Q: Which projects have critical risks?
const buildCriticalRisksResponse = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: "There is 1 critical and 2 high-severity risks active right now across your portfolio.\n\nCritical: API Migration v3 — the auth endpoint is blocking 3 downstream teams. If unresolved by Friday, you're looking at a 12–15 person-day delay. A temporary auth proxy or emergency vendor sync is the recommended next step.\n\nHigh (1): Project Phoenix — negative sentiment in Slack is up 40% over the past 3 days, likely tied to the load testing environment still not being provisioned. Risk of a 2–3 day slip.\n\nHigh (2): Auth Overhaul — the SSO provider is pushing API changes in March. If the migration guide isn't received before the cutover, the team may need to rework the full SSO layer.",
  sources: [
    { type: "slack", label: "Slack #api-team" },
    { type: "jira", label: "JIRA API-415, API-418" },
    { type: "email", label: "Vendor support ticket" },
    { type: "meetings", label: "Phoenix standup" },
  ],
  projectVisuals: [
    { name: "API Migration v3", slug: "api-migration-v3", progress: 45, status: "at-risk" },
    { name: "Auth Overhaul", slug: "auth-overhaul", progress: 33, status: "blocked" },
    { name: "Project Phoenix", slug: "project-phoenix", progress: 78, status: "on-track" },
  ],
});

// Q: What's blocking Auth Overhaul?
const buildAuthBlockersResponse = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: "Auth Overhaul (33% complete, due Mar 20) is blocked on two fronts.\n\nFirst, the SSO provider announced API changes scheduled for March. The team hasn't received a migration guide yet, so there's no clarity on whether the current implementation will need to be partially or fully reworked. This was flagged via email 4 days ago.\n\nSecond, a new GDPR compliance requirement surfaced yesterday. Legal flagged that the current encryption approach may need to change, potentially adding 3–5 days to the timeline. A 30-minute review with Legal is the recommended next step.\n\nOwner James K. and a team of 5 are on this. The SSO blocker is the higher-priority one to resolve first.",
  sources: [
    { type: "email", label: "SSO vendor email" },
    { type: "slack", label: "Slack #auth-overhaul" },
    { type: "jira", label: "AUTH-88, AUTH-91" },
  ],
  projectVisuals: [
    { name: "Auth Overhaul", slug: "auth-overhaul", progress: 33, status: "blocked" },
  ],
});

// Q: Will API Migration be done by March 3rd?
const buildApiDeadlineResponse = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: "Based on current data, API Migration v3 meeting the March 3rd deadline is at serious risk.\n\nThe project is 45% complete with 8 days remaining. To hit the deadline, the team needs to sustain roughly 7% progress per day — but the auth endpoint blocker is currently halting 3 downstream teams and no resolution has been confirmed.\n\nOn top of that, the client SDK deadline conflicts with the planned testing window, shrinking it from 5 days to 2. That's not enough buffer for a migration of this scope.\n\nRealistic scenarios: if the auth blocker is resolved in the next 48 hours and the SDK deadline is negotiated, a March 5–7 delivery is plausible. Without action, expect mid-to-late March.\n\nOwner David P. should escalate the vendor issue today.",
  sources: [
    { type: "jira", label: "JIRA API-415" },
    { type: "slack", label: "Slack #api-team" },
    { type: "email", label: "Client SDK thread" },
  ],
  projectVisuals: [
    { name: "API Migration v3", slug: "api-migration-v3", progress: 45, status: "at-risk", completion: "Mar 3" },
  ],
});

// Q: Show all high-severity risks
const buildAllHighRisksResponse = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: "Here are all critical and high-severity risks detected this week across your portfolio:\n\nCritical — API Migration v3: Auth endpoint blocking 3 teams. Estimated 12–15 person-day delay if not resolved by Friday.\n\nHigh — Project Phoenix: Negative Slack sentiment up 40%. Load testing environment still unprovisioned. Possible 2–3 day slip on the Mar 10 deadline.\n\nHigh — Auth Overhaul: SSO provider API changes in March. No migration guide received yet. Full rework risk if not addressed before cutover.\n\nMedium risks exist on API Migration (SDK conflict) and Auth Overhaul (GDPR). Want me to surface those too?",
  sources: [
    { type: "slack", label: "Slack #api-team, #project-phoenix" },
    { type: "jira", label: "JIRA API-415, API-418, AUTH-88" },
    { type: "email", label: "Vendor + GDPR threads" },
  ],
  projectVisuals: [
    { name: "API Migration v3", slug: "api-migration-v3", progress: 45, status: "at-risk" },
    { name: "Auth Overhaul", slug: "auth-overhaul", progress: 33, status: "blocked" },
    { name: "Project Phoenix", slug: "project-phoenix", progress: 78, status: "on-track" },
  ],
});

// Q: Which project is furthest behind?
const buildBehindScheduleResponse = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: "Data Pipeline Refactor is furthest behind relative to its timeline. It's only 28% complete with the deadline on Mar 28 — that's roughly half the work left in less than 4 weeks, with a team of 3 and activity that's gone quiet for 3 days. Owner Raj M. has not posted any recent updates.\n\nAPI Migration v3 is the most urgent though — 45% complete with only 8 days left and an active blocker.\n\nHere's the full picture ordered by schedule risk:",
  sources: [
    { type: "jira", label: "Jira board" },
    { type: "slack", label: "Slack #data-pipeline" },
  ],
  projectVisuals: [
    { name: "API Migration v3", slug: "api-migration-v3", progress: 45, status: "at-risk", completion: "Mar 3" },
    { name: "Auth Overhaul", slug: "auth-overhaul", progress: 33, status: "blocked", completion: "Mar 20" },
    { name: "Data Pipeline Refactor", slug: "data-pipeline-refactor", progress: 28, status: "at-risk", completion: "Mar 28" },
    { name: "Mobile App v2", slug: "mobile-app-v2", progress: 61, status: "on-track", completion: "Apr 5" },
    { name: "Project Phoenix", slug: "project-phoenix", progress: 78, status: "on-track", completion: "Mar 10" },
    { name: "Design System 2.0", slug: "design-system-2", progress: 92, status: "on-track", completion: "Feb 28" },
  ],
});

// Q: Show portfolio completion
const buildPortfolioResponse = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: "Here is a full snapshot of your portfolio today:\n\nDesign System 2.0 is nearly done at 92% — due Feb 28, on track. Project Phoenix is at 78%, on track for Mar 10. Mobile App v2 is at 61%, healthy with some runway until Apr 5.\n\nOn the at-risk side: API Migration v3 is at 45% with only 8 days to deadline and an active blocker. Data Pipeline Refactor is at 28% and has gone quiet — 3 days without activity.\n\nAuth Overhaul is blocked at 33%, due Mar 20. Two open blockers: SSO API changes and a GDPR flag.\n\nOverall portfolio average: 56% complete. 3 of 6 projects need attention this week.",
  sources: [
    { type: "jira", label: "Jira board" },
    { type: "slack", label: "All project channels" },
  ],
  projectVisuals: [
    { name: "Design System 2.0", slug: "design-system-2", progress: 92, status: "on-track", completion: "Feb 28" },
    { name: "Project Phoenix", slug: "project-phoenix", progress: 78, status: "on-track", completion: "Mar 10" },
    { name: "Mobile App v2", slug: "mobile-app-v2", progress: 61, status: "on-track", completion: "Apr 5" },
    { name: "API Migration v3", slug: "api-migration-v3", progress: 45, status: "at-risk", completion: "Mar 3" },
    { name: "Data Pipeline Refactor", slug: "data-pipeline-refactor", progress: 28, status: "at-risk", completion: "Mar 28" },
    { name: "Auth Overhaul", slug: "auth-overhaul", progress: 33, status: "blocked", completion: "Mar 20" },
  ],
});

// Q: Why did scope increase on API Migration?
const buildScopeChangeResponse = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: "Scope on API Migration v3 expanded twice in the past two weeks.\n\nFirst, the client requested backward compatibility with their legacy SDK — that wasn't in the original spec. It added an estimated 4 days of work and was logged as a scope change decision in Jira by David P.\n\nSecond, the auth endpoint failure exposed a dependency on an undocumented internal service. Resolving that requires a parallel refactor that wasn't planned. This is the current blocker and represents roughly 6–8 additional days if the vendor doesn't provide a fix.\n\nBoth changes together pushed the realistic completion date from late February to early-to-mid March.",
  sources: [
    { type: "jira", label: "JIRA API-389, API-415" },
    { type: "slack", label: "Slack #api-team" },
    { type: "email", label: "Client SDK request" },
  ],
  projectVisuals: [
    { name: "API Migration v3", slug: "api-migration-v3", progress: 45, status: "at-risk", completion: "Mar 3" },
  ],
});

// Q: Which teams are blocked?
const buildBlockedTeamsResponse = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: "Two teams are currently blocked.\n\nThe Auth Overhaul team (5 people, owner James K.) has two open blockers: the SSO provider's upcoming API changes and a new GDPR compliance flag from Legal. Neither has a confirmed resolution path yet.\n\nThree downstream teams on API Migration v3 are also blocked by the auth endpoint failure. This is the highest-urgency item in the portfolio — the longer it stays unresolved, the more the 12–15 person-day delay estimate grows.\n\nData Pipeline Refactor isn't formally blocked but has had zero activity for 3 days, which is a soft flag worth checking.",
  sources: [
    { type: "slack", label: "Slack #api-team, #auth-overhaul" },
    { type: "jira", label: "AUTH-88, API-415" },
    { type: "email", label: "GDPR flag from Legal" },
  ],
  projectVisuals: [
    { name: "Auth Overhaul", slug: "auth-overhaul", progress: 33, status: "blocked" },
    { name: "API Migration v3", slug: "api-migration-v3", progress: 45, status: "at-risk" },
    { name: "Data Pipeline Refactor", slug: "data-pipeline-refactor", progress: 28, status: "at-risk" },
  ],
});

// Q: What did Elena decide on Project Phoenix?
const buildElenaDecisionsResponse = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: "Elena R. made two notable decisions on Project Phoenix in the past two weeks.\n\nShe approved moving the load testing phase to run in parallel with final feature development, accepting the risk of overlap in order to protect the Mar 10 deadline. This was logged in the Feb 24 standup and confirmed in Jira.\n\nShe also approved the DevOps team provisioning a dedicated staging cluster for performance testing after the existing shared environment produced unreliable results. That provisioning is still pending — it's the open low-severity risk flagged 5 days ago.\n\nProject Phoenix is currently the healthiest at-scale project at 78%, but the load testing gap is the one thing between here and a clean delivery.",
  sources: [
    { type: "meetings", label: "Standup Feb 24" },
    { type: "jira", label: "PHX-234, PHX-241" },
    { type: "slack", label: "Slack #project-phoenix" },
  ],
  projectVisuals: [
    { name: "Project Phoenix", slug: "project-phoenix", progress: 78, status: "on-track", completion: "Mar 10" },
  ],
});

// Q: Show recent activity / default
const buildDefaultResponse = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: "Based on aggregated data from Slack, Jira, and recent meeting transcripts:\n\nProject Phoenix is on track at 78% — the last gate is load testing provisioning, due by end of this week per Elena's decision in last standup.\n\nAPI Migration v3 is at risk — 3 teams are blocked on an auth endpoint due to outdated vendor docs. David P. needs to escalate today to protect the Mar 3 deadline.\n\nDesign System 2.0 is nearly done at 92% and should wrap by Feb 28.\n\nWould you like me to drill into any specific project or risk?",
  sources: [
    { type: "slack", label: "Slack #project-phoenix" },
    { type: "jira", label: "JIRA PHX-234" },
    { type: "meetings", label: "Standup Feb 24" },
  ],
  projectVisuals: [
    { name: "Project Phoenix", slug: "project-phoenix", progress: 78, status: "on-track" },
    { name: "API Migration v3", slug: "api-migration-v3", progress: 45, status: "at-risk" },
    { name: "Design System 2.0", slug: "design-system-2", progress: 92, status: "on-track" },
  ],
});

function pickResponse(text: string): Message {
  const lower = text.toLowerCase();
  if (lower.includes("what's blocking") || lower.includes("blocking auth") || lower.includes("auth overhaul")) return buildAuthBlockersResponse();
  if (lower.includes("march 3") || lower.includes("done by") || lower.includes("api migration be done")) return buildApiDeadlineResponse();
  if (lower.includes("all high") || lower.includes("high-severity") || lower.includes("this week") && lower.includes("risk")) return buildAllHighRisksResponse();
  if (lower.includes("critical") || (lower.includes("risk") && lower.includes("critical"))) return buildCriticalRisksResponse();
  if (lower.includes("risk") || lower.includes("block")) return buildCriticalRisksResponse();
  if (lower.includes("furthest") || lower.includes("furthest behind") || lower.includes("behind schedule")) return buildBehindScheduleResponse();
  if (lower.includes("portfolio") || lower.includes("overall") || lower.includes("completion") || lower.includes("all project")) return buildPortfolioResponse();
  if (lower.includes("schedule") || lower.includes("behind") || lower.includes("furthest")) return buildBehindScheduleResponse();
  if (lower.includes("scope") || lower.includes("scope increase") || lower.includes("scope change")) return buildScopeChangeResponse();
  if (lower.includes("lessons learned") || lower.includes("decisions") || lower.includes("flagged")) return buildScopeChangeResponse();
  if (lower.includes("blocked") || lower.includes("teams are blocked") || lower.includes("which team")) return buildBlockedTeamsResponse();
  if (lower.includes("elena") || lower.includes("phoenix") && lower.includes("decide")) return buildElenaDecisionsResponse();
  if (lower.includes("recent activity") || lower.includes("activity")) return buildDefaultResponse();
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
