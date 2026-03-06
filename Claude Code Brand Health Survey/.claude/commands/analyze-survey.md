---
name: analyze-survey
description: Run the full survey analysis pipeline on data in the input/ folder
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, Skill
---

# Survey Analysis Pipeline

Run the complete survey analysis pipeline on the data file in the `input/` folder. This pipeline has four stages: data processing (subagents), analysis refinement (subagents), report production (subagents with correction loop), and presentation production (concept team + production subagents).

## Pipeline Logging

Throughout the pipeline, append timestamped entries to `workspace/pipeline.log`. Use this Bash pattern:

```
echo "[$(date '+%Y-%m-%d %H:%M:%S')] MESSAGE" >> workspace/pipeline.log
```

Log at these points: pipeline start, each step start/completion, any errors or retries, team creation/shutdown, and pipeline end.

## Pre-flight Checks

1. **Find the data file:** Use Glob to find CSV or Excel files in `input/`. There should be exactly one data file (`.csv`, `.xlsx`, or `.xls`). If zero files found, tell the user: "No survey data file found in input/. Please place a CSV or Excel file there and try again." If multiple data files found, tell the user: "Multiple data files found in input/. Please keep only one and try again." Record the absolute path to the data file.

2. **Clean workspace:** Remove all previous outputs to ensure a fresh run. Run via Bash:
   ```
   rm -rf workspace/cleaned workspace/analysis workspace/reports workspace/presentations workspace/scripts
   ```
   This preserves `workspace/pipeline.log` while removing all generated data, analysis outputs, and reports.

3. **Create workspace directories:** Run via Bash:
   ```
   mkdir -p workspace/cleaned workspace/analysis/frequency_tables workspace/analysis/banner_tables workspace/analysis/significance_tests workspace/analysis/insight_reports workspace/reports/sections workspace/presentations workspace/scripts
   ```

4. **Check Python dependencies:** Run via Bash: `python -c "import pandas; import scipy; import openpyxl; print('Dependencies OK')"`. If it fails, run `pip install -r requirements.txt` and retry.

5. **Convert .docx supporting documents to plain text:** Check `input/supporting/` for any `.docx` files. For each one, convert it to a `.txt` file in the same directory using Python:
   ```
   python -c "
   from docx import Document
   import sys, pathlib
   p = pathlib.Path(sys.argv[1])
   doc = Document(str(p))
   text = '\n'.join(para.text for para in doc.paragraphs)
   p.with_suffix('.txt').write_text(text, encoding='utf-8')
   print(f'Converted {p.name} -> {p.with_suffix(\".txt\").name}')
   " "input/supporting/FILENAME.docx"
   ```
   If the conversion fails (e.g., `python-docx` not installed), run `pip install python-docx` and retry once. If it still fails, log a warning and continue — the pipeline can fall back to other supporting documents.

6. **Initialize the log:** Run via Bash:
   ```
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] Pipeline started — data file: {DATA_FILE_NAME}" >> workspace/pipeline.log
   ```

## Stage 1: Data Processing

### Step 1.1 — Scan Columns

Run via Bash: `python scripts/scan_columns.py`

If the script fails, log the error and retry once: `python scripts/scan_columns.py`. If it fails again, stop and report the error to the user.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 1.1 — Column scan complete" >> workspace/pipeline.log`

This produces `workspace/analysis/column_summary.json`. Read this file to understand the dataset structure.

### Step 1.2 — Classify Columns and Create Analysis Plan

Read `workspace/analysis/column_summary.json`. Also read the survey instrument at `input/supporting/acme_brand_health_survey.txt` (converted from .docx during pre-flight) or `input/supporting/acme_brand_health_survey.docx` if the .txt is not available — this contains the full question wording, response options, and scale definitions, which are essential for correctly classifying columns and understanding what each question measures. For each column, classify it as demographic, question, or metadata using the instrument as your primary guide and these rules as fallback:

**Demographic columns** — match ANY of:
- Column name contains (case-insensitive): age, gender, sex, race, ethnicity, income, education, region, location, state, city, zip, department, role, title, tenure, employment, marital, household, occupation, company, industry, country, salary
- Low cardinality (2–15 unique values) with categorical-looking sample values
- Age range patterns (e.g., "18-24", "25-34")

**Question columns** — match ANY of:
- Name starts with or contains "Q" + number (Q1, Q2, Q2a)
- Values look like Likert scale (1-5, 1-7, "Strongly agree"..."Strongly disagree")
- Name contains: satisfaction, rating, agree, important, likely, recommend, score, opinion, preference

**Metadata columns** — exclude from analysis:
- IDs, timestamps, emails, IP addresses, browser info

