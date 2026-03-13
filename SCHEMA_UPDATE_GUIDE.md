# Agilow — Schema Update Guide
**Version:** 1.0
**Date:** March 13, 2026
**Status:** Active

This document explains how to update the signal schema and database tables when the data model needs to change.
Always read this before making any schema change.

---

## The Three Files That Must Stay In Sync

Every schema change touches all three of these. Never update one without updating the others.

| File | What it defines |
|---|---|
| `DATABASE_TABLES.md` | Canonical list of all 17 tables and their columns |
| `ground_truth_schema.json` | The JSON Schema that validates every signal label entry |
| `SCHEMA_UPDATE_GUIDE.md` | This file — the rules for making changes |

---

## Types of Changes & How to Make Them

---

### 1. Add a new sub-attribute to an existing primary attribute

**Example:** Adding `affected_teams` to `Blocker`.

**Step 1 — `DATABASE_TABLES.md`**
Add the new column to the `blockers` table row.
```
| `blockers` | `id`, `project_id`, `summary`, `severity`, `owner`, `status`, `blocking_since`, `affected_teams`, `created_at`, `updated_at` |
```

**Step 2 — `ground_truth_schema.json`**
In the `blocker` entry under `sub_attribute_fields`, add:
```json
{
  "field": "affected_teams",
  "type": "array",
  "required": false,
  "reasoning_required": false,
  "description": "List of team names affected by this blocker"
}
```

**Step 3 — Reasoning rule**
Decide: does this field require reasoning?
- If it is a judgment call (e.g. a severity level, a priority) → `reasoning_required: true`
- If it is an explicit fact (e.g. a name, a date, a list of team names stated verbatim) → `reasoning_required: false`

Update the Reasoning Rules table in `DATABASE_TABLES.md` if needed.

---

### 2. Add a new enumerated value to an existing sub-attribute

**Example:** Adding `"cancelled"` to `Task.status`.

**Step 1 — `DATABASE_TABLES.md`**
Update the column definition in the `tasks` row:
```
`status` (todo / in_progress / done / slipped / cancelled)
```

**Step 2 — `ground_truth_schema.json`**
Find the `task` entry in `primary_attributes`, find `status` in `sub_attribute_fields`, and add `"cancelled"` to the `allowed_values` array.

**Step 3 — Existing labels**
Existing ground truth entries are unaffected. The new value is simply available from this point forward.

---

### 3. Add a new primary attribute

**Example:** Adding `scope_change` as a new primary attribute alongside Blocker, Risk, etc.

**Step 1 — `DATABASE_TABLES.md`**
- Add a new row to the 17 tables list for `scope_changes` with its columns
- Add a new row to the Primary Attributes table with its sub-attributes
- Update the `primary_attribute` enum list everywhere it appears

**Step 2 — `ground_truth_schema.json`**
- Add `"scope_change"` to the `allowed_values` array of `primary_attribute`
- Add a new entry to `primary_attributes` defining all its `sub_attribute_fields`

**Step 3 — `signal_provenance` table**
The `attribute_type` column in `signal_provenance` also holds this enum. Update `DATABASE_TABLES.md` to add `scope_change` there too.

**Step 4 — `attribute_updates` table**
Same — `primary_attribute` column enum must include the new type.

---

### 4. Add a new source type

**Example:** Adding `notion` as a data source.

**Step 1 — `DATABASE_TABLES.md`**
Update the `sources.type` column enum:
```
type (slack / granola / linear / email / google_drive / github / whatsapp / phone / notion)
```

**Step 2 — `ground_truth_schema.json`**
Add `"notion"` to the `source_type` allowed values array.

**Step 3 — `source_ref` shape**
Document how `source_ref` is structured for this new source type in the `source_ref` description field:
```
Notion: { "page_id": "abc123", "block_id": "def456" }
```

---

### 5. Remove a sub-attribute or primary attribute

**Do not delete existing ground truth entries that used the old field.**
Mark the field as `"deprecated": true` in `ground_truth_schema.json` instead of removing it.
Remove it from `DATABASE_TABLES.md` only when all existing labels using it have been reviewed and migrated.

---

## What Never Changes

These three things are structurally fixed. Changes here would break the entire pipeline and require a full migration:

| Fixed element | Why |
|---|---|
| Top-level signal structure: `context_window`, `signal`, `attribute_updates` | Everything is built on this flow |
| `primary_attribute_action` values: `create` / `update` | Core logic of how signals write to state |
| Four-level reasoning model (project → primary attribute → sub-attribute → value) | How AI demonstrations are structured |

---

## Versioning

Every time you make a schema change:
1. Increment the version number at the top of this file and `ground_truth_schema.json`
2. Add an entry to the changelog below
3. Commit all three files together in one git commit

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-03-13 | Initial schema. 6 primary attributes: blocker, risk, decision, task, milestone, lessons_learned. 8 source types. |

---

*Last updated: 2026-03-13*
