import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  Sparkles,
  Database,
  CheckCircle2,
  Download,
  ArrowUpRight,
  Hash,
  Mail,
  Video,
  TicketCheck,
  AlertTriangle,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  Target,
} from "lucide-react";

// ─── Project data matching the dashboard ────────────────────────────────────
const PROJECTS = [
  { id: "project-phoenix", name: "Project Phoenix", owner: "Elena R.", progress: 78, status: "on-track", team: 6, dueDate: "Mar 10, 2026" },
  { id: "api-migration-v3", name: "API Migration v3", owner: "David P.", progress: 45, status: "at-risk", team: 4, dueDate: "Mar 3, 2026" },
  { id: "design-system-2", name: "Design System 2.0", owner: "Sofia M.", progress: 92, status: "on-track", team: 3, dueDate: "Feb 28, 2026" },
  { id: "auth-overhaul", name: "Auth Overhaul", owner: "James K.", progress: 33, status: "blocked", team: 5, dueDate: "Mar 20, 2026" },
  { id: "mobile-app-v2", name: "Mobile App v2", owner: "Raj M.", progress: 61, status: "on-track", team: 7, dueDate: "Apr 5, 2026" },
];

const DATA_PULL_STEPS = [
  { icon: Hash, label: "Pulling Slack messages and threads…", source: "Slack" },
  { icon: TicketCheck, label: "Fetching Jira tickets and sprint data…", source: "Jira" },
  { icon: Mail, label: "Scanning email threads for updates…", source: "Email" },
  { icon: Video, label: "Processing meeting transcripts…", source: "Meetings" },
  { icon: Database, label: "Aggregating signals and context…", source: "Analysis" },
];