**Open-ended columns** — high cardinality text (>50 unique sentence-length values). Include in `question_columns` AND `open_ended_columns`.

Check `input/supporting/` for any documents. If found, read them and extract project objectives text.

**Category collapsing:** For each demographic column with more than 3 unique values (check `unique_count` in `column_summary.json`), generate a `category_mappings` entry that maps every original value to one of exactly 3 collapsed group labels. Use the heuristics from the analysis-planning skill: collapse adjacent ranges for ordinal data (age, income), group by attainment tier for education, etc. Demographics with 3 or fewer unique values are left unmapped. Include the mappings in `analysis_plan.json` — the data-processor will apply them before creating banner tables and chi-square tests.

Write the classification to `workspace/analysis/analysis_plan.json`:
```json
{
  "demographic_columns": [...],
  "question_columns": [...],
  "open_ended_columns": [...],
  "metadata_columns": [...],
  "unclassified_columns": [...],
  "category_mappings": {},
  "project_objectives": "text or null",
  "total_rows": N,
  "total_columns": N,
  "notes": "any special considerations"
}
```

**Validation:** If `question_columns` is empty, stop and tell the user: "Could not identify any survey question columns. Please check the data format."

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 1.2 — Analysis plan created: {N} demographics, {N} questions" >> workspace/pipeline.log`

Report to the user: "Analysis plan created: {N} demographic columns ({M} with category collapsing), {N} question columns, {N} metadata columns."

### Step 1.3 — Clean Data

Invoke the **data-cleaner** subagent via the Task tool:

```
Clean the survey data file at {ABSOLUTE_PATH_TO_DATA_FILE}.
Write all outputs to {ABSOLUTE_PATH_TO_WORKSPACE}/cleaned/.
The output directory already exists.
```

After it completes, run these sanity checks before proceeding:

1. Read `workspace/cleaned/cleaned_data.csv` (first few lines). If the file doesn't exist, report the error and stop.
2. Read `workspace/cleaned/cleaning_summary.json`. Verify:
   - `cleaned_rows` is greater than 0. If zero rows remain, stop and tell the user: "All rows were removed during cleaning — the dataset may be empty or malformed."
   - `columns` matches the original column count from `column_summary.json`. If columns were lost, report a warning.
3. Confirm all expected columns from `column_summary.json` are present in the cleaned CSV header row.

If any check fails, report the specific issue and stop — do not proceed to statistical analysis with invalid cleaned data.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 1.3 — Data cleaning complete: {N} rows retained" >> workspace/pipeline.log`

Report to the user: "Data cleaning complete ({N} rows retained). See workspace/cleaned/cleaning_report.md for details."

### Step 1.4 — Statistical Analysis

Invoke the **data-processor** subagent via the Task tool:

```
Perform statistical analysis on the cleaned survey data.

Cleaned data file: {ABSOLUTE_PATH}/workspace/cleaned/cleaned_data.csv
Analysis plan: {ABSOLUTE_PATH}/workspace/analysis/analysis_plan.json
Output directory: {ABSOLUTE_PATH}/workspace/analysis/

The output directory and its subdirectories (frequency_tables/, banner_tables/, significance_tests/) already exist.

Follow your data-processing skill instructions to produce:
1. Frequency tables for every question column → frequency_tables/
2. Banner tables (cross-tabs) for every demographic × question combination → banner_tables/
3. Chi-square significance tests for every banner table → significance_tests/significance_results.csv
4. Derived importance analysis (Q5 attributes vs Q6 purchase intent) → derived_importance.csv
5. Analysis summary → analysis_summary.json
```

After it completes, verify `workspace/analysis/analysis_summary.json` exists. Read it.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 1.4 — Statistical analysis complete: {N} freq tables, {N} banner tables, {N} significant" >> workspace/pipeline.log`

Report a summary to the user: "{N} frequency tables, {N} banner tables, {N} significant results. Derived importance analysis complete."

### Step 1.5 — Validate Outputs

Run via Bash: `python scripts/validate_outputs.py`

If the script fails to execute (e.g., import error, file lock), log the error and retry once. If it fails again, stop and report the error to the user.

This checks all Stage 1 outputs for internal consistency:
- Cleaning: row counts match summary, all columns preserved
- Frequency tables: percentages sum to ~100%, counts sum to valid_n
- Banner tables: row marginal totals match frequency tables, pct rows sum to ~100%
- Significance tests: valid chi-square/p-values, df matches expected table dimensions, significance flags match p-values
- Derived importance: 11 attributes present, correlations in [-1,1], p-values in [0,1]
- Summary: reported file counts match actual files on disk

If validation **passes**:

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 1.5 — Validation passed" >> workspace/pipeline.log`

