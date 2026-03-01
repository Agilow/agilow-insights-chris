import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, AlertTriangle, Clock, Hash, TicketCheck, Mail,
  Video, Users, Calendar, GitBranch, Flag, AlertCircle, Info, ExternalLink,
  Sparkles, Filter, ChevronDown, TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const sourceIcons = {
  slack: { icon: Hash, label: "Slack" },
  jira: { icon: TicketCheck, label: "Jira" },
  email: { icon: Mail, label: "Email" },
  meeting: { icon: Video, label: "Meetings" },
};
type SourceKey = keyof typeof sourceIcons;

const avatarColors = [
  "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500",
  "bg-rose-500", "bg-cyan-500", "bg-indigo-500",
];

const projectsData: Record<string, {
  name: string;
  status: "on-track" | "at-risk" | "blocked";
  confidence: "high" | "medium" | "low";
  progress: number;
  startDate: string;
  dueDate: string;
  stage: string;
  lastActivity: string;
  risk: string;
  team: { name: string; role: string; isOwner?: boolean }[];
  sources: SourceKey[];
  signals: string;
  snapshot: string;
  remainingSteps: { label: string; est: string }[];
  estimatedCompletion: string;
  whyThisProject: string;
  decisions: {
    date: string; title: string; who: string; rationale: string;
    flagged: boolean; sources: string[]; scopeChange: string;
    type: "decision" | "milestone" | "blocker" | "other";
  }[];
  milestones: { date: string; label: string; done: boolean }[];
  blockers: { date: string; label: string; resolved: boolean }[];
  risks: { description: string; severity: "high" | "medium" | "low"; source: string; nextAction: string }[];
  dataBreakdown: { source: string; items: number; lastActivity: string }[];
}> = {
  "project-phoenix": {
    name: "Project Phoenix",
    status: "on-track",
    confidence: "high",
    progress: 78,
    startDate: "Jan 15, 2026",
    dueDate: "Mar 10, 2026",
    stage: "Build",
    lastActivity: "2 min ago",
    risk: "low",
    team: [
      { name: "Elena R.", role: "PM", isOwner: true },
      { name: "James K.", role: "Lead Engineer" },
      { name: "Sofia M.", role: "Designer" },
      { name: "Alex T.", role: "Backend" },
      { name: "Maya L.", role: "Frontend" },
      { name: "Ryan C.", role: "QA" },
    ],
    sources: ["slack", "jira", "meeting"],
    signals: "3 Slack threads · 4 Jira updates · 2 meetings",
    snapshot: "Complete platform rebuild with new microservices architecture. Migration of legacy monolith to cloud-native services is progressing well — core API migration is complete and auth integration is done. Load testing remains the last major technical gate before production deploy.",
    remainingSteps: [
      { label: "Provision load testing environment", est: "1 day" },
      { label: "Run full load test at 3× expected peak", est: "2 days" },
      { label: "Final security review and penetration test", est: "2 days" },
      { label: "Production deploy with feature flags", est: "1 day" },
      { label: "Post-launch monitoring (48 h)", est: "2 days" },
    ],
    estimatedCompletion: "Mar 10, 2026",
    whyThisProject: "Retiring the legacy monolith is a prerequisite for 3 other Q2 initiatives. Estimated $180K in infra cost savings annually. Two enterprise customers have contractual SLAs tied to the new platform's uptime guarantees.",
    decisions: [
      { date: "Feb 24", title: "Postpone OAuth to Phase 2", who: "Elena R.", rationale: "Avoid 2-week delay on vendor integration. Team consensus in standup.", flagged: false, sources: ["Meeting transcript", "JIRA PHX-189"], scopeChange: "Reduced scope", type: "decision" },
      { date: "Feb 18", title: "Switch to Redis for session cache", who: "James K.", rationale: "Memcached hitting limits at scale. Redis cluster handles 3× throughput.", flagged: false, sources: ["Slack #phoenix-eng", "JIRA PHX-156"], scopeChange: "No scope change", type: "decision" },
      { date: "Feb 10", title: "Skip E2E tests for internal admin", who: "Ryan C.", rationale: "Saved 3 days but caused 2 regressions in admin panel.", flagged: true, sources: ["Post-mortem", "JIRA PHX-142"], scopeChange: "Reduced scope", type: "decision" },
      { date: "Feb 1", title: "Core API Migration complete", who: "James K.", rationale: "All 14 endpoints migrated and passing integration tests.", flagged: false, sources: ["JIRA PHX-100"], scopeChange: "No scope change", type: "milestone" },
      { date: "Jan 15", title: "Architecture Review passed", who: "Elena R.", rationale: "Architecture review board approved microservices design.", flagged: false, sources: ["Meeting notes"], scopeChange: "No scope change", type: "milestone" },
    ],
    milestones: [
      { date: "Jan 15", label: "Architecture Review", done: true },
      { date: "Feb 1", label: "Core API Migration", done: true },
      { date: "Feb 20", label: "Auth Integration", done: true },
      { date: "Mar 1", label: "Load Testing", done: false },
      { date: "Mar 10", label: "Production Deploy", done: false },
    ],
    blockers: [],
    risks: [
      { description: "Load testing environment not yet provisioned", severity: "medium", source: "JIRA PHX-201", nextAction: "DevOps to provision staging cluster this sprint" },
      { description: "Third-party payment SDK update may break integration", severity: "low", source: "Slack #phoenix-eng", nextAction: "Pin SDK version and monitor release notes" },
    ],
    dataBreakdown: [
      { source: "Slack", items: 3, lastActivity: "2 min ago" },
      { source: "Jira", items: 4, lastActivity: "12 min ago" },
      { source: "Meetings", items: 2, lastActivity: "Yesterday" },
    ],
  },
  "api-migration-v3": {
    name: "API Migration v3",
    status: "at-risk",
    confidence: "medium",
    progress: 45,
    startDate: "Jan 20, 2026",
    dueDate: "Mar 3, 2026",
    stage: "Build",
    lastActivity: "5 min ago",
    risk: "high",
    team: [
      { name: "David P.", role: "PM", isOwner: true },
      { name: "Sarah W.", role: "Lead Engineer" },
      { name: "Tom H.", role: "Backend" },
      { name: "Lisa N.", role: "DevOps" },
    ],
    sources: ["slack", "jira", "email"],
    signals: "3 Slack threads · 3 Jira updates · 3 emails",
    snapshot: "Migrating all public-facing APIs from REST v2 to GraphQL gateway. Schema design and gateway setup are complete, but endpoint migration is stalled — three downstream teams are blocked on an auth endpoint due to outdated vendor documentation.",
    remainingSteps: [
      { label: "Resolve vendor auth endpoint documentation gap", est: "2 days" },
      { label: "Complete remaining 6 endpoint migrations", est: "4 days" },
      { label: "Update client SDK for all consumers", est: "2 days" },
      { label: "Integration testing with downstream teams", est: "2 days" },
    ],
    estimatedCompletion: "Mar 12, 2026 (slipping)",
    whyThisProject: "Three downstream teams have Q1 releases blocked on this migration. GraphQL gateway reduces total API calls by 60%, directly impacting mobile performance. Contractual delivery to one enterprise client expected by end of Q1.",
    decisions: [
      { date: "Feb 20", title: "Migrate to GraphQL gateway", who: "David P.", rationale: "Reduces API calls by 60%. Approved by architecture review board.", flagged: false, sources: ["Email thread", "JIRA API-402"], scopeChange: "No scope change", type: "decision" },
      { date: "Feb 15", title: "Use vendor auth library as-is", who: "Sarah W.", rationale: "Docs outdated — caused 3 team blocks. Now evaluating alternatives.", flagged: true, sources: ["Slack #api-team", "Incident report"], scopeChange: "Increased scope", type: "decision" },
      { date: "Feb 5", title: "Gateway setup complete", who: "Tom H.", rationale: "GraphQL gateway deployed to staging, passing smoke tests.", flagged: false, sources: ["JIRA API-350"], scopeChange: "No scope change", type: "milestone" },
    ],
    milestones: [
      { date: "Jan 20", label: "Schema Design", done: true },
      { date: "Feb 5", label: "Gateway Setup", done: true },
      { date: "Feb 25", label: "Endpoint Migration", done: false },
      { date: "Mar 3", label: "Client SDK Update", done: false },
    ],
    blockers: [
      { date: "Feb 18", label: "Vendor auth docs outdated — 3 teams blocked", resolved: false },
    ],
    risks: [
      { description: "3 teams blocked on auth endpoint — vendor docs outdated", severity: "high", source: "Slack #api-team", nextAction: "Emergency sync with vendor support" },
      { description: "Client SDK deadline conflicts with testing window", severity: "medium", source: "Email / PM sync", nextAction: "Negotiate SDK deadline with client team" },
    ],
    dataBreakdown: [
      { source: "Slack", items: 3, lastActivity: "5 min ago" },
      { source: "Jira", items: 3, lastActivity: "8 min ago" },
      { source: "Email", items: 3, lastActivity: "1 hour ago" },
    ],
  },
  "design-system-2": {
    name: "Design System 2.0",
    status: "on-track",
    confidence: "high",
    progress: 92,
    startDate: "Jan 28, 2026",
    dueDate: "Feb 28, 2026",
    stage: "Finalising",
    lastActivity: "20 min ago",
    risk: "low",
    team: [
      { name: "Sofia M.", role: "Lead Designer", isOwner: true },
      { name: "Maya L.", role: "Frontend" },
      { name: "Contractor", role: "Design Tokens" },
    ],
    sources: ["slack", "jira"],
    signals: "2 Slack threads · 2 Jira updates",
    snapshot: "Unified design token library and component documentation is 92% complete. Remaining work is documentation polish and final sign-off from product leads before handoff to all teams.",
    remainingSteps: [
      { label: "Complete storybook documentation for 8 remaining components", est: "1 day" },
      { label: "Product lead sign-off review", est: "0.5 day" },
      { label: "Publish to internal npm registry", est: "0.5 day" },
    ],
    estimatedCompletion: "Feb 28, 2026",
    whyThisProject: "Eliminates ~30% of redundant CSS across 4 product teams. Estimated 2 weeks saved per quarter in design-dev handoff. Prerequisite for new marketing site rebuild.",
    decisions: [
      { date: "Feb 14", title: "Hire contractor for design tokens", who: "Sofia M.", rationale: "Internal team overloaded. 4-week engagement approved.", flagged: false, sources: ["Slack #design", "Budget approval email"], scopeChange: "No scope change", type: "decision" },
    ],
    milestones: [
      { date: "Jan 28", label: "Token Audit", done: true },
      { date: "Feb 14", label: "Component Library", done: true },
      { date: "Feb 26", label: "Documentation", done: false },
    ],
    blockers: [],
    risks: [],
    dataBreakdown: [
      { source: "Slack", items: 2, lastActivity: "20 min ago" },
      { source: "Jira", items: 2, lastActivity: "1 hour ago" },
    ],
  },
  "auth-overhaul": {
    name: "Auth Overhaul",
    status: "blocked",
    confidence: "low",
    progress: 33,
    startDate: "Jan 10, 2026",
    dueDate: "Mar 20, 2026",
    stage: "Build",
    lastActivity: "15 min ago",
    risk: "medium",
    team: [
      { name: "James K.", role: "Lead Engineer", isOwner: true },
      { name: "Alex T.", role: "Backend" },
      { name: "Ryan C.", role: "QA" },
      { name: "David P.", role: "PM" },
      { name: "Legal Team", role: "Compliance" },
    ],
    sources: ["slack", "jira", "email", "meeting"],
    signals: "3 Slack threads · 2 Jira updates · 2 emails · 2 meetings",
    snapshot: "Complete overhaul of authentication system to support SSO, MFA, and new compliance requirements. SSO integration is blocked pending SSO provider's March API changes. A new GDPR requirement flagged by Legal may also require changes to token storage.",
    remainingSteps: [
      { label: "Resolve GDPR compliance approach with Legal", est: "3 days" },
      { label: "Complete SSO integration (pending vendor changes)", est: "5 days" },
      { label: "MFA implementation and testing", est: "4 days" },
      { label: "Compliance audit", est: "3 days" },
      { label: "Security penetration test", est: "2 days" },
    ],
    estimatedCompletion: "Mar 20, 2026 (at risk of slipping)",
    whyThisProject: "Required for SOC 2 Type II certification renewal in Q2. SSO is a blocker for 2 enterprise deals in negotiation. MFA reduces security risk exposure across 34 team members and all external users.",
    decisions: [
      { date: "Feb 20", title: "Custom encryption library adopted", who: "James K.", rationale: "Chosen for speed, but caused 3-day downtime. Replacement planned Q3.", flagged: true, sources: ["Slack #auth-team", "Post-mortem doc"], scopeChange: "Increased scope", type: "decision" },
    ],
    milestones: [
      { date: "Jan 10", label: "Requirements Gathering", done: true },
      { date: "Feb 15", label: "SSO Integration", done: false },
      { date: "Mar 1", label: "MFA Implementation", done: false },
      { date: "Mar 15", label: "Compliance Audit", done: false },
    ],
    blockers: [
      { date: "Feb 20", label: "SSO provider API changes scheduled — integration stalled", resolved: false },
      { date: "Feb 25", label: "New GDPR requirement flagged by Legal", resolved: false },
    ],
    risks: [
      { description: "New compliance requirement flagged in email thread", severity: "medium", source: "Email / Legal", nextAction: "Schedule 30-min review with Legal" },
      { description: "SSO provider API changes scheduled for March", severity: "high", source: "Vendor notification email", nextAction: "Contact SSO vendor for migration guide" },
    ],
    dataBreakdown: [
      { source: "Slack", items: 3, lastActivity: "15 min ago" },
      { source: "Jira", items: 2, lastActivity: "30 min ago" },
      { source: "Email", items: 2, lastActivity: "2 hours ago" },
      { source: "Meetings", items: 2, lastActivity: "Yesterday" },
    ],
  },
  "mobile-app-v2": {
    name: "Mobile App v2",
    status: "on-track",
    confidence: "high",
    progress: 61,
    startDate: "Feb 1, 2026",
    dueDate: "Apr 5, 2026",
    stage: "Build",
    lastActivity: "1 hr ago",
    risk: "low",
    team: [
      { name: "Jade K.", role: "PM", isOwner: true },
      { name: "Sam T.", role: "iOS Lead" },
      { name: "Priya N.", role: "Android" },
      { name: "Lin W.", role: "QA" },
    ],
    sources: ["slack", "jira", "meeting"],
    signals: "28 Slack threads · 16 Jira updates · 1 meeting",
    snapshot: "Mobile app v2 introduces offline sync, push notifications, and a redesigned onboarding flow. Android offline sync has passed all edge-case tests. iOS testing is underway. Push notifications are 70% complete — FCM done, APNs integration in progress.",
    remainingSteps: [
      { label: "Complete APNs push notification integration", est: "3 days" },
      { label: "iOS offline sync edge-case testing", est: "2 days" },
      { label: "Redesigned onboarding flow QA", est: "1 day" },
      { label: "App store submission & review", est: "5 days" },
    ],
    estimatedCompletion: "Apr 5, 2026",
    whyThisProject: "v2 targets a 40% improvement in DAU by enabling offline usage for field teams. Push notifications are a top-requested feature from 73% of beta users. Onboarding redesign reduces drop-off rate by an estimated 25%.",
    decisions: [
      { date: "Feb 19", title: "Prioritize push notifications over dark mode", who: "Jade K.", rationale: "73% of beta users requested push notifications vs 28% for dark mode. Sprint 11 unanimous agreement.", flagged: false, sources: ["Meeting transcript", "Sprint 11 notes"], scopeChange: "No scope change", type: "decision" },
      { date: "Feb 20", title: "Defer accessibility audit to post-launch", who: "Jade K.", rationale: "April 2 deadline insufficient for both audit and push notifications. Risk accepted by product lead.", flagged: true, sources: ["Email", "Jira MOB-290"], scopeChange: "Reduced scope", type: "decision" },
      { date: "Feb 14", title: "Offline sync milestone reached (Android)", who: "Sam T.", rationale: "All 23 edge-case tests passing on Android. iOS in progress.", flagged: false, sources: ["Slack #mobile-v2-dev", "Jira MOB-265"], scopeChange: "No scope change", type: "milestone" },
    ],
    milestones: [
      { date: "Feb 5", label: "Onboarding Redesign", done: true },
      { date: "Feb 14", label: "Android Offline Sync", done: true },
      { date: "Mar 10", label: "iOS Offline Sync", done: false },
      { date: "Mar 20", label: "Push Notifications", done: false },
      { date: "Apr 5", label: "App Store Submit", done: false },
    ],
    blockers: [],
    risks: [
      { description: "Accessibility audit deferred — post-launch remediation costs possible", severity: "low", source: "Email / PM", nextAction: "Budget for post-launch accessibility sprint" },
    ],
    dataBreakdown: [
      { source: "Slack", items: 2, lastActivity: "1 hr ago" },
      { source: "Jira", items: 2, lastActivity: "3 hrs ago" },
      { source: "Email", items: 1, lastActivity: "2 days ago" },
      { source: "Meetings", items: 1, lastActivity: "2 days ago" },
    ],
  },
  "data-pipeline-refactor": {
    name: "Data Pipeline Refactor",
    status: "at-risk",
    confidence: "medium",
    progress: 28,
    startDate: "Feb 3, 2026",
    dueDate: "Mar 28, 2026",
    stage: "Design",
    lastActivity: "3 days ago",
    risk: "high",
    team: [
      { name: "Raj M.", role: "Lead Engineer", isOwner: true },
      { name: "Chen L.", role: "Data Engineer" },
      { name: "Fatima O.", role: "DevOps" },
    ],
    sources: ["slack", "jira", "email"],
    signals: "19 Slack threads · 11 Jira updates · 4 emails",
    snapshot: "Replacing the batch ETL pipeline with a real-time Kafka + Flink streaming architecture. RFC approved but the PoC is blocked by a known memory leak in vendor SDK v4.2. Current batch pipeline misses SLA by 4 minutes on peak days (down from 12 with a temporary fix).",
    remainingSteps: [
      { label: "Resolve vendor SDK v4.3 release or evaluate alternative", est: "3 days" },
      { label: "Complete streaming PoC with Kafka + Flink", est: "5 days" },
      { label: "Team Flink ramp-up training", est: "10 days" },
      { label: "Migrate batch pipelines to streaming", est: "8 days" },
      { label: "Performance validation & SLA compliance test", est: "3 days" },
    ],
    estimatedCompletion: "Mar 28, 2026 (at risk)",
    whyThisProject: "Current batch pipeline misses SLA targets on peak days, directly impacting downstream reporting. Streaming architecture enables sub-second latency and unblocks 2 product teams waiting on real-time data. Projected $60K/year savings in compute once streaming replaces batch.",
    decisions: [
      { date: "Feb 18", title: "Adopt Kafka + Flink streaming stack", who: "Raj M.", rationale: "Approved by architecture review board. Sub-second latency and native backpressure handling justify 2-3 week ramp-up.", flagged: false, sources: ["Confluence RFC", "Architecture Review"], scopeChange: "No scope change", type: "decision" },
      { date: "Feb 25", title: "Evaluate Confluent Cloud as alternative", who: "Chen L.", rationale: "40% less ops overhead vs self-managed Kafka. 2-week trial recommended.", flagged: false, sources: ["Email", "Jira PIPE-160"], scopeChange: "No scope change", type: "decision" },
    ],
    milestones: [
      { date: "Feb 5", label: "RFC Approved", done: true },
      { date: "Feb 18", label: "Architecture Review", done: true },
      { date: "Mar 5", label: "Streaming PoC", done: false },
      { date: "Mar 15", label: "Pipeline Migration", done: false },
      { date: "Mar 28", label: "SLA Validation", done: false },
    ],
    blockers: [
      { date: "Feb 24", label: "Vendor SDK v4.2 memory leak — PoC blocked", resolved: false },
    ],
    risks: [
      { description: "Vendor SDK v4.2 memory leak blocks streaming PoC", severity: "high", source: "Slack #data-pipeline-eng", nextAction: "Evaluate Confluent Cloud or wait for SDK v4.3" },
      { description: "Team needs 2 weeks Flink ramp-up before PoC", severity: "medium", source: "Meeting transcript", nextAction: "Evaluate contractor with Flink experience or managed Flink service" },
    ],
    dataBreakdown: [
      { source: "Slack", items: 2, lastActivity: "3 days ago" },
      { source: "Jira", items: 2, lastActivity: "3 days ago" },
      { source: "Email", items: 2, lastActivity: "2 days ago" },
    ],
  },
};