// ─── Per-report generated content ───────────────────────────────────────────
function buildProgressReport(project: typeof PROJECTS[0]) {
  const isAtRisk = project.status === "at-risk";
  const isBlocked = project.status === "blocked";

  const sections: { title: string; content: string; type?: "warn" | "ok" | "neutral" }[] = [];

  if (project.id === "project-phoenix") {
    sections.push(
      { title: "Overall Progress", content: `Project Phoenix is 78% complete and on track for the March 10 delivery date. The UI migration milestone reached 85% completion this week after Elena's team resolved two long-standing component dependency conflicts surfaced in PHX-234 and PHX-241.`, type: "ok" },
      { title: "Sprint Burndown", content: `Sprint 24 delivered 45 story points (97% of committed scope). One carryover ticket (PHX-249: dark mode token refresh) moves into Sprint 25 with no impact on critical path. Velocity has been consistent at 44–47 pts per sprint over the last 5 cycles.`, type: "neutral" },
      { title: "Key Milestones", content: `UI Migration: 85% complete — on schedule.\nLoad Testing Setup: 60% complete — Elena flagged in the March 1st standup that the environment provisioning is 2 days behind, but this has no effect on the March 10 date.\nFinal QA & Staging: Not yet started, scheduled for March 4–7.`, type: "neutral" },
      { title: "Risks & Blockers", content: `One emerging risk: the load testing environment delay may compress final QA time from 4 days to 2.5 days. Recommend confirming QA resource availability by March 3.`, type: "warn" },
      { title: "Team Signals", content: `3 Slack messages flagged this week — 2 flagged positive momentum on component library handoffs, 1 raised a question about API contract versioning (resolved within 4 hours by David P.). No overtime patterns detected. Team morale signals are stable.` },
    );
  } else if (project.id === "api-migration-v3") {
    sections.push(
      { title: "Overall Progress", content: `API Migration v3 is 45% complete and currently at risk. The March 3rd deadline is 5 days out. At current velocity, the team is tracking to deliver approximately 62% of scope by that date — a significant shortfall.`, type: "warn" },
      { title: "Sprint Burndown", content: `Sprint 24 delivered only 28 story points against a commitment of 38. Three tickets were blocked on SSO vendor documentation (API-415, API-418, API-421), contributing to a 26% miss. Velocity has dropped from 36 avg to 28 pts this sprint.`, type: "warn" },
      { title: "Key Milestones", content: `Authentication layer: 35% complete — blocked.\nCore endpoint refactor: 70% complete — on schedule.\nTest coverage threshold (80%): 55% — behind.\nDocumentation update: Not started.`, type: "neutral" },
      { title: "Risks & Blockers", content: `Primary blocker: SSO vendor has not delivered updated OAuth 2.1 documentation. David P. escalated on Feb 28th. No response as of March 1st. This is the critical path item and the most likely cause of a deadline slip. Recommend executive escalation to vendor account manager by EOD today.`, type: "warn" },
      { title: "Recommendation", content: `Consider a scoped March 3rd release covering the non-auth endpoints, with Auth layer as a Phase 2 delivery by March 10. This would let dependent teams unblock without waiting on the vendor.`, type: "ok" },
    );
  } else if (project.id === "auth-overhaul") {
    sections.push(
      { title: "Overall Progress", content: `Auth Overhaul is 33% complete and currently blocked. The March 20th target is at risk if the primary blocker is not resolved within the next 3 business days.`, type: "warn" },
      { title: "Sprint Burndown", content: `Sprint 23 delivered 18 story points against a 32-point commitment — a 44% miss caused entirely by the GDPR compliance review blocking all identity-layer work. Sprint 24 is showing the same pattern with 9 pts delivered in 4 days.`, type: "warn" },
      { title: "Key Milestones", content: `Identity provider integration: 25% complete — blocked on GDPR review.\nSession management refactor: 55% complete — active.\nMFA implementation: 10% complete — not yet started.\nSecurity audit: Scheduled for March 14–17.`, type: "neutral" },
      { title: "Primary Blocker", content: `The Legal & Compliance team has flagged a GDPR Article 17 concern around the new token storage mechanism. James K. met with Legal on Feb 27th. Legal has requested a formal data flow diagram before they can approve the architecture. James estimates this will take 2 days to prepare.`, type: "warn" },
      { title: "Recommendation", content: `Prioritize completing the data flow diagram (assign one additional engineer to support James). Parallel-track MFA scoping to avoid total team idle time. Flag to stakeholders that March 20th delivery requires Legal sign-off by March 5th.`, type: "ok" },
    );
  } else if (project.id === "design-system-2") {
    sections.push(
      { title: "Overall Progress", content: `Design System 2.0 is 92% complete — effectively in final wrap-up phase ahead of the February 28th handoff. Sofia's team has delivered all core token libraries, component documentation, and Figma integration specs.`, type: "ok" },
      { title: "Sprint Burndown", content: `Sprint 24 delivered 22 of 23 committed story points (96% hit rate). One remaining ticket (DS-88: accessibility audit for form components) is in review and will close by EOD February 28th.`, type: "ok" },
      { title: "Key Milestones", content: `Component Library: 100% complete — merged and published.\nToken Documentation: 100% complete.\nFigma Integration: 95% complete — final sync in progress.\nAccessibility Audit: 90% complete — DS-88 in review.`, type: "ok" },
      { title: "Handoff Readiness", content: `Phoenix and Mobile App v2 teams have been onboarded to the new token system. API Migration v3 adoption is pending David P.'s team confirming their migration timeline. Estimate full cross-team adoption by March 7th.`, type: "ok" },
    );
  } else {
    sections.push(
      { title: "Overall Progress", content: `Mobile App v2 is 61% complete and on track for the April 5th launch. Raj M.'s team completed the onboarding redesign and push notification infrastructure in Sprint 23, marking two major milestones ahead of schedule.`, type: "ok" },
      { title: "Sprint Burndown", content: `Sprint 24 committed 40 points, delivered 37 (93% hit rate). Three minor UI tickets deferred to Sprint 25 by team consensus — none are on the critical path. Average velocity has improved from 34 to 38 pts over the last 3 sprints.`, type: "ok" },
      { title: "Key Milestones", content: `Onboarding Flow Redesign: 100% complete.\nPush Notification Infrastructure: 100% complete.\nPayment Integration (Stripe): 55% complete — on schedule.\nOffline Mode: 40% complete — on schedule.\nApp Store Submission Prep: Not started, scheduled March 22.`, type: "neutral" },
      { title: "Risks", content: `One dependency risk: App Store submission requires Design System 2.0 token migration to be fully applied across all screens. Sofia's team has confirmed availability to support this the week of March 3rd.`, type: "neutral" },
    );
  }
  return sections;
}