Report to the user: "Output validation passed — all Stage 1 outputs are internally consistent." Then continue to Stage 2.

If validation **fails**, log the errors and report the specific errors to the user and **stop**. Do not proceed to Stage 2 with invalid data.

## Stage 2: Analysis Refinement (Sequential Subagents)

This stage uses three sequential subagents — Explorer, Challenger, Synthesizer — connected by intermediate JSON files. No agent team is required.

**Data flow:** Statistical outputs → Explorer writes `explorer_insights.json` → Challenger writes `challenger_verification.json` → Synthesizer writes `refined_analysis.json`

### Step 2.1 — Explore Insights

Invoke the **insight-explorer** subagent via the Task tool:

```
Generate interpretive insights from the survey statistical outputs.

== DATA FILES ==
Analysis outputs: {ABSOLUTE_PATH}/workspace/analysis/
  - Frequency tables: {ABSOLUTE_PATH}/workspace/analysis/frequency_tables/
  - Banner tables: {ABSOLUTE_PATH}/workspace/analysis/banner_tables/
  - Significance tests: {ABSOLUTE_PATH}/workspace/analysis/significance_tests/
  - Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv
Analysis plan: {ABSOLUTE_PATH}/workspace/analysis/analysis_plan.json
Analysis summary: {ABSOLUTE_PATH}/workspace/analysis/analysis_summary.json
Supporting documents: {ABSOLUTE_PATH}/input/supporting/

== OUTPUT ==
Write your insights to: {ABSOLUTE_PATH}/workspace/analysis/insight_reports/explorer_insights.json

== SURVEY INSTRUMENT ==
Survey instrument (full question wording and scales): {ABSOLUTE_PATH}/input/supporting/acme_brand_health_survey.txt (converted from .docx during pre-flight; fall back to .docx if .txt not available)

== INSTRUCTIONS ==
Read the survey instrument first to understand what each question measures and the exact response scales. Then read all statistical outputs, identify patterns and connections, and write structured insights organized by theme. Follow your agent definition for the output schema. READ BEFORE YOU CITE — use exact values from the source CSVs. Use proper question wording from the instrument when describing findings.

IMPORTANT: The derived_importance.csv file contains the correlation of each brand evaluation attribute (Q5) with purchase intent (Q6). Use this to create a "Key Drivers of Purchase Intent" theme showing which attributes matter most. Distinguish between total importance (pearson_r) and unique importance (standardized_beta).
```

After it completes, verify `workspace/analysis/insight_reports/explorer_insights.json` exists by reading it. Check that it has at least 1 theme with at least 1 claim.

If the file is missing or empty, log the error and retry once. If it fails again, report to the user and stop.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 2.1 — Explorer complete: insights written" >> workspace/pipeline.log`

### Step 2.2 — Verify Insights

Invoke the **insight-challenger** subagent via the Task tool:

```
Verify the Explorer's insight claims against source CSV files.

== EXPLORER'S INSIGHTS ==
Read: {ABSOLUTE_PATH}/workspace/analysis/insight_reports/explorer_insights.json

== SOURCE DATA (for verification) ==
Analysis outputs: {ABSOLUTE_PATH}/workspace/analysis/
  - Frequency tables: {ABSOLUTE_PATH}/workspace/analysis/frequency_tables/
  - Banner tables: {ABSOLUTE_PATH}/workspace/analysis/banner_tables/
  - Significance tests: {ABSOLUTE_PATH}/workspace/analysis/significance_tests/
  - Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv
Analysis plan: {ABSOLUTE_PATH}/workspace/analysis/analysis_plan.json

== OUTPUT ==
Write your verification report to: {ABSOLUTE_PATH}/workspace/analysis/insight_reports/challenger_verification.json

== INSTRUCTIONS ==
For each claim in explorer_insights.json, open the referenced source CSV and verify the exact numbers. Write a structured verification report with VERIFIED/CHALLENGED/PARTIAL verdicts per claim. Follow your agent definition for the output schema.
```

After it completes, verify `workspace/analysis/insight_reports/challenger_verification.json` exists by reading it. Check the summary section for counts.

If the file is missing, log the error and retry once. If it fails again, report to the user and stop.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 2.2 — Challenger complete: {N} verified, {N} challenged, {N} partial" >> workspace/pipeline.log`

Report to the user: "Insight verification complete — {N} claims verified, {N} challenged, {N} partial."

### Step 2.3 — Synthesize Analysis

Invoke the **analysis-synthesizer** subagent via the Task tool:

