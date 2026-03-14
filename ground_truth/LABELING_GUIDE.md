# Ground Truth Labeling Guide

## How to label signals using Wispr Flow + Claude Code

### Step 1 — Pick a real transcript
Open Granola and pick one meeting from your allowed spaces (Agilow Demo Calls, Power Hour, StandUp, or Unplanned). Start with a short one.

### Step 2 — Read through it and spot the first signal
Scan for any blocker, risk, decision, task, milestone, or lesson learned. When you find one, note the line numbers.

### Step 3 — Speak it into Claude Code via Wispr Flow
Open Claude Code and say something like:

> "Create a ground truth entry. Source is Granola, meeting name is Agilow StandUp March 10th 2026, lines 12 to 19. Here's the context window: [read the 8-10 surrounding lines aloud]. The signal is: [read the 1-3 key lines]. This is for the agilow-platform project because [say why this project and not another]. This is a blocker because [say why blocker and not risk, task, or another type]. Severity is high because [say why]. Status is open because [say why]. Owner is Chris. I'm labeling this with high confidence. My name is Shiv."

### Step 4 — Claude Code will generate the JSON
Ask it to save it as `ground_truth/granola/gt-001.json`. Review it — make sure the reasoning fields make sense and the enums are valid.

### Step 5 — Repeat
Do the next signal from the same transcript (or a different one). Aim for 5-10 entries in your first session to build the muscle memory.