function buildExecUpdate() {
  return [
    { title: "Portfolio Health Summary", content: `As of March 1, 2026, 3 of 5 active projects are on track, 1 is at risk, and 1 is blocked. Overall portfolio delivery confidence for Q1 is moderate — achievable if two active blockers are resolved within the week.`, type: "ok" as const },
    { title: "Project Phoenix — On Track (78%)", content: `UI migration is progressing well. March 10th delivery date is intact. Minor load testing environment delay noted but not yet critical. No executive action needed.`, type: "ok" as const },
    { title: "API Migration v3 — At Risk (45%)", content: `SSO vendor documentation delay is the primary concern. David P. has escalated. Recommend executive reach-out to vendor account manager today. A scoped March 3rd delivery of non-auth endpoints is being evaluated as a contingency.`, type: "warn" as const },
    { title: "Design System 2.0 — On Track (92%)", content: `Final accessibility audit in review. On track for February 28th handoff. Sofia's team is available to support downstream adoption across Phoenix and Mobile App v2 the week of March 3rd.`, type: "ok" as const },
    { title: "Auth Overhaul — Blocked (33%)", content: `GDPR compliance review is blocking all identity-layer work. James K. is preparing the required data flow diagram for Legal. March 20th delivery requires Legal sign-off by March 5th — this is the critical action item for leadership this week.`, type: "warn" as const },
    { title: "Mobile App v2 — On Track (61%)", content: `Strong sprint velocity improvement. Raj M.'s team is ahead of schedule on two milestones. April 5th launch date remains confident. Payment integration and offline mode are active and progressing.`, type: "ok" as const },
    { title: "Key Decisions Needed This Week", content: `1. Escalate API Migration v3 SSO vendor blocker (David P. / Exec sponsor).\n2. Confirm Legal sign-off deadline for Auth Overhaul by March 5th (James K. / Legal lead).\n3. Confirm QA resource availability for Project Phoenix March 4–7 window.`, type: "neutral" as const },
  ];
}

function buildSprintRetro() {
  return [
    { title: "Sprint 24 Overview — All Projects", content: `Sprint 24 ran February 17–28, 2026. Across all 5 active projects, the team committed to 173 story points and delivered 159 (92% aggregate hit rate) — above the trailing 3-sprint average of 87%.`, type: "ok" as const },
    { title: "Project Phoenix — Velocity: 45 pts (97%)", content: `Best sprint performance in 6 cycles. UI migration acceleration was the standout win. PHX-234 and PHX-241 resolved ahead of schedule. One carryover: PHX-249 (dark mode tokens). Team sentiment in Slack was consistently positive — 11 messages with positive signal, 1 flag on API contract versioning (self-resolved).`, type: "ok" as const },
    { title: "API Migration v3 — Velocity: 28 pts (74%)", content: `Significant underperformance due to the SSO vendor blocker. Three tickets (API-415, API-418, API-421) were blocked for 6 days with no forward motion. David's team performed well on the core endpoint refactor (API-398 through API-412), delivering 28 of 38 committed points on the unblocked work.`, type: "warn" as const },
    { title: "Design System 2.0 — Velocity: 22 pts (96%)", content: `Near-perfect sprint. DS-88 (form accessibility audit) moved into review in the final day. Token library merged and published with zero rollback issues across all consuming teams. Sofia's team posted the highest per-engineer point delivery of any team this sprint.`, type: "ok" as const },
    { title: "Auth Overhaul — Velocity: 18 pts (56%)", content: `Significantly below commitment due to GDPR review block. The unblocked scope (session management refactor) progressed well — AUTH-67 and AUTH-68 closed. MFA scoping not started. Team energy is low per Slack signals — 3 messages expressing frustration with the compliance delay.`, type: "warn" as const },
    { title: "Mobile App v2 — Velocity: 37 pts (93%)", content: `Solid sprint with push notification infrastructure completed ahead of schedule (MOB-112 through MOB-118). Three minor UI tickets deferred by team consensus — no critical path impact. Raj flagged in Thursday standup that Design System 2.0 adoption is the next dependency unlock.`, type: "ok" as const },
    { title: "Cross-Team Patterns & Recommendations", content: `Wins: Design System completion unblocks two downstream projects. Phoenix velocity at peak. Mobile App v2 improving consistently.\n\nConcerns: API Migration and Auth Overhaul are both vendor/compliance-blocked — these require external escalation, not internal sprint adjustments.\n\nRecommendation: Protect Phoenix sprint commitments from scope creep. Consider a shared "blocker resolution" track in Sprint 25 planning to address vendor and legal dependencies as first-class work items.`, type: "neutral" as const },
  ];
}

