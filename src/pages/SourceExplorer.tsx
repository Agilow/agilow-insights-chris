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
  {
    id: "11",
    type: "slack",
    title: "#mobile-v2-dev",
    date: "Feb 21, 2026",
    project: "Mobile App v2",
    snippet: '"Offline sync prototype passed all edge-case tests on Android."',
    tags: ["Status"],
    fullSnippet: "@jade.kim: The offline sync prototype passed all 23 edge-case tests on Android. iOS results pending — expected by EOD Thursday. The conflict resolution strategy (last-write-wins with merge UI) is working well. Only 1 minor issue: sync resumes slowly on 3G. @mobile-team please prioritize the iOS run.",
    influence: "This Slack thread was used to validate the offline sync milestone for Mobile App v2. Passing edge-case tests contributed to the project's on-track classification and positive velocity trend.",
    influenceTags: ["Mobile App v2", "Status"],
    confidence: "High",
  },
  {
    id: "12",
    type: "jira",
    title: "MOB-287: Push Notification Service",
    date: "Feb 23, 2026",
    project: "Mobile App v2",
    snippet: '"Firebase Cloud Messaging integration complete. APNs in progress."',
    tags: ["Status"],
    fullSnippet: "Firebase Cloud Messaging (FCM) integration is complete and tested on Android. APNs integration for iOS is in progress — estimated 3 days remaining. Token management and notification routing are implemented. Remaining work: notification grouping, silent push for background sync, and deep-link handling.",
    influence: "This Jira ticket informed the progress calculation for the Push Notifications milestone in Mobile App v2. FCM completion contributed to the 61% overall progress figure.",
    influenceTags: ["Mobile App v2", "Status"],
    confidence: "High",
  },
  {
    id: "13",
    type: "email",
    title: "Re: Accessibility Audit Deferral",
    date: "Feb 20, 2026",
    project: "Mobile App v2",
    snippet: '"Audit pushed to post-launch — risk accepted by product lead."',
    tags: ["Risk", "Decision"],
    fullSnippet: "Hi Jade, after discussing with the product lead, we've agreed to defer the accessibility audit to post-launch. The rationale is that the April 2 deadline doesn't allow sufficient time for both the audit and the push notification feature. Risk accepted: potential remediation costs post-launch. Please log this decision in Agilow.",
    influence: "This email was the source for the minor risk logged against Mobile App v2 regarding accessibility. It also contributed a logged decision about audit deferral with explicit risk acceptance.",
    influenceTags: ["Mobile App v2", "Risk", "Decision"],
    confidence: "High",
  },
  {
    id: "14",
    type: "transcript",
    title: "Mobile v2 Sprint Planning — Sprint 11",
    date: "Feb 19, 2026",
    project: "Mobile App v2",
    snippet: '"Team agreed: prioritize push notifications over dark mode."',
    tags: ["Decision"],
    fullSnippet: "Sprint 11 planning transcript: The team debated whether to prioritize push notifications or dark mode theming. Jade Kim presented data showing 73% of beta users requested push notifications vs. 28% for dark mode. Decision: Push notifications are critical path for launch; dark mode deferred to v2.1. Unanimous agreement.",
    influence: "This meeting transcript provided the rationale for the push notification prioritization decision. User data (73% vs 28%) was extracted and used to justify the sprint goal alignment.",
    influenceTags: ["Mobile App v2", "Decision"],
    confidence: "High",
  },
  {
    id: "15",
    type: "slack",
    title: "#data-pipeline-eng",
    date: "Feb 24, 2026",
    project: "Data Pipeline",
    snippet: '"Vendor SDK v4.2 has known memory leak — cannot use in production."',
    tags: ["Risk"],
    fullSnippet: "@raj.mehta: Heads up — vendor SDK v4.2 has a known memory leak under sustained load (>10k events/sec). Their GitHub issue #1847 confirms it. v4.3 is supposed to fix it but no release date. We can't deploy the streaming PoC with this version. Options: (1) fork and patch, (2) wait for v4.3, (3) evaluate alternatives.",
    influence: "This Slack thread was the primary evidence for the 'Vendor SDK update ETA unknown' risk in the Data Pipeline Refactor project. It directly contributed to the at-risk classification.",
    influenceTags: ["Data Pipeline", "Risk"],
    confidence: "High",
  },
  {
    id: "16",
    type: "jira",
    title: "PIPE-156: Batch SLA Compliance",
    date: "Feb 22, 2026",
    project: "Data Pipeline",
    snippet: '"Current batch processing misses SLA by 12 minutes on peak days."',
    tags: ["Status", "Risk"],
    fullSnippet: "SLA compliance monitoring shows batch processing exceeds the 30-minute SLA by an average of 12 minutes on peak traffic days (Tuesday, Wednesday). Root cause: sequential processing of partition keys. The streaming architecture would resolve this, but the PoC is blocked by the vendor SDK issue. Temporary mitigation: added parallel partition processing, reduced miss to 4 minutes.",
    influence: "This ticket quantified the SLA compliance gap that justifies the streaming pivot for the Data Pipeline project. The 12-minute miss provided concrete evidence for the urgency of the refactor.",
    influenceTags: ["Data Pipeline", "Status"],
    confidence: "High",
  },
  {
    id: "17",
    type: "confluence",
    title: "Streaming Architecture RFC",
    date: "Feb 17, 2026",
    project: "Data Pipeline",
    snippet: '"Proposed Kafka + Flink stack to replace batch ETL."',
    tags: ["Decision"],
    fullSnippet: "RFC: Replace the current batch ETL pipeline with a Kafka-based streaming architecture using Apache Flink for real-time transformations. Benefits: sub-second latency, horizontal scalability, native backpressure handling. Risks: team needs Flink ramp-up (est. 2-3 weeks), Kafka cluster operational overhead. Approved by architecture review board on Feb 18.",
    influence: "This RFC was the primary source for the streaming architecture decision in the Data Pipeline project. It provided the technical rationale and risk assessment that informed the project's trajectory.",
    influenceTags: ["Data Pipeline", "Decision"],
    confidence: "High",
  },
  {
    id: "18",
    type: "email",
    title: "Vendor Support Ticket #8834 — Follow-up",
    date: "Feb 26, 2026",
    project: "API Migration",
    snippet: '"Vendor confirmed docs update ETA: March 5. No interim workaround."',
    tags: ["Risk"],
    fullSnippet: "From: Vendor Support. Re: Ticket #8834. We acknowledge the documentation gap for GraphQL gateway integration. Our technical writing team is working on updated guides — ETA March 5. Unfortunately, we cannot provide an interim workaround as the new auth flow requires server-side changes that are still being tested. We recommend pausing integration work until the updated docs are available.",
    influence: "This email confirmed the timeline for the vendor documentation blocker in the API Migration project. The March 5 ETA was used to update the risk severity and project timeline projections.",
    influenceTags: ["API Migration", "Risk"],
    confidence: "High",
  },
  {
    id: "19",
    type: "transcript",
    title: "Data Pipeline Weekly Sync — Feb 24",
    date: "Feb 24, 2026",
    project: "Data Pipeline",
    snippet: '"Raj: Team needs 2 weeks of Flink training before streaming PoC."',
    tags: ["Risk", "Size"],
    fullSnippet: "Weekly sync notes: Raj Mehta raised that the team needs approximately 2 weeks of Apache Flink training before they can meaningfully start the streaming PoC. Only 1 of 3 engineers has prior streaming experience. Options discussed: (1) bring in a contractor with Flink experience, (2) use managed Flink service to reduce learning curve, (3) accept the delay. Decision deferred to next week.",
    influence: "This transcript was used to assess the capacity risk for the Data Pipeline project. The 2-week ramp-up time directly impacted the velocity forecast and contributed to the downward trend.",
    influenceTags: ["Data Pipeline", "Risk", "Size"],
    confidence: "Medium",
  },
  {
    id: "20",
    type: "slack",
    title: "#design-system-review",
    date: "Feb 25, 2026",
    project: "Design System",
    snippet: '"Final QA sign-off on all 48 components. Ready for rollout."',
    tags: ["Status"],
    fullSnippet: "@amira.patel: Final QA sign-off complete! All 48 components pass visual regression, a11y checks, and cross-browser testing. Only 2 minor CSS tweaks needed (tooltip z-index on Safari, focus ring on dark mode toggle). Fixes merged. Documentation site is live internally. We're ready for the phased rollout starting Feb 28.",
    influence: "This Slack thread confirmed the QA completion for Design System 2.0, supporting the 92% progress figure and on-track status. The successful sign-off validated the project's readiness for rollout.",
    influenceTags: ["Design System", "Status"],
    confidence: "High",
  },
  {
    id: "21",
    type: "jira",
    title: "AUTH-089: SSO Integration Spike",
    date: "Feb 23, 2026",
    project: "Auth Overhaul",
    snippet: '"Spike complete: SAML 2.0 feasible but OIDC preferred for new stack."',
    tags: ["Decision"],
    fullSnippet: "Spike results: Both SAML 2.0 and OIDC are feasible for SSO integration. OIDC is recommended for the new auth stack due to: simpler token management, better mobile support, and alignment with our API Gateway. However, 3 enterprise clients require SAML. Recommendation: implement OIDC as primary, add SAML bridge for enterprise tier. Estimated effort: 2 additional sprints for SAML bridge.",
    influence: "This spike ticket informed the SSO architecture decision for the Auth Overhaul project. The dual-protocol recommendation impacted effort estimates and contributed to the 'high' effort classification.",
    influenceTags: ["Auth Overhaul", "Decision", "Size"],
    confidence: "High",
  },
  {
    id: "22",
    type: "email",
    title: "Re: Data Pipeline — Alternative Vendor Evaluation",
    date: "Feb 25, 2026",
    project: "Data Pipeline",
    snippet: '"Confluent Cloud could replace self-managed Kafka — 40% less ops overhead."',
    tags: ["Decision"],
    fullSnippet: "Hi Raj, I've completed the preliminary evaluation of Confluent Cloud as an alternative to self-managed Kafka. Key findings: 40% reduction in operational overhead, built-in schema registry, managed connectors for our existing data sources. Cost: ~$2.4k/month vs. ~$1.8k for self-managed (but saves ~20 hrs/month of DevOps time). I recommend a 2-week trial. Let me know if I should proceed.",
    influence: "This email provided a cost-benefit analysis that may influence the infrastructure decision for the Data Pipeline project. The vendor evaluation data was logged as context for the upcoming architecture decision.",
    influenceTags: ["Data Pipeline", "Decision"],
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
