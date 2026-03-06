# Survey Analysis Orchestrator

This project is a multi-agent survey analysis pipeline. When the user runs `/analyze-survey`, you coordinate specialized subagents through a four-stage pipeline to clean survey data, produce a verified interpretive analysis, generate a professional HTML report, and create a visual executive presentation. Stage 4 uses a single creative concept team followed by production subagents.

## Project Structure

- `.claude/agents/` — agent definitions:
  - Stage 1 subagents: `data-cleaner`, `data-processor`
  - Stage 2 subagents: `insight-explorer`, `insight-challenger`, `analysis-synthesizer`
  - Stage 3 subagents: `content-writer`, `html-designer`, `report-verifier`
  - Stage 4 concept team: `visual-storyteller`, `narrative-strategist`, `script-writer`
  - Stage 4 production subagents: `presentation-designer`, `presentation-reviewer`
- `.claude/skills/` — skills for analysis planning, data processing, statistical analysis reference, analysis synthesis, report writing, report review, HTML report design, presentation narrative, HTML presentation design, and presentation review
- `.claude/commands/analyze-survey.md` — the primary entry point command
- `scripts/scan_columns.py` — Python script that pre-scans data files and produces column metadata
- `scripts/validate_outputs.py` — Python script that validates Stage 1 outputs for internal consistency
- `input/` — user places survey data file (CSV/Excel) and optional supporting docs here
- `workspace/` — all runtime outputs (gitignored)

## Prerequisites

- **Agent teams** must be enabled: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is set to `"1"` in `.claude/settings.json` under `env`. This is required for the Stage 4 Phase 1 concept team only.
- **python-docx** is required for converting .docx survey instruments to plain text during pre-flight. Install via `pip install python-docx` if not present.

## File Path Conventions

All paths referenced in subagent and teammate prompts must be **absolute paths** rooted at the project directory.

- **User input:** `input/` (survey data file) and `input/supporting/` (objectives, methodology docs)
- **Cleaned data:** `workspace/cleaned/` → `cleaned_data.csv`, `cleaning_summary.json`, `cleaning_report.md`
- **Analysis outputs:** `workspace/analysis/` → `column_summary.json`, `analysis_plan.json`, `analysis_summary.json`, `refined_analysis.json`
  - `workspace/analysis/frequency_tables/` → `freq_{column_name}.csv`
  - `workspace/analysis/banner_tables/` → `banner_{demographic}_{question}.csv`
  - `workspace/analysis/significance_tests/` → `significance_results.csv`, `expected_{demographic}_{question}.csv`
  - `workspace/analysis/derived_importance.csv` — correlation of brand attributes (Q5) with purchase intent (Q6)
  - `workspace/analysis/insight_reports/` → `explorer_insights.json`, `challenger_verification.json`
- **Report sections:** `workspace/reports/sections/` → `01_executive_summary.md` through `07_appendix.md`
- **Final report:** `workspace/reports/final_report.html` — self-contained HTML with embedded CSS
- **Report verification:** `workspace/reports/verification_report.json` — Verifier's structured verdict
- **Presentation outputs:** `workspace/presentations/` → `presentation_script.md`, `executive_briefing.html`
- **Pipeline log:** `workspace/pipeline.log` — timestamped record of each pipeline run

## Pipeline Stages

### Stage 1: Data Processing (sequential subagents via Task tool)

1. **Pre-flight checks:** Verify `input/` contains exactly one CSV or Excel file. Clean the workspace (preserving `pipeline.log`). Create workspace subdirectories.

2. **Column scan:** Run `python scripts/scan_columns.py` via Bash. Produces `workspace/analysis/column_summary.json`.

3. **Analysis planning:** Classify columns as demographic/question/metadata. Write `workspace/analysis/analysis_plan.json` with category mappings.

4. **Data cleaning:** Invoke `data-cleaner` subagent. Verify `cleaned_data.csv` exists with rows > 0.

5. **Statistical analysis:** Invoke `data-processor` subagent. Produces frequency tables, banner tables, chi-square tests, and derived importance analysis. Verify `analysis_summary.json` exists.

6. **Output validation:** Run `python scripts/validate_outputs.py`. Stop if validation fails.

### Stage 2: Analysis Refinement (3 sequential subagents)

Three subagents run in sequence, connected by intermediate JSON files:

1. **Insight Explorer** (Sonnet) — reads statistical outputs (including `derived_importance.csv`), generates thematic insight claims with evidence. Writes `workspace/analysis/insight_reports/explorer_insights.json`.

2. **Insight Challenger** (Sonnet) — reads the Explorer's insights, opens source CSVs to verify every number. Writes `workspace/analysis/insight_reports/challenger_verification.json` with VERIFIED/CHALLENGED/PARTIAL verdicts per claim.

3. **Analysis Synthesizer** (Sonnet) — reads the Challenger's verification report, produces the structured analysis. Writes `workspace/analysis/refined_analysis.json`.

**Output:** `workspace/analysis/refined_analysis.json` — structured JSON containing survey context, respondent profile, themed findings with verified statistics and source references, significant cross-tab summary, derived importance ranking, evidence-based conclusions, and data limitations.

**Graceful degradation:** If the Synthesizer fails to produce a usable analysis, falls back to single-agent report writing against raw CSVs.

### Stage 3: Report Production (3 sequential subagents with correction loop)

Three subagents run in sequence with an orchestrator-driven correction loop:

1. **Content Writer** (Sonnet) — transforms `refined_analysis.json` into professional report prose. Writes 7 markdown section files to `workspace/reports/sections/`. The key findings section should include a "Key Drivers of Purchase Intent" subsection based on derived importance results.