function buildRiskReport(project: typeof PROJECTS[0]) {
  const sections: { title: string; content: string; type?: "warn" | "ok" | "neutral"; severity?: string }[] = [];

  if (project.id === "api-migration-v3") {
    sections.push(
      { title: "Risk Summary", content: `API Migration v3 carries 4 active risks as of March 1, 2026. One is rated Critical, two are High, and one is Medium. The overall risk profile for this project is HIGH and requires immediate management attention.`, type: "warn", severity: "Critical" },
      { title: "RISK-01: SSO Vendor Dependency — CRITICAL", content: `Probability: High (80%). Impact: High — delays entire authentication layer and potentially the full March 3rd release.\nStatus: Active blocker. David P. escalated Feb 28th. No vendor response as of March 1st.\nMitigation: Executive escalation to vendor account manager. Contingency: scope March 3rd delivery to non-auth endpoints only.\nOwner: David P. / Executive Sponsor.`, type: "warn" },
      { title: "RISK-02: Test Coverage Below Threshold — HIGH", content: `Probability: High (70%). Impact: Medium — a release below the 80% coverage threshold will fail automated gate checks and require manual override.\nStatus: Currently at 55% coverage. At current sprint pace, will reach ~65% by March 3rd.\nMitigation: Allocate dedicated testing sprint in Sprint 25 if March 3rd scope is reduced. Assign one engineer exclusively to test coverage for the final 3 days.\nOwner: David P.`, type: "warn" },
      { title: "RISK-03: API Contract Versioning Conflict — HIGH", content: `Probability: Medium (50%). Impact: High — breaking changes in v3 API contracts could break Phoenix and Mobile App v2 integrations if not properly versioned.\nStatus: Flagged in Slack by Elena R. on Feb 28th. David P. confirmed versioning strategy in follow-up message — risk partially mitigated but not fully closed.\nMitigation: Formal API contract review with Phoenix and Mobile App v2 tech leads before any production deployment.\nOwner: David P., Elena R.`, type: "warn" },
      { title: "RISK-04: Documentation Gap — MEDIUM", content: `Probability: High (75%). Impact: Low-Medium — incomplete documentation will slow downstream team adoption post-release.\nStatus: Documentation not yet started (0% progress on this work item).\nMitigation: Assign documentation work in Sprint 25 regardless of release scope. Minimum viable docs (endpoint reference + auth flow) should be prioritized.\nOwner: David P.`, type: "neutral" },
    );
  } else if (project.id === "auth-overhaul") {
    sections.push(
      { title: "Risk Summary", content: `Auth Overhaul carries 3 active risks as of March 1, 2026. One is Critical, one is High, and one is Medium. The project is currently blocked on the Critical risk.`, type: "warn", severity: "Critical" },
      { title: "RISK-01: GDPR Compliance Review Block — CRITICAL", content: `Probability: High (90%). Impact: High — all identity-layer work is blocked until Legal approves the token storage architecture. This directly blocks MFA and the full March 20th delivery.\nStatus: Legal requested data flow diagram on Feb 27th. James K. is preparing it — estimated 2 days.\nMitigation: Prioritize data flow diagram completion (consider pairing a second engineer). Confirm Legal review SLA — if Legal needs 3+ days to review, March 20th is at risk even with the diagram delivered by March 4th.\nOwner: James K. / Legal Lead.`, type: "warn" },
      { title: "RISK-02: MFA Implementation Not Started — HIGH", content: `Probability: Medium (60%). Impact: High — MFA is a required deliverable for the March 20th release and has not been scoped or started.\nStatus: Dependency on identity provider integration (25% complete, blocked). If the GDPR blocker resolves by March 5th, MFA work has ~15 days — tight but feasible for a 5-person team.\nMitigation: Begin MFA architecture scoping now (parallel to GDPR resolution) so the team can start implementation the day the block is lifted.\nOwner: James K.`, type: "warn" },
      { title: "RISK-03: Security Audit Scheduling — MEDIUM", content: `Probability: Low (30%). Impact: High — the security audit is scheduled March 14–17 and requires the identity and MFA work to be complete before it can be meaningfully conducted.\nStatus: At current progress rate, the code will not be audit-ready by March 14th.\nMitigation: Either compress the audit window (risk: missed findings) or request a 3-day extension to March 23rd delivery. Recommend discussing with auditor team by March 5th.\nOwner: James K.`, type: "neutral" },
    );
  } else if (project.id === "project-phoenix") {
    sections.push(
      { title: "Risk Summary", content: `Project Phoenix carries 2 active risks as of March 1, 2026. Both are rated Medium. The overall risk profile is LOW — the project is well-managed and risks are actively being mitigated.`, type: "ok" },
      { title: "RISK-01: Load Testing Environment Delay — MEDIUM", content: `Probability: Medium (50%). Impact: Medium — a compressed QA window (from 4 days to 2.5 days) increases the risk of shipping defects.\nStatus: Load testing environment provisioning is 2 days behind. Elena flagged in March 1st standup. Not yet on the critical path.\nMitigation: Confirm QA team availability to run extended hours if window compresses. Identify top-priority test cases to run first if time is constrained.\nOwner: Elena R.`, type: "warn" },
      { title: "RISK-02: Design System 2.0 Token Migration — MEDIUM", content: `Probability: Low (25%). Impact: Medium — if Phoenix doesn't fully adopt the new Design System tokens before launch, there may be visual inconsistencies in the production release.\nStatus: Sofia's team confirmed availability to support Phoenix adoption the week of March 3rd. Dependency is being actively managed.\nMitigation: Allocate 1 Phoenix frontend engineer to token migration the week of March 3–7 before final QA begins.\nOwner: Elena R., Sofia M.`, type: "neutral" },
    );
  } else {
    sections.push(
      { title: "Risk Summary", content: `${project.name} carries 2 active risks as of March 1, 2026, both rated Medium. The project is in good health with manageable risk exposure.`, type: "ok" },
      { title: "RISK-01: Design System Dependency — MEDIUM", content: `Probability: Low (25%). Impact: Medium — full app store submission readiness depends on Design System 2.0 token adoption being complete.\nStatus: Sofia's team confirmed availability for the week of March 3rd. Timeline is tight but manageable.\nMitigation: Schedule a cross-team working session the week of March 3rd to complete token migration across all remaining screens.\nOwner: ${project.owner}`, type: "neutral" },
      { title: "RISK-02: App Store Submission Timeline — MEDIUM", content: `Probability: Medium (40%). Impact: Medium — App Store review processes typically take 5–7 business days, and any rejection would push past the April 5th launch date.\nStatus: Submission prep not yet started, scheduled March 22nd. This leaves minimal buffer.\nMitigation: Begin submission prep (metadata, screenshots, review guidelines checklist) by March 15th to allow time for potential rejection and resubmission.\nOwner: ${project.owner}`, type: "warn" },
    );
  }
  return sections;
}