```
Produce refined_analysis.json from the Challenger's verified insight report.

== VERIFIED INSIGHTS ==
Challenger verification: {ABSOLUTE_PATH}/workspace/analysis/insight_reports/challenger_verification.json

== DATA FILES ==
Analysis outputs: {ABSOLUTE_PATH}/workspace/analysis/
  - Frequency tables: {ABSOLUTE_PATH}/workspace/analysis/frequency_tables/
  - Banner tables: {ABSOLUTE_PATH}/workspace/analysis/banner_tables/
  - Significance tests: {ABSOLUTE_PATH}/workspace/analysis/significance_tests/
  - Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv
Analysis plan: {ABSOLUTE_PATH}/workspace/analysis/analysis_plan.json
Analysis summary: {ABSOLUTE_PATH}/workspace/analysis/analysis_summary.json
Cleaning summary: {ABSOLUTE_PATH}/workspace/cleaned/cleaning_summary.json
Supporting documents: {ABSOLUTE_PATH}/input/supporting/

== OUTPUT ==
Write your output to: {ABSOLUTE_PATH}/workspace/analysis/refined_analysis.json

== INSTRUCTIONS ==
Read challenger_verification.json for the verified insights. Produce refined_analysis.json immediately. Read the source CSV files to verify all numbers. Include only VERIFIED and PARTIAL (corrected) insights. Follow your analysis-synthesis skill for the output schema.

== SURVEY INSTRUMENT ==
Survey instrument (full question wording and scales): {ABSOLUTE_PATH}/input/supporting/acme_brand_health_survey.txt (converted from .docx during pre-flight; fall back to .docx if .txt not available)

IMPORTANT: Read the survey instrument to understand proper question wording. Include a dedicated "purchase_intent_drivers" section in the refined analysis that ranks the Q5 brand attributes by their importance to purchase intent, using both Pearson correlations and standardized beta coefficients from derived_importance.csv.
```

If the subagent fails or does not produce `refined_analysis.json`, **graceful degradation:** Fall back to spawning a single `content-writer` subagent (via Task tool) that reads raw CSV outputs directly.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 2.3 — Synthesizer complete" >> workspace/pipeline.log`

### Step 2.4 — Finalize Analysis

After the Synthesizer subagent completes:

1. Verify `workspace/analysis/refined_analysis.json` exists by reading it. Check that it has:
   - At least 1 theme
   - At least 1 finding with `verified: true`
   - Valid `survey_context` section
2. If the file is missing or empty, **graceful degradation:** Fall back to spawning a single `content-writer` subagent (via Task tool) that reads raw CSV outputs directly.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 2.4 — Analysis complete — refined_analysis.json ready" >> workspace/pipeline.log`

Report to the user: "Analysis refinement complete — {N} themes, {N} verified findings."

## Stage 3: Report Production (Sequential Subagents with Correction Loop)

This stage uses three sequential subagents — Content Writer, HTML Designer, Report Verifier — with an orchestrator-driven correction loop. No agent team is required.

**Data flow:** `refined_analysis.json` → Writer writes section files → Designer writes `final_report.html` → Verifier writes `verification_report.json` → orchestrator reads verdict → if NEEDS_CORRECTION, re-invoke Writer/Designer with corrections → re-verify. Max 3 rounds.

### Step 3.1 — Write Report Sections

Invoke the **content-writer** subagent via the Task tool:

```
Write professional survey report sections from the refined analysis.

== PRIMARY INPUT ==
Refined analysis: {ABSOLUTE_PATH}/workspace/analysis/refined_analysis.json
Supporting documents: {ABSOLUTE_PATH}/input/supporting/

== SOURCE DATA (for cross-checking) ==
Frequency tables: {ABSOLUTE_PATH}/workspace/analysis/frequency_tables/
Banner tables: {ABSOLUTE_PATH}/workspace/analysis/banner_tables/
Significance tests: {ABSOLUTE_PATH}/workspace/analysis/significance_tests/
Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv

== OUTPUT ==
Write report sections to: {ABSOLUTE_PATH}/workspace/reports/sections/
Files: 01_executive_summary.md, 02_methodology.md, 03_respondent_profile.md,
04_key_findings.md, 05_cross_tab_analysis.md, 06_conclusions.md, 07_appendix.md

== SURVEY INSTRUMENT ==
Survey instrument (full question wording and scales): {ABSOLUTE_PATH}/input/supporting/acme_brand_health_survey.txt (converted from .docx during pre-flight; fall back to .docx if .txt not available)

== INSTRUCTIONS ==
Read the survey instrument to understand proper question wording and response scales — use these in the report rather than paraphrasing column names. Follow your report-writing skill. Use exact numbers from refined_analysis.json. Cross-check key statistics against source CSVs.

IMPORTANT: Section 04_key_findings.md MUST include a "Key Drivers of Purchase Intent" subsection that presents the derived importance results — ranking attributes by their correlation with purchase intent and distinguishing between total importance (Pearson r) and unique importance (standardized beta).
```

