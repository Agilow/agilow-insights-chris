import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, Hash, TicketCheck, Mail, Video, Mic,
  FileText, ExternalLink, Tag, CheckCircle2, AlertTriangle, Clock,
  MessageSquare, RefreshCw, User, Filter
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";

type SourceType = "all" | "jira" | "confluence" | "slack" | "email" | "transcript";

interface SourceItem {
  id: string;
  type: SourceType;
  title: string;
  date: string;
  project: string;
  snippet: string;
  tags: string[];
  fullSnippet: string;
  influence: string;
  influenceTags: string[];
  confidence: "High" | "Medium" | "Low";
}

const sourceTypeConfig: Record<Exclude<SourceType, "all">, { icon: React.ElementType; label: string }> = {
  jira: { icon: TicketCheck, label: "Jira" },
  confluence: { icon: FileText, label: "Confluence" },
  slack: { icon: MessageSquare, label: "Slack" },
  email: { icon: Mail, label: "Email" },
  transcript: { icon: Mic, label: "Transcript" },
};

const filters: { key: SourceType; label: string; icon?: React.ElementType }[] = [
  { key: "all", label: "All Sources" },
  { key: "jira", label: "Jira", icon: TicketCheck },
  { key: "confluence", label: "Confluence", icon: FileText },
  { key: "slack", label: "Slack", icon: MessageSquare },
  { key: "email", label: "Email", icon: Mail },
  { key: "transcript", label: "Transcript", icon: Mic },
];