function buildSwot() {
  return [
    { title: "Strengths", content: `Consistent sprint execution: 3 of 5 projects running at 90%+ velocity. Design System 2.0 completion eliminates a recurring cross-team dependency that slowed delivery in Q3–Q4 2025. Strong signal-to-noise in team communications — Slack and Jira integration providing clear early warnings on blockers. Raj M.'s Mobile App v2 team showing the strongest velocity improvement trend in the portfolio (+12% over 3 sprints).`, type: "ok" as const },
    { title: "Weaknesses", content: `Single-point-of-failure in authentication architecture: both API Migration v3 and Auth Overhaul are blocked on external factors (vendor docs, Legal review) — indicating insufficient early-stage dependency mapping. Test coverage culture is inconsistent — API Migration v3 at 55% vs. Phoenix at 84%. No shared escalation playbook for external blockers, causing ad-hoc escalation timelines. Auth Overhaul team morale is the lowest in the portfolio per Slack sentiment signals.`, type: "warn" as const },
    { title: "Opportunities", content: `Design System 2.0 handoff unlocks faster development across Phoenix and Mobile App v2 for the rest of Q1 — estimate 15–20% cycle time improvement on UI work. API Migration v3 contingency plan (non-auth release March 3rd) could unblock 3 downstream teams without waiting on vendor. Mobile App v2's ahead-of-schedule milestones create buffer time that could be used to accelerate the App Store submission prep, potentially moving the April 5th date to late March.`, type: "ok" as const },
    { title: "Threats", content: `SSO vendor non-responsiveness is an external threat with no internal mitigation path — executive escalation is the only lever. GDPR compliance review for Auth Overhaul introduces regulatory risk: if Legal identifies a fundamental architecture flaw (not just a documentation gap), the entire identity design may need to be reconsidered, extending the timeline by 4–6 weeks. Market timeline pressure: if Mobile App v2 slips past April 5th, the launch window conflicts with a competitor release planned for mid-April.`, type: "warn" as const },
    { title: "Strategic Recommendations", content: `Immediate: Escalate API Migration v3 vendor blocker today. Establish a 72-hour response SLA with the vendor.\n\nThis week: Confirm Legal review SLA for Auth Overhaul. If Legal cannot commit to March 5th sign-off, formally adjust the March 20th target before stakeholder expectations are set.\n\nThis sprint: Begin MFA architecture scoping in parallel with GDPR resolution. Allocate Mobile App v2 buffer time to Design System token migration (week of March 3rd).`, type: "neutral" as const },
  ];
}