After it completes, verify all 7 section files exist in `workspace/reports/sections/`.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 3.1 — Content Writer complete: 7 section files written" >> workspace/pipeline.log`

### Step 3.2 — Build HTML Report

Invoke the **html-designer** subagent via the Task tool:

```
Build a self-contained HTML survey report from the markdown sections.

== INPUTS ==
Content Writer's sections: {ABSOLUTE_PATH}/workspace/reports/sections/
Refined analysis (for chart data): {ABSOLUTE_PATH}/workspace/analysis/refined_analysis.json
Source CSVs for tables: {ABSOLUTE_PATH}/workspace/analysis/frequency_tables/
Banner tables: {ABSOLUTE_PATH}/workspace/analysis/banner_tables/
Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv

== OUTPUT ==
Write the final report to: {ABSOLUTE_PATH}/workspace/reports/final_report.html

== INSTRUCTIONS ==
Read section files immediately. Build using multi-pass strategy (skeleton, content, visualizations, polish). Follow your html-report-design skill for the design system. Self-contained HTML, no external dependencies.

IMPORTANT: Include a visual chart for the derived importance analysis showing attribute rankings by correlation with purchase intent. Consider a horizontal bar chart or similar visualization.

== SELF-CHECK (MANDATORY FINAL PASS) ==
After writing final_report.html, perform a self-check before finishing:
1. Read the HTML you just wrote.
2. For every percentage, p-value, chi-square statistic, correlation coefficient, sample size, and count that appears in the HTML (in text, tables, or SVG charts), verify it matches the source CSVs:
   - Frequency tables: {ABSOLUTE_PATH}/workspace/analysis/frequency_tables/
   - Banner tables: {ABSOLUTE_PATH}/workspace/analysis/banner_tables/
   - Significance tests: {ABSOLUTE_PATH}/workspace/analysis/significance_tests/significance_results.csv
   - Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv
   - Cleaning summary: {ABSOLUTE_PATH}/workspace/cleaned/cleaning_summary.json
3. Also verify SVG chart axis labels, bar widths/heights, and data labels are consistent with the scale they represent.
4. If you find ANY discrepancy, fix it in-place before finishing. Do not leave known errors for the Verifier.
5. Pay special attention to: rounding consistency (use the same decimal places as the source CSV), summary counts (e.g., "N of M significant tests" must match significance_results.csv), and percentage denominators.
```

After it completes, verify `workspace/reports/final_report.html` exists by reading the first section.

If the file is missing, log the error and retry once. If it fails again, report to the user and stop.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 3.2 — HTML Designer complete: final_report.html written" >> workspace/pipeline.log`

### Step 3.3 — Verify Report

Invoke the **report-verifier** subagent via the Task tool:

```
Verify every statistic in the HTML report against source CSV files.

== REPORT ==
HTML report to verify: {ABSOLUTE_PATH}/workspace/reports/final_report.html

== SOURCE DATA (for verification) ==
Frequency tables: {ABSOLUTE_PATH}/workspace/analysis/frequency_tables/
Banner tables: {ABSOLUTE_PATH}/workspace/analysis/banner_tables/
Significance tests: {ABSOLUTE_PATH}/workspace/analysis/significance_tests/
Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv
Cleaning summary: {ABSOLUTE_PATH}/workspace/cleaned/cleaning_summary.json
Analysis plan: {ABSOLUTE_PATH}/workspace/analysis/analysis_plan.json

== OUTPUT ==
Write your verification report to: {ABSOLUTE_PATH}/workspace/reports/verification_report.json

== INSTRUCTIONS ==
Read the HTML report, verify every percentage, p-value, cross-tab claim, correlation coefficient, and sample size against the raw source CSVs (not refined_analysis.json). Write verification_report.json with verdict (VERIFIED or NEEDS_CORRECTION) and a list of specific issues.
```

After it completes, read `workspace/reports/verification_report.json`.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 3.3 — Verifier complete: verdict = {VERDICT}" >> workspace/pipeline.log`

### Step 3.4 — Correction Loop (if needed)

Read the `verdict` field from `verification_report.json`.

**If VERIFIED:** Report to the user: "Report verified — all statistics match source data." Proceed to Step 3.5.

**If NEEDS_CORRECTION:** Extract the issues list. Separate into content issues (`fix_target: "content"`) and HTML issues (`fix_target: "html"`).

For each correction round (max 3 total rounds including the initial verification):