const statusConfig = {
  "on-track": { label: "On Track", icon: CheckCircle2, chip: "text-status-success bg-status-success/10 border-status-success/20" },
  "at-risk": { label: "At Risk", icon: AlertTriangle, chip: "text-status-danger bg-status-danger/10 border-status-danger/20" },
  blocked: { label: "Blocked", icon: Clock, chip: "text-status-warning bg-status-warning/10 border-status-warning/20" },
};
const confidenceConfig = {
  high: "text-status-success bg-status-success/10 border-status-success/20",
  medium: "text-status-warning bg-status-warning/10 border-status-warning/20",
  low: "text-status-danger bg-status-danger/10 border-status-danger/20",
};
const riskSeverity = {
  high: "text-status-danger bg-status-danger/10 border-status-danger/20",
  medium: "text-status-warning bg-status-warning/10 border-status-warning/20",
  low: "text-accent bg-accent/10 border-accent/20",
};

type TimelineFilter = "all" | "decision" | "milestone" | "blocker" | "other";

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = projectsData[slug || ""];
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "risks">("overview");
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("all");

  if (!project) {
    return (
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground mb-2">Project not found</h1>
            <Link to="/" className="text-sm text-accent hover:underline">Back to dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const st = statusConfig[project.status];
  const conf = confidenceConfig[project.confidence];

  // Build timeline entries from decisions + milestones + blockers
  const timelineEntries = [
    ...project.decisions.map(d => ({ ...d, entryType: d.type })),
    ...project.milestones.filter(m => m.done).map(m => ({
      date: m.date, title: m.label, who: "System", rationale: "Milestone completed.",
      flagged: false, sources: ["Jira"], scopeChange: "No scope change", entryType: "milestone" as const,
    })),
    ...project.blockers.map(b => ({
      date: b.date, title: b.label, who: "AI detected", rationale: "Detected from Slack and Jira signals.",
      flagged: !b.resolved, sources: ["Slack", "Jira"], scopeChange: "Increased scope", entryType: "blocker" as const,
    })),
  ].sort((a, b) => new Date(b.date + " 2026").getTime() - new Date(a.date + " 2026").getTime());

  const filteredTimeline = timelineFilter === "all"
    ? timelineEntries
    : timelineEntries.filter(e => e.entryType === timelineFilter);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 max-w-[1400px]">
          {/* Back */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5">
              <ArrowLeft className="w-4 h-4" /> Back to Project Dashboard
            </Link>

            {/* Top header card */}
            <div className="glass-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${st.chip}`}>
                      <st.icon className="w-3 h-3" />{st.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${conf}`}>
                      {project.confidence.charAt(0).toUpperCase() + project.confidence.slice(1)} Confidence
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{project.startDate} → <span className="text-status-danger font-medium">{project.dueDate}</span></span>
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-accent" />{project.stage}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Last activity {project.lastActivity}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="h-2.5 bg-secondary rounded-full overflow-hidden flex-1 mr-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-accent rounded-full"
                        />
                      </div>
                      <span className="text-sm font-bold text-foreground shrink-0">{project.progress}%</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {project.remainingSteps.length} steps remaining · Estimated completion: <span className="font-medium text-foreground">{project.estimatedCompletion}</span>
                    </p>
                  </div>
                </div>

                {/* Team avatars */}
                <div className="flex -space-x-2 shrink-0">
                  {project.team.slice(0, 5).map((t, i) => (
                    <Tooltip key={t.name}>
                      <TooltipTrigger>
                        <div className={`w-9 h-9 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white ${avatarColors[i % avatarColors.length]}`}>
                          {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent><p>{t.name} · {t.role}</p></TooltipContent>
                    </Tooltip>
                  ))}
                  {project.team.length > 5 && (
                    <div className="w-9 h-9 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground">
                      +{project.team.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-border mb-5">
            {(["overview", "timeline", "risks"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "timeline" ? "Timeline & Decisions" : tab === "risks" ? `Risks (${project.risks.length} open)` : "Overview"}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ─────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Current Snapshot */}
                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-foreground mb-2">Current Snapshot</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{project.snapshot}</p>

                    <div className="mt-4">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2.5">Remaining Steps</p>
                      <ol className="space-y-2">
                        {project.remainingSteps.map((step, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm">
                            <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                            <span className="flex-1 text-foreground">{step.label}</span>
                            <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full shrink-0">{step.est}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-xs text-muted-foreground">Estimated completion: </span>
                      <span className="text-xs font-semibold text-foreground">{project.estimatedCompletion}</span>
                    </div>
                  </div>

                  {/* Project Objective */}
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <h3 className="font-semibold text-foreground">Project Objective</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{project.whyThisProject}</p>
                  </div>

                  {/* Data Sources */}
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-semibold text-foreground">Data Sources</h3>
                      <Tooltip>
                        <TooltipTrigger><Info className="w-4 h-4 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent><p className="text-xs max-w-[200px]">All insights derived from connected data sources via MCP aggregation.</p></TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                     {project.dataBreakdown.map((d) => (
                        <div key={d.source} onClick={() => navigate(`/sources?source=${d.source === "Meetings" ? "transcript" : d.source.toLowerCase()}&project=${slug}`)}
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50 cursor-pointer hover:bg-secondary transition-all group">
                          <div className="p-2 rounded-lg bg-background">
                            {d.source === "Slack" && <Hash className="w-4 h-4 text-accent" />}
                            {d.source === "Jira" && <TicketCheck className="w-4 h-4 text-accent" />}
                            {d.source === "Email" && <Mail className="w-4 h-4 text-accent" />}
                            {d.source === "Meetings" && <Video className="w-4 h-4 text-accent" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{d.source}</p>
                            <p className="text-[11px] text-muted-foreground">{d.items} items · {d.lastActivity}</p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  {/* Top Risks */}
                  {project.risks.length > 0 && (
                    <div className="glass-card p-5">
                      <h3 className="font-semibold text-foreground mb-3">Top Risks</h3>
                      <div className="space-y-2">
                        {project.risks.map((r, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${riskSeverity[r.severity]}`}>
                              {r.severity.charAt(0).toUpperCase() + r.severity.slice(1)}
                            </span>
                            <div>
                              <p className="text-xs text-foreground">{r.description}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{r.nextAction}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setActiveTab("risks")} className="mt-3 text-xs text-accent hover:underline">View all risks →</button>
                    </div>
                  )}

                  {/* Milestones */}
                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-foreground mb-3">Milestones</h3>
                    <div className="space-y-2.5">
                      {project.milestones.map((m, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${m.done ? "bg-status-success/10" : "bg-secondary"}`}>
                            {m.done ? <CheckCircle2 className="w-3 h-3 text-status-success" /> : <Clock className="w-3 h-3 text-muted-foreground" />}
                          </div>
                          <span className={`text-xs flex-1 ${m.done ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</span>
                          <span className="text-[10px] text-muted-foreground">{m.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team */}
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-accent" />
                      <h3 className="font-semibold text-foreground">Team</h3>
                    </div>
                    <div className="space-y-2">
                      {project.team.map((t, i) => (
                        <div key={t.name} className="flex items-center gap-2.5 py-1.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                            {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{t.name}</p>
                            <p className="text-[10px] text-muted-foreground">{t.role}{t.isOwner ? " · Owner" : ""}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TIMELINE & DECISIONS TAB ────────────────────────────────── */}
            {activeTab === "timeline" && (
              <motion.div key="timeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">Project Timeline</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Sparkles className="w-3 h-3 text-accent" />
                        Generated from connected sources — meeting notes, Slack, Jira tickets, email threads.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                      {(["all", "decision", "milestone", "blocker", "other"] as TimelineFilter[]).map((f) => (
                        <button key={f} onClick={() => setTimelineFilter(f)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors capitalize ${
                            timelineFilter === f ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/70"
                          }`}>
                          {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
                    <div className="space-y-4">
                      {filteredTimeline.length === 0 && (
                        <p className="text-sm text-muted-foreground py-4 text-center">No entries for this filter.</p>
                      )}
                      {filteredTimeline.map((entry, i) => {
                        const isMilestone = entry.entryType === "milestone";
                        const isBlocker = entry.entryType === "blocker";
                        return (
                          <div key={i} className="flex gap-3 relative">
                            <div className="shrink-0 mt-1 z-10">
                              {entry.flagged ? (
                                <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                                  <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                                </div>
                              ) : isMilestone ? (
                                <div className="w-6 h-6 rounded-full bg-status-success/10 flex items-center justify-center">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
                                </div>
                              ) : isBlocker ? (
                                <div className="w-6 h-6 rounded-full bg-status-warning/10 flex items-center justify-center">
                                  <Clock className="w-3.5 h-3.5 text-status-warning" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                                  <GitBranch className="w-3.5 h-3.5 text-accent" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 pb-1">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <span className="text-xs text-muted-foreground">{entry.date}</span>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                                  entry.entryType === "milestone" ? "bg-status-success/10 text-status-success" :
                                  entry.entryType === "blocker" ? "bg-status-warning/10 text-status-warning" :
                                  entry.entryType === "decision" ? "bg-accent/10 text-accent" :
                                  "bg-secondary text-muted-foreground"
                                }`}>
                                  {entry.entryType}
                                </span>
                                {entry.flagged && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full">
                                    <Flag className="w-2.5 h-2.5" /> Lesson Learned
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-medium text-foreground">{entry.title}</h4>
                              {entry.who && entry.who !== "System" && (
                                <p className="text-[11px] text-muted-foreground mt-0.5">Decided by {entry.who}</p>
                              )}
                              <p className="text-xs text-muted-foreground mt-0.5">{entry.rationale}</p>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                {entry.scopeChange !== "No scope change" && (
                                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                                    entry.scopeChange === "Increased scope" ? "text-status-danger bg-status-danger/10 border-status-danger/20" : "text-status-success bg-status-success/10 border-status-success/20"
                                  }`}>{entry.scopeChange}</span>
                                )}
                                {entry.sources.map((s, j) => (
                                  <span key={j} className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                                    <GitBranch className="w-2.5 h-2.5" />{s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── RISKS TAB ────────────────────────────────────────────────── */}
            {activeTab === "risks" && (
              <motion.div key="risks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {project.risks.length === 0 ? (
                  <div className="glass-card p-10 text-center">
                    <CheckCircle2 className="w-10 h-10 text-status-success mx-auto mb-3" />
                    <p className="font-semibold text-foreground">No open risks</p>
                    <p className="text-sm text-muted-foreground mt-1">Agilow hasn't detected any risks for this project yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {project.risks.map((r, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="glass-card p-5">
                        <div className="flex items-start gap-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 mt-0.5 ${riskSeverity[r.severity]}`}>
                            {r.severity.charAt(0).toUpperCase() + r.severity.slice(1)}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">{r.description}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                              <GitBranch className="w-3 h-3" />{r.source}
                            </p>
                            <div className="mt-2 p-2.5 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">Next action: </span>{r.nextAction}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