2. **HTML Designer** (Opus) — builds a self-contained HTML page from the Writer's sections using a multi-pass strategy. Consulting-firm aesthetic: navy/slate/white palette, serif headings, clean tables, inline SVG charts. No external dependencies. Includes a mandatory self-check pass that verifies every statistic against source CSVs before finishing. Writes `workspace/reports/final_report.html`.

3. **Report Verifier** (Sonnet) — reads the final HTML and verifies every statistic against raw source CSVs (not the refined JSON, to catch synthesis errors). Writes `workspace/reports/verification_report.json` with verdict and issues list.

**Correction loop:** If the Verifier returns NEEDS_CORRECTION, the orchestrator re-invokes the Writer and/or Designer with specific correction instructions, then re-verifies. Max 3 rounds.

**Output:** `workspace/reports/final_report.html` — self-contained HTML that works from `file://`, includes `@media print` CSS for PDF generation.

### Stage 4: Presentation Production (concept team + production subagents)

The executive briefing is produced in two phases:

**Phase 1 — Concept Team (agent team with broadcast dialogue):**
- **Visual Storyteller** (Sonnet) — divergent creative thinker. Proposes concepts, hero statistics, narrative arcs, and surprising angles.
- **Narrative Strategist** (Sonnet) — convergent editorial thinker. Evaluates concepts for executive audience fit, pushes for the most compelling findings.
- **Script Writer** (Sonnet) — observer/synthesizer. Watches the Storyteller-Strategist dialogue and produces `workspace/presentations/presentation_script.md` when the concept is locked.

The concept team dialogues via broadcast for 2-3 exchanges, then converges. The main session acts as lead, monitoring convergence and shutting down the team when the script is complete. The locked script becomes the sole content input for Phase 2.

**Phase 2 — Production Subagents (sequential with revision loop):**
- **Presentation Designer** (Opus) — builds the HTML executive briefing from the locked script using a multi-pass strategy. Writes `workspace/presentations/executive_briefing.html`.
- **Presentation Reviewer** (Sonnet) — evaluates visual execution (not narrative structure, which is locked). Returns APPROVED or NEEDS_REVISION with prioritized improvements.

**Revision loop:** If the Reviewer returns NEEDS_REVISION, the orchestrator re-invokes the Designer with the feedback, then re-reviews. Max 3 rounds.

**Output:** `workspace/presentations/executive_briefing.html` — self-contained, scroll-snap HTML executive briefing with large metric callouts, embedded SVG charts, and slide-style navigation. Distinct from the Stage 3 report (visual, spacious, optimized for screen sharing).

## Subagent Patterns

When invoking subagents via the Task tool, always construct the prompt to include:
- The absolute file paths for all inputs
- The absolute output directory or file path
- A clear statement of what the subagent should produce
- If this is a correction/revision round, the specific issues to fix

### Intermediate File Handoffs

Subagents communicate through intermediate files rather than broadcasts:

| File | Producer | Consumer |
|---|---|---|
| `derived_importance.csv` | Data Processor | Insight Explorer, Content Writer, Storyteller, Strategist |
| `explorer_insights.json` | Insight Explorer | Insight Challenger |
| `challenger_verification.json` | Insight Challenger | Analysis Synthesizer |
| `refined_analysis.json` | Analysis Synthesizer | Content Writer, Storyteller, Strategist, Script Writer |
| `sections/*.md` | Content Writer | HTML Designer, Script Writer (additional context) |
| `verification_report.json` | Report Verifier | Orchestrator (drives correction loop) |
| `presentation_script.md` | Script Writer | Presentation Designer |

### Concept Team (Stage 4 Phase 1)

The concept team is the only agent team in the pipeline. It uses broadcast dialogue between the Storyteller and Strategist, with the Script Writer observing. The main session acts as lead:
- Monitors convergence (look for "CONCEPT LOCKED" + "STRATEGY CONFIRMED")
- Nudges if stalled after 6+ broadcasts
- Shuts down via `shutdown_request` and cleans up via `TeamDelete`

## Error Handling

- If the data file cannot be read (corrupted, unsupported format), stop immediately and tell the user.
- If the analysis plan identifies 0 question columns, stop and ask the user to verify the data format.
- If a subagent fails or returns an error, log it and report to the user. Do not silently continue.
- If a required output file does not exist after a subagent completes, retry once before reporting failure.
- If an orchestrator-level Python script (`scan_columns.py`, `validate_outputs.py`) fails, retry once before reporting failure.
- If the concept team fails to spawn (e.g., `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` not enabled), report the error and suggest checking settings.json.
- If the concept team stalls (6+ broadcasts without convergence), nudge teammates to converge.
- If `refined_analysis.json` is missing or empty after Stage 2, fall back to single-agent report writing.
- If Stage 4 fails to produce `executive_briefing.html`, log the error but do not fail the pipeline — the Stage 3 report is the primary output.
- All errors and retries are logged to `workspace/pipeline.log` with timestamps.

## Filename Conventions

Column names are sanitized for use in filenames: special characters become underscores, and names longer than 60 characters are truncated with an 8-character MD5 hash suffix for uniqueness. This convention is shared across all template scripts and the validator (`sanitize_filename` / `sanitize_name`).

## Python Environment

Required packages: `pandas`, `scipy`, `openpyxl`, `python-docx` (see `requirements.txt`).
If not installed, run `pip install -r requirements.txt` before executing Python scripts.