1. If there are **content issues**, re-invoke the **content-writer** subagent with correction instructions:
   ```
   Apply corrections to the report sections based on verification feedback.

   == PRIMARY INPUT ==
   Refined analysis: {ABSOLUTE_PATH}/workspace/analysis/refined_analysis.json

   == EXISTING SECTIONS ==
   Read current sections from: {ABSOLUTE_PATH}/workspace/reports/sections/

   == SOURCE DATA (for cross-checking) ==
   Frequency tables: {ABSOLUTE_PATH}/workspace/analysis/frequency_tables/
   Banner tables: {ABSOLUTE_PATH}/workspace/analysis/banner_tables/
   Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv

   == OUTPUT ==
   Write corrected sections to: {ABSOLUTE_PATH}/workspace/reports/sections/

   == CORRECTIONS TO APPLY ==
   {INSERT THE CONTENT ISSUES FROM verification_report.json HERE — include section, description, claimed value, correct value, source file, and fix instruction for each issue}

   == INSTRUCTIONS ==
   Fix ONLY the issues listed above. Do not rewrite sections that passed verification.
   ```

2. If there are **HTML issues** (or after content corrections), re-invoke the **html-designer** subagent with correction instructions:
   ```
   Apply corrections to the HTML report based on verification feedback.

   == INPUTS ==
   Content Writer's sections: {ABSOLUTE_PATH}/workspace/reports/sections/
   Refined analysis (for chart data): {ABSOLUTE_PATH}/workspace/analysis/refined_analysis.json
   Source CSVs for tables: {ABSOLUTE_PATH}/workspace/analysis/frequency_tables/
   Banner tables: {ABSOLUTE_PATH}/workspace/analysis/banner_tables/
   Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv

   == OUTPUT ==
   Write the corrected report to: {ABSOLUTE_PATH}/workspace/reports/final_report.html

   == CORRECTIONS TO APPLY ==
   {INSERT THE HTML ISSUES FROM verification_report.json HERE — include section, description, claimed value, correct value, and fix instruction for each issue}

   == INSTRUCTIONS ==
   Fix the listed issues. Rebuild the HTML from the (possibly corrected) section files.
   ```

3. Re-invoke the **report-verifier** subagent (same prompt as Step 3.3).

4. Read the new `verification_report.json`. If VERIFIED, break the loop. If still NEEDS_CORRECTION and this was round 3, accept the current version and log the remaining issues.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 3.4 — Correction round {N}: {VERDICT}" >> workspace/pipeline.log`

### Step 3.5 — Finalize Report

Verify `workspace/reports/final_report.html` exists by reading the first section.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 3.5 — Report production complete" >> workspace/pipeline.log`

Report to the user: "Report production complete. Verification status: {VERIFIED or final round status}."

## Stage 4: Presentation Production (Concept Team + Production Subagents)

This stage uses a hybrid approach:
- **Phase 1 (Concept):** An agent team of three teammates — Visual Storyteller, Narrative Strategist, and Script Writer — who dialogue via broadcast to develop the narrative concept and produce a locked presentation script. This requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` to be enabled in settings.json (already configured).
- **Phase 2 (Production):** Sequential subagents — Presentation Designer and Presentation Reviewer — with an orchestrator-driven revision loop.

The executive briefing is **distinct from the Stage 3 report** — it is a visual, slide-style presentation optimized for screen sharing and stakeholder distribution, not a dense analytical document.

### Step 4.0 — Transition from Stage 3

1. Verify `workspace/reports/final_report.html` exists by reading the first few lines. If missing, log a warning but proceed — Stage 4 reads `refined_analysis.json` as its primary input.
2. Create the presentations directory if not already created: `mkdir -p workspace/presentations`

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 4.0 — Beginning Stage 4: Presentation Production" >> workspace/pipeline.log`

Report to the user: "Starting Stage 4 — Phase 1: concept team developing narrative arc. Phase 2: production subagents building the briefing."

### Phase 1: Concept Team

### Step 4.1 — Create the Concept Team

Create an agent team named "concept-team". Use Sonnet for all teammates. Use delegate mode so you (the lead) focus on coordination rather than doing the creative work yourself.

**Visual Storyteller** — spawn using the `visual-storyteller` agent definition with this context:
```
== PRIMARY INPUTS ==
Refined analysis: {ABSOLUTE_PATH}/workspace/analysis/refined_analysis.json
Report sections: {ABSOLUTE_PATH}/workspace/reports/sections/
Analysis plan: {ABSOLUTE_PATH}/workspace/analysis/analysis_plan.json
Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv
Supporting documents: {ABSOLUTE_PATH}/input/supporting/

== TEAMMATES ==
Your Strategist teammate is named "narrative-strategist". Use broadcast for all creative proposals.
The Script Writer is named "script-writer". They are observing and will write the final script.
Propose your opening concept via broadcast. After 2-3 exchanges with the Strategist, converge and broadcast "CONCEPT LOCKED".
```