const mockSources: SourceItem[] = [
  {
    id: "1",
    type: "confluence",
    title: "Architecture Decision Record: Phoenix Security",
    date: "Feb 12, 2026",
    project: "Phoenix",
    snippet: '"Added SOC2 compliance requirements to Phase 1."',
    tags: ["Size"],
    fullSnippet: "Based on the recent enterprise deal, we must include SOC2 compliance requirements in Phase 1. This adds approximately 2 sprints of effort to the original estimate. The security team has provided a checklist of 14 items that need to be addressed before the March deadline.",
    influence: "This source was used to adjust the size metrics for Phoenix. The compliance requirements directly impacted the effort estimation and timeline projections.",
    influenceTags: ["Phoenix", "Size"],
    confidence: "High",
  },
  {
    id: "2",
    type: "jira",
    title: "Epic-124: Phoenix Core API",
    date: "Feb 01, 2026",
    project: "Phoenix",
    snippet: '"Velocity stable at 45 pts/sprint for the last 3 sprints."',
    tags: ["Status"],
    fullSnippet: "The Phoenix Core API epic has maintained a stable velocity of 45 story points per sprint over the last 3 sprints. Current burn-down shows we're on track for the March 10 production deploy. 12 of 18 stories completed, 4 in progress, 2 in backlog.",
    influence: "Velocity data from this epic was used to project completion dates and assess on-track status for the Phoenix project. Stable velocity contributed to the 'On Track' classification.",
    influenceTags: ["Phoenix", "Status"],
    confidence: "High",
  },
  {
    id: "3",
    type: "slack",
    title: "#eng-phoenix",
    date: "Feb 15, 2026",
    project: "Phoenix",
    snippet: '"@dev: Third-party API limits might throttle our load tests."',
    tags: ["Status"],
    fullSnippet: "@dev: Third-party API limits might throttle our load tests. We're hitting 80% of the rate limit during staging tests. If we don't get an enterprise tier bump before March 1, load testing will be incomplete. @James K. can you escalate with the vendor?",
    influence: "This thread surfaced a potential risk to the load testing milestone. It was flagged as a medium-severity risk and contributed to the risk assessment for Project Phoenix.",
    influenceTags: ["Phoenix", "Risk"],
    confidence: "Medium",
  },
  {
    id: "4",
    type: "slack",
    title: "#proj-atlas-alerts",
    date: "Feb 18, 2026",
    project: "API Migration",
    snippet: '"3 critical path tickets reopened by QA."',
    tags: ["Status"],
    fullSnippet: "Alert: 3 critical path tickets (API-412, API-415, API-418) were reopened by QA after regression testing. The auth endpoint changes introduced breaking changes in the downstream client SDK. This blocks the Client SDK Update milestone.",
    influence: "This alert directly impacted the at-risk classification for API Migration v3. Reopened critical tickets signaled regression issues and contributed to the downward velocity trend.",
    influenceTags: ["API Migration", "Status"],
    confidence: "High",
  },
  {
    id: "5",
    type: "email",
    title: "Re: Q3 Planning Feedback",
    date: "Feb 20, 2026",
    project: "API Migration",
    snippet: '"Stakeholder review requested before endpoint freeze."',
    tags: ["Size"],
    fullSnippet: "Hi team, before we freeze the endpoint migration list, the VP of Engineering has requested a stakeholder review session. This may add 2-3 days to the timeline but ensures alignment across all downstream teams. Please prepare your migration status reports by Friday.",
    influence: "This email was used to identify a potential timeline risk for the API Migration project. The stakeholder review requirement may push the endpoint migration milestone.",
    influenceTags: ["API Migration", "Size"],
    confidence: "Medium",
  },
  {
    id: "6",
    type: "transcript",
    title: "Sprint 23 Review — Phoenix Team",
    date: "Feb 22, 2026",
    project: "Phoenix",
    snippet: '"Decision: Postpone OAuth to Phase 2 to avoid 2-week delay."',
    tags: ["Decision"],
    fullSnippet: "Meeting transcript excerpt: Elena R. proposed postponing the OAuth integration to Phase 2 to avoid a 2-week delay on vendor integration. The team voted unanimously in favor. James K. noted this would allow the team to focus on load testing. Action item: Update JIRA PHX-189 and notify downstream teams.",
    influence: "This meeting transcript was the primary source for logging the decision to postpone OAuth. It provided rationale, context, and team consensus that informed the decision record.",
    influenceTags: ["Phoenix", "Decision"],
    confidence: "High",
  },
  {
    id: "7",
    type: "email",
    title: "Compliance Review: Auth Encryption",
    date: "Feb 19, 2026",
    project: "Auth Overhaul",
    snippet: '"New GDPR requirement flagged for data-at-rest encryption."',
    tags: ["Risk"],
    fullSnippet: "From Legal Team: A new GDPR data-at-rest encryption requirement has been identified that affects the Auth Overhaul project. The current custom encryption library may not meet the updated standards. We recommend evaluating certified alternatives before proceeding with the MFA implementation phase.",
    influence: "This email directly contributed to a medium-severity risk being logged against the Auth Overhaul project. It also influenced the 'blocked' status assessment due to compliance uncertainty.",
    influenceTags: ["Auth Overhaul", "Risk"],
    confidence: "High",
  },
  {
    id: "8",
    type: "jira",
    title: "API-418: Auth Endpoint Migration",
    date: "Feb 25, 2026",
    project: "API Migration",
    snippet: '"Status changed: In Progress → Blocked. Vendor docs outdated."',
    tags: ["Status", "Risk"],
    fullSnippet: "Ticket API-418 was moved to Blocked status. The vendor authentication library documentation is outdated and doesn't cover the new GraphQL gateway patterns. Three team members have reported being blocked. A support ticket (#8834) has been filed with the vendor. ETA for response: 48 hours.",
    influence: "This ticket was the primary evidence for the high-severity risk '3 teams blocked on auth endpoint' in the API Migration project. It directly influenced the at-risk project status.",
    influenceTags: ["API Migration", "Risk", "Status"],
    confidence: "High",
  },
  {
    id: "9",
    type: "confluence",
    title: "Design Token Specification v2",
    date: "Feb 14, 2026",
    project: "Design System",
    snippet: '"All 142 tokens audited and mapped to component library."',
    tags: ["Status"],
    fullSnippet: "The design token audit is complete. 142 tokens have been audited and mapped across the component library. 12 tokens were deprecated, 8 new semantic tokens were introduced. The contractor engagement has been highly effective — all deliverables are on track for the Feb 26 documentation deadline.",
    influence: "This specification page was used to assess the 92% progress for Design System 2.0. The completed audit contributed to the on-track classification.",
    influenceTags: ["Design System", "Status"],
    confidence: "High",
  },
  {
    id: "10",
    type: "transcript",
    title: "Auth Overhaul Standup — Week 7",
    date: "Feb 24, 2026",
    project: "Auth Overhaul",
    snippet: '"SSO provider notified us of breaking API changes in March."',
    tags: ["Risk"],
    fullSnippet: "Standup notes: The SSO provider sent a notification email about breaking API changes scheduled for March 15. This directly conflicts with our SSO Integration milestone. The team discussed options: (1) accelerate SSO work before March 15, (2) wait for the new API and adjust timeline. No decision made — escalated to PM.",
    influence: "This standup transcript was the source for the high-severity risk about SSO provider API changes in the Auth Overhaul project. It also contributed to the 'flat' velocity trend assessment.",
    influenceTags: ["Auth Overhaul", "Risk"],
    confidence: "Medium",
  },
];