// ─── Types ───────────────────────────────────────────────────────────────────
type Stage = "idle" | "selecting-project" | "pulling-data" | "rendering";
type ReportSection = { title: string; content: string; type?: "warn" | "ok" | "neutral"; severity?: string };

interface ReportConfig {
  id: string;
  title: string;
  scope: "project" | "portfolio";
  promptLabel: string;
  icon: React.ElementType;
}

interface Props {
  report: ReportConfig;
  onClose: () => void;
}

// ─── ReportGenerator Component ───────────────────────────────────────────────
export const ReportGenerator = ({ report, onClose }: Props) => {
  const [stage, setStage] = useState<Stage>("idle");
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const [dataPullStep, setDataPullStep] = useState(0);
  const [dataPullDone, setDataPullDone] = useState(false);
  const [reportSections, setReportSections] = useState<ReportSection[]>([]);
  const [visibleSections, setVisibleSections] = useState(0);

  const needsProject = report.scope === "project";

  // Start flow
  const handleStart = () => {
    if (needsProject) {
      setStage("selecting-project");
    } else {
      startDataPull(null);
    }
  };

  const handleProjectSelect = (project: typeof PROJECTS[0]) => {
    setSelectedProject(project);
    startDataPull(project);
  };

  const startDataPull = (project: typeof PROJECTS[0] | null) => {
    setStage("pulling-data");
    setDataPullStep(0);
    setDataPullDone(false);

    let step = 0;
    const advance = () => {
      step++;
      if (step < DATA_PULL_STEPS.length) {
        setDataPullStep(step);
        setTimeout(advance, 900 + Math.random() * 400);
      } else {
        // All steps done
        setTimeout(() => {
          setDataPullDone(true);
          const sections = generateSections(project);
          setReportSections(sections);
          setTimeout(() => {
            setStage("rendering");
            setVisibleSections(0);
            sections.forEach((_, i) => {
              setTimeout(() => setVisibleSections(i + 1), i * 320 + 200);
            });
          }, 700);
        }, 600);
      }
    };
    setTimeout(advance, 900 + Math.random() * 300);
  };

  const generateSections = (project: typeof PROJECTS[0] | null): ReportSection[] => {
    if (report.id === "progress-update" && project) return buildProgressReport(project);
    if (report.id === "exec-update") return buildExecUpdate();
    if (report.id === "sprint-retro") return buildSprintRetro();
    if (report.id === "risk-assessment" && project) return buildRiskReport(project);
    if (report.id === "swot") return buildSwot();
    return [];
  };

  const sectionBg: Record<string, string> = {
    warn: "border-l-4 border-status-warning bg-status-warning/5",
    ok: "border-l-4 border-status-success bg-status-success/5",
    neutral: "border-l-4 border-border bg-secondary/30",
  };

  const sectionIconColor: Record<string, string> = {
    warn: "text-status-warning",
    ok: "text-status-success",
    neutral: "text-muted-foreground",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10">
              <report.icon className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground text-sm">{report.title}</h2>
              <p className="text-xs text-muted-foreground">{report.promptLabel}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* IDLE — start screen */}
            {stage === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 flex flex-col items-center justify-center gap-6 text-center">
                <div className="p-4 rounded-2xl bg-accent/10">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Ready to generate</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    {needsProject
                      ? "We'll ask you to choose a project, then pull live data from Slack, Jira, email, and meeting transcripts to build your report."
                      : "We'll pull data from all connected sources across your portfolio and generate the report in moments."}
                  </p>
                </div>
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-4 h-4" />
                  {needsProject ? "Choose a Project" : "Generate Report"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* PROJECT SELECTION */}
            {stage === "selecting-project" && (
              <motion.div key="select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6">
                <p className="text-sm font-medium text-foreground mb-1">Select a project</p>
                <p className="text-xs text-muted-foreground mb-4">Choose the project you want this report generated for.</p>
                <div className="space-y-2">
                  {PROJECTS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleProjectSelect(p)}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-accent/50 hover:bg-accent/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${p.status === "on-track" ? "bg-status-success" : p.status === "at-risk" ? "bg-status-warning" : "bg-destructive"}`} />
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.owner} · {p.progress}% complete · due {p.dueDate}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* DATA PULLING */}
            {stage === "pulling-data" && (
              <motion.div key="pulling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 flex flex-col items-center gap-6">
                <div className="w-full max-w-sm">
                  <p className="text-center text-sm font-semibold text-foreground mb-6">
                    Pulling in data from sources
                    {selectedProject && <span className="text-accent"> — {selectedProject.name}</span>}
                  </p>
                  <div className="space-y-3">
                    {DATA_PULL_STEPS.map((step, i) => {
                      const done = i < dataPullStep || dataPullDone;
                      const active = i === dataPullStep && !dataPullDone;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: i <= dataPullStep || dataPullDone ? 1 : 0.3, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3"
                        >
                          <div className={`p-1.5 rounded-lg transition-colors ${done ? "bg-status-success/10" : active ? "bg-accent/10" : "bg-secondary"}`}>
                            {done ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
                            ) : (
                              <step.icon className={`w-3.5 h-3.5 ${active ? "text-accent animate-pulse" : "text-muted-foreground"}`} />
                            )}
                          </div>
                          <span className={`text-xs transition-colors ${done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                          {active && (
                            <span className="ml-auto flex gap-0.5">
                              {[0, 1, 2].map((d) => (
                                <span key={d} className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: `${d * 150}ms` }} />
                              ))}
                            </span>
                          )}
                          {done && <CheckCircle2 className="ml-auto w-3 h-3 text-status-success" />}
                        </motion.div>
                      );
                    })}
                  </div>
                  {dataPullDone && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs text-status-success mt-6 font-medium">
                      All sources processed. Generating report…
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {/* REPORT RENDERED */}
            {stage === "rendering" && (
              <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-4">
                {selectedProject && (
                  <div className="flex items-center gap-2 pb-3 border-b border-border">
                    <div className={`w-2 h-2 rounded-full ${selectedProject.status === "on-track" ? "bg-status-success" : selectedProject.status === "at-risk" ? "bg-status-warning" : "bg-destructive"}`} />
                    <span className="text-xs font-medium text-muted-foreground">{selectedProject.name} · {selectedProject.progress}% complete · {selectedProject.owner}</span>
                  </div>
                )}
                {reportSections.slice(0, visibleSections).map((section, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl ${sectionBg[section.type || "neutral"]}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {section.type === "warn" && <AlertTriangle className={`w-3.5 h-3.5 ${sectionIconColor["warn"]}`} />}
                      {section.type === "ok" && <CheckCircle2 className={`w-3.5 h-3.5 ${sectionIconColor["ok"]}`} />}
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">{section.title}</h4>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{section.content}</p>
                  </motion.div>
                ))}
                {visibleSections >= reportSections.length && reportSections.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-status-success" />
                      Report generated · March 1, 2026
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors">
                        <Download className="w-3.5 h-3.5" /> Export PDF
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                        <ArrowUpRight className="w-3.5 h-3.5" /> Share
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Report config export ────────────────────────────────────────────────────
export const REPORT_CONFIGS: ReportConfig[] = [
  { id: "progress-update", title: "Progress Report", scope: "project", promptLabel: "Per project · Burndown, milestones, blockers", icon: BarChart3 },
  { id: "exec-update", title: "Executive Weekly Update", scope: "portfolio", promptLabel: "All projects · Leadership summary", icon: ArrowUpRight },
  { id: "sprint-retro", title: "Sprint Retrospective", scope: "portfolio", promptLabel: "All projects · Velocity, wins, blockers", icon: TrendingUp },
  { id: "risk-assessment", title: "Risk Assessment Report", scope: "project", promptLabel: "Per project · Risk register with mitigations", icon: Shield },
  { id: "swot", title: "SWOT Analysis", scope: "portfolio", promptLabel: "Portfolio-wide · Strategic insights", icon: Target },
  { id: "team-health", title: "Team Health Check", scope: "portfolio", promptLabel: "All projects · Workload, morale, patterns", icon: Users },
];

export type { ReportConfig };