**Narrative Strategist** — spawn using the `narrative-strategist` agent definition with this context:
```
== PRIMARY INPUTS ==
Refined analysis: {ABSOLUTE_PATH}/workspace/analysis/refined_analysis.json
Analysis plan: {ABSOLUTE_PATH}/workspace/analysis/analysis_plan.json
Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv
Supporting documents: {ABSOLUTE_PATH}/input/supporting/

== TEAMMATES ==
Your Storyteller teammate is named "visual-storyteller". Evaluate their broadcast proposals and push back via broadcast.
The Script Writer is named "script-writer". They are observing and will write the final script.
Wait for the Storyteller's opening concept, then respond via broadcast. After 2-3 exchanges, converge and broadcast "STRATEGY CONFIRMED".
```

**Script Writer** — spawn using the `script-writer` agent definition with this context:
```
== PRIMARY INPUTS ==
Refined analysis: {ABSOLUTE_PATH}/workspace/analysis/refined_analysis.json
Report sections: {ABSOLUTE_PATH}/workspace/reports/sections/
Analysis plan: {ABSOLUTE_PATH}/workspace/analysis/analysis_plan.json
Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv
Supporting documents: {ABSOLUTE_PATH}/input/supporting/

== OUTPUT ==
Write presentation script to: {ABSOLUTE_PATH}/workspace/presentations/presentation_script.md

== SOURCE DATA (for chart specifications) ==
Frequency tables: {ABSOLUTE_PATH}/workspace/analysis/frequency_tables/
Banner tables: {ABSOLUTE_PATH}/workspace/analysis/banner_tables/

== TEAMMATES ==
The Storyteller is named "visual-storyteller". The Strategist is named "narrative-strategist".
Observe their broadcast dialogue. Do NOT participate in ideation.
When both signal convergence ("CONCEPT LOCKED" and "STRATEGY CONFIRMED"), write the presentation script.
Broadcast when complete: "Presentation script complete."
```

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 4.1 — Concept team created (storyteller + strategist + script-writer)" >> workspace/pipeline.log`

Report to the user: "Concept team created — Storyteller and Strategist are developing the narrative arc. Script Writer is observing."

### Step 4.2 — Monitor the Concept Dialogue

Wait for the teammates to complete their creative dialogue. The flow is:

1. Storyteller broadcasts opening concept (narrative arc, hero findings, hook)
2. Strategist evaluates and pushes back via broadcast
3. 2-3 broadcast exchanges between Storyteller and Strategist
4. Storyteller broadcasts "CONCEPT LOCKED", Strategist broadcasts "STRATEGY CONFIRMED"
5. Script Writer produces `presentation_script.md` and broadcasts completion

The concept phase is done when:
- The Script Writer broadcasts that the script is complete, OR
- All teammates go idle after the convergence signals

If the teammates appear stalled (no convergence after 6+ broadcasts):
- Message the Storyteller: "Please converge on your best concept and broadcast CONCEPT LOCKED."
- Message the Strategist: "Please give your final assessment and broadcast STRATEGY CONFIRMED."
- Message the Script Writer: "Please write the script based on the strongest concept discussed so far."

### Step 4.3 — Wind Down Concept Team

After the Script Writer completes:

1. Verify `workspace/presentations/presentation_script.md` exists by reading it. If missing, message the Script Writer to finalize.
2. Send a direct message to all three teammates: "The concept phase is complete. Your work is done. Please accept the upcoming shutdown request."
3. Send `shutdown_request` to each teammate (visual-storyteller, narrative-strategist, script-writer).
4. Wait for confirmations, then call `TeamDelete` to clean up the team. If `TeamDelete` fails due to active members:
   - Read the team config file to identify remaining active members.
   - Send `shutdown_request` to each remaining active member by name.
   - Wait for confirmations, then retry `TeamDelete`.
   - If it still fails after 2 retries, log the error and proceed anyway.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 4.3 — Concept team complete, script locked" >> workspace/pipeline.log`

### Phase 2: Production Subagents

### Step 4.4 — Build Executive Briefing

Invoke the **presentation-designer** subagent via the Task tool:

