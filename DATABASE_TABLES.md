# Agilow — Database Tables Reference
**Version:** 1.0
**Date:** March 13, 2026
**Status:** Ground Truth — do not change without updating the product spec

This file is the canonical reference for all database tables in the Agilow system.
Rows = table names. Columns listed per table.

---

## All 17 Tables

| Table | Columns |
|---|---|
| **`workspaces`** | `id`, `name`, `created_at` |
| **`users`** | `id`, `workspace_id`, `name`, `email`, `role`, `created_at` |
| **`project_members`** | `id`, `project_id`, `user_id`, `role`, `created_at` |
| **`sources`** | `id`, `workspace_id`, `type` (slack / granola / linear / email / google_drive / github / whatsapp / phone), `name`, `credentials`, `status` (active / inactive), `created_at`, `last_synced_at` |
| **`raw_messages`** | `id`, `source_id`, `source_type`, `source_ref` (json: channel+timestamp or meeting+line_range), `raw_content`, `authored_at`, `ingested_at` |
| **`context_windows`** | `id`, `source_id`, `source_type`, `raw_message_ids` (array), `raw_content`, `start_ref`, `end_ref`, `created_at` |
| **`projects`** | `id`, `workspace_id`, `name`, `description`, `owner`, `status` (in_progress / not_started / blocked / at_risk / complete), `progress`, `due_date`, `objective`, `created_at`, `updated_at` |
| **`project_aliases`** | `id`, `project_id`, `alias`, `created_at` |
| **`signals`** | `id`, `context_window_id`, `raw_content`, `confidence` (high / medium / low), `labeled_by`, `labeled_at`, `ambiguity_flags` (json array) |
| **`attribute_updates`** | `id`, `signal_id`, `project_id`, `primary_attribute` (blocker / risk / decision / task / milestone / lessons_learned), `primary_attribute_action` (create / update), `existing_attribute_ref`, `project_reasoning`, `primary_attribute_reasoning` |
| **`sub_attribute_updates`** | `id`, `attribute_update_id`, `field`, `value`, `reasoning` |
| **`signal_provenance`** | `id`, `signal_id`, `attribute_id`, `attribute_type` (blocker / risk / decision / task / milestone / lessons_learned), `action` (create / update), `created_at` |
| **`blockers`** | `id`, `project_id`, `summary`, `severity` (critical / high / medium / low), `owner`, `status` (open / in_progress / resolved / wont_fix), `blocking_since`, `created_at`, `updated_at` |
| **`risks`** | `id`, `project_id`, `summary`, `severity` (critical / high / medium / low), `likelihood` (high / medium / low), `status` (open / mitigated / resolved), `owner`, `mitigation_plan`, `created_at`, `updated_at` |
| **`decisions`** | `id`, `project_id`, `summary`, `made_by`, `made_at`, `impact` (high / medium / low), `rationale`, `created_at`, `updated_at` |
| **`tasks`** | `id`, `project_id`, `summary`, `owner`, `due_date`, `status` (todo / in_progress / done / slipped), `priority` (high / medium / low), `created_at`, `updated_at` |
| **`milestones`** | `id`, `project_id`, `name`, `status` (upcoming / in_progress / complete / missed), `due_date`, `completion_date`, `created_at`, `updated_at` |
| **`lessons_learned`** | `id`, `project_id`, `value`, `value_reasoning`, `created_at` |

---

## Table Groups & Pipeline Flow

```
Group 1 — Sources
  sources, raw_messages
      ↓ chunked into
Group 2 — Context
  context_windows
      ↓ labeled by human or AI
Group 3 — Project Definitions
  projects, project_aliases
      ↓ signals attributed to projects
Group 4 — Signals & Labels
  signals → attribute_updates → sub_attribute_updates
      ↓ applied to project state
Group 5 — Project State   ← dashboard reads here
  blockers, risks, decisions, tasks, milestones, lessons_learned
      ↑ traced back via
Group 6 — Provenance
  signal_provenance
      (workspace & users span all groups)
Group 7 — Workspace & Users
  workspaces, users, project_members
```

---

## Primary Attributes & Their Sub-attributes

| Primary Attribute | Sub-attributes |
|---|---|
| **Blocker** | `summary`, `severity` (critical/high/medium/low), `owner`, `status` (open/in_progress/resolved/wont_fix), `blocking_since` |
| **Risk** | `summary`, `severity` (critical/high/medium/low), `likelihood` (high/medium/low), `status` (open/mitigated/resolved), `owner`, `mitigation_plan` |
| **Decision** | `summary`, `made_by`, `made_at`, `impact` (high/medium/low), `rationale` |
| **Task** | `summary`, `owner`, `due_date`, `status` (todo/in_progress/done/slipped), `priority` (high/medium/low) |
| **Milestone** | `name`, `status` (upcoming/in_progress/complete/missed), `due_date`, `completion_date` |
| **LessonsLearned** | `value`, `value_reasoning` *(no sub-attributes — scalar value only)* |

---

## Reasoning Rules

Reasoning is required at four levels when the inference is a judgment call (not an explicit fact like a name or date):

| Level | Field | Required when |
|---|---|---|
| 1 | `project_reasoning` | Always |
| 2 | `primary_attribute_reasoning` | Always |
| 3 | Sub-attribute `reasoning` | When the value requires judgment (severity, likelihood, impact, priority, status) |
| 4 | Value-level reasoning | When choosing between enumerated values (e.g. why high vs medium) — included in level 3 field |

Explicit facts (a person's name, a date stated verbatim, a direct quote) do not require reasoning.

---

*Last updated: 2026-03-13*