const confidenceColors = {
  High: "text-status-success",
  Medium: "text-status-warning",
  Low: "text-status-danger",
};

const SourceExplorer = () => {
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get("source") as SourceType) || "all";
  const projectFilter = searchParams.get("project") || null;

  const [activeFilter, setActiveFilter] = useState<SourceType>(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<SourceItem | null>(null);

  const filtered = mockSources.filter((item) => {
    const matchesType = activeFilter === "all" || item.type === activeFilter;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject =
      !projectFilter || item.project.toLowerCase().replace(/\s+/g, "-") === projectFilter;
    return matchesType && matchesSearch && matchesProject;
  });

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 max-w-[1400px]">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Source Explorer</h1>
              {projectFilter && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                  {projectFilter.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Browse the raw evidence Agilow uses to generate insights, risks, and decisions.
            </p>
          </motion.div>

          <div className="flex gap-6">
            {/* Left: list */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search citations, snippets, or titles..."
                  className="h-10 w-full rounded-lg bg-card border border-border pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30 transition"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {filters.map((f) => {
                  const isActive = activeFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      onClick={() => setActiveFilter(f.key)}
                      className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:bg-secondary"
                      }`}
                    >
                      {f.icon && <f.icon className="w-3.5 h-3.5" />}
                      {f.label}
                    </button>
                  );
                })}
              </div>

              {/* Source list */}
              <div className="space-y-2">
                {filtered.map((item) => {
                  const config = sourceTypeConfig[item.type as Exclude<SourceType, "all">];
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelectedItem(item)}
                      className={`glass-card p-4 cursor-pointer transition-all ${
                        isSelected
                          ? "ring-2 ring-accent/40 shadow-card"
                          : "hover:shadow-soft"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-secondary shrink-0 mt-0.5">
                          {config && <config.icon className="w-4 h-4 text-accent" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-semibold text-foreground truncate">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {item.date} · Project: {item.project}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1.5 italic">
                            {item.snippet}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No sources match your filters.
                  </div>
                )}
              </div>
            </div>

            {/* Right: detail panel */}
            <AnimatePresence mode="wait">
              {selectedItem ? (
                <motion.div
                  key={selectedItem.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  className="hidden lg:block w-[380px] shrink-0"
                >
                  <div className="glass-card p-5 sticky top-24 space-y-5">
                    {/* Source header */}
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        {(() => {
                          const config = sourceTypeConfig[selectedItem.type as Exclude<SourceType, "all">];
                          return config ? (
                            <>
                              <config.icon className="w-3.5 h-3.5" />
                              <span>{config.label}</span>
                            </>
                          ) : null;
                        })()}
                        <span>·</span>
                        <span>{selectedItem.date}</span>
                      </div>
                      <h2 className="text-lg font-bold text-foreground leading-snug">
                        {selectedItem.title}
                      </h2>
                    </div>

                    {/* Open original */}
                    <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-foreground border border-border rounded-lg px-4 py-2.5 hover:bg-secondary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      Open Original Source
                    </button>

                    {/* Full snippet */}
                    <div>
                      <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Full Extracted Snippet
                      </h3>
                      <div className="bg-secondary/50 rounded-lg p-4">
                        <p className="text-sm text-foreground leading-relaxed italic">
                          "{selectedItem.fullSnippet}"
                        </p>
                      </div>
                    </div>

                    {/* How it influenced the model */}
                    <div>
                      <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        How It Influenced the Model
                      </h3>
                      <div className="bg-accent/5 border border-accent/10 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs font-medium text-muted-foreground">Applied to:</span>
                          {selectedItem.influenceTags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary text-primary-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-accent leading-relaxed">
                          {selectedItem.influence}
                        </p>
                        <p className="text-xs mt-2">
                          The confidence level is rated as{" "}
                          <span className={`font-bold ${confidenceColors[selectedItem.confidence]}`}>
                            {selectedItem.confidence}
                          </span>{" "}
                          based on the source type and recency.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="hidden lg:flex w-[380px] shrink-0 items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Select a source</p>
                    <p className="text-xs mt-1">Click any item to see the full evidence and how it influenced Agilow's analysis.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SourceExplorer;