```
Build a self-contained HTML executive briefing from the presentation script.

== INPUTS ==
Presentation script (locked): {ABSOLUTE_PATH}/workspace/presentations/presentation_script.md
Refined analysis (for data values): {ABSOLUTE_PATH}/workspace/analysis/refined_analysis.json
Source CSVs for charts: {ABSOLUTE_PATH}/workspace/analysis/frequency_tables/
Banner tables: {ABSOLUTE_PATH}/workspace/analysis/banner_tables/
Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv

== OUTPUT ==
Write the executive briefing to: {ABSOLUTE_PATH}/workspace/presentations/executive_briefing.html

== INSTRUCTIONS ==
Read the script immediately. Build using multi-pass strategy (skeleton, slide content, charts, polish). Follow your html-presentation-design skill for the design system. The narrative arc is locked — do not restructure the story. Self-contained HTML, scroll-snap slides, no external dependencies.

IMPORTANT: Include a compelling derived importance visualization (e.g., horizontal bar chart ranking attributes by correlation with purchase intent) as a key slide in the briefing.
```

After it completes, verify `workspace/presentations/executive_briefing.html` exists by reading the first section.

If the file is missing, log the error and retry once. If it fails again, log the error — the pipeline's primary output (Stage 3 report) is unaffected.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 4.4 — Presentation Designer complete: executive_briefing.html written" >> workspace/pipeline.log`

### Step 4.5 — Review Executive Briefing

Invoke the **presentation-reviewer** subagent via the Task tool:

```
Review the HTML executive briefing for visual quality and polish.

== INPUTS ==
HTML briefing: {ABSOLUTE_PATH}/workspace/presentations/executive_briefing.html
Presentation script: {ABSOLUTE_PATH}/workspace/presentations/presentation_script.md
Refined analysis: {ABSOLUTE_PATH}/workspace/analysis/refined_analysis.json

== INSTRUCTIONS ==
Evaluate the briefing for visual impact, data clarity, overall polish, and narrative flow (visual execution only — the narrative arc is locked by the concept team). Return APPROVED or NEEDS_REVISION with a prioritized list of improvements for the Designer.
```

After it completes, check the output for the verdict (APPROVED or NEEDS_REVISION).

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 4.5 — Reviewer verdict: {VERDICT}" >> workspace/pipeline.log`

### Step 4.6 — Revision Loop (if needed)

**If APPROVED:** Proceed to Step 4.7.

**If NEEDS_REVISION:** Extract the improvement list from the Reviewer's output.

For each revision round (max 3 total rounds including the initial review):

1. Re-invoke the **presentation-designer** subagent with revision feedback:
   ```
   Revise the HTML executive briefing based on review feedback.

   == INPUTS ==
   Presentation script (locked): {ABSOLUTE_PATH}/workspace/presentations/presentation_script.md
   Refined analysis (for data values): {ABSOLUTE_PATH}/workspace/analysis/refined_analysis.json
   Source CSVs for charts: {ABSOLUTE_PATH}/workspace/analysis/frequency_tables/
   Banner tables: {ABSOLUTE_PATH}/workspace/analysis/banner_tables/
   Derived importance: {ABSOLUTE_PATH}/workspace/analysis/derived_importance.csv

   == OUTPUT ==
   Write the revised briefing to: {ABSOLUTE_PATH}/workspace/presentations/executive_briefing.html

   == REVISION FEEDBACK ==
   {INSERT THE REVIEWER'S IMPROVEMENT LIST HERE}

   == INSTRUCTIONS ==
   Apply the improvements listed above. The narrative arc is locked — do not restructure the story. Focus on visual execution improvements.
   ```

2. Re-invoke the **presentation-reviewer** subagent (same prompt as Step 4.5).

3. Check the verdict. If APPROVED, break the loop. If still NEEDS_REVISION and this was round 3, accept the current version and log the remaining issues.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 4.6 — Revision round {N}: {VERDICT}" >> workspace/pipeline.log`

### Step 4.7 — Finalize Presentation

Verify `workspace/presentations/executive_briefing.html` exists by reading the first section. If missing, log the error — the pipeline's primary output (Stage 3 report) is unaffected.

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Step 4.7 — Presentation production complete" >> workspace/pipeline.log`

## Completion

Log: `echo "[$(date '+%Y-%m-%d %H:%M:%S')] Pipeline complete" >> workspace/pipeline.log`

When the pipeline finishes, summarize for the user:
- Final report location: `workspace/reports/final_report.html`
- Executive briefing location: `workspace/presentations/executive_briefing.html`
- Whether the Verifier approved the report or max correction rounds were reached
- Whether the Reviewer approved the briefing or max revision rounds were reached
- Key stats: number of themes, verified findings, frequency tables, banner tables, significant results
- Derived importance highlights: top 3 purchase intent drivers by correlation
- Reminder: both HTML files are self-contained and can be opened in any browser or printed to PDF
- Note: the executive briefing uses scroll-snap slides — use arrow keys or scroll to navigate between slides
