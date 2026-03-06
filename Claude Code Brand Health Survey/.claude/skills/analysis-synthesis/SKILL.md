---
name: analysis-synthesis
description:
  Instructions for synthesizing the Challenger's verified insight report into a structured refined_analysis.json document. Covers the output schema, neutrality standards, and verification requirements.
---

# Analysis Synthesis Guidelines

This skill is used by the **Analysis Synthesizer** subagent in the Stage 2 Analysis Refinement pipeline.
Your job is to read the Challenger's verified insight report and produce a structured JSON document
that becomes the single source of truth for the report production pipeline.

## Core Principle: Neutrality

You are not the Explorer (you do not generate insights) and you are not the Challenger
(you do not verify claims). You are the **neutral recorder** of what the verification established.

This means:
- Include only insights that were VERIFIED or PARTIAL (with corrected values)
- Use the Challenger's corrected numbers, not the Explorer's original claims
- Include Challenger caveats (sample size warnings, effect size notes) verbatim
- Do not add your own interpretive layer
- Do not weight one theme as more important than another unless the verification explicitly established a hierarchy

## Building the Document

### Step 1: Read the Verification Report

Read `challenger_verification.json` and build a ledger:

| Claim | Explorer Said | Challenger Verdict | Corrected Value | Include? |
|---|---|---|---|---|
| Theme: Awareness | 78.3% familiar | VERIFIED | — | Yes |
| Theme: Awareness | "Informed skepticism" | VERIFIED | — | Yes |
| Theme: Age gap | 45% for young | CHALLENGED: actually 42.3% | 42.3% | Yes (corrected) |
| Theme: Income | High earners prefer | CHALLENGED: not supported | — | No |

### Step 2: Populate Survey Context

Read these files to fill in the `survey_context` section:
- `analysis_plan.json` → project_objectives, column counts
- `cleaning_summary.json` → sample sizes (original, cleaned)
- Supporting documents → title, data collection method

### Step 3: Build Respondent Profile

Read frequency tables for demographic columns (identified in `analysis_plan.json`) to populate the `respondent_profile` array. Use exact percentages from the frequency table CSVs.

### Step 4: Organize Themes

Use the thematic groupings from the Explorer's insights (as validated by the Challenger). Each theme should have:
- A descriptive name
- A 2-3 sentence summary
- A one-sentence headline insight
- An array of verified findings with evidence

### Step 5: Compile Significant Cross-Tabs

Read `significance_results.csv` to produce the `significant_cross_tabs_summary` array. Include all results where `significant_05 = True`. Use the Explorer's plain-language descriptions of direction where they were verified.

### Step 6: Draft Conclusions

Synthesize conclusions from the verified themes. Each conclusion must:
- Reference specific findings from the themes
- Be rated as strong/moderate/suggestive based on evidence quality
- Include a concrete recommendation

### Step 7: Note Data Limitations

Compile all limitations mentioned in the verification report:
- Sample size warnings from the Challenger
- Expected frequency warnings from chi-square tests
- Missing data notes from the cleaning summary
- Demographic coverage gaps

## Output Quality Checklist

Before writing the final file, verify:
- [ ] Every finding has `verified: true` (no unverified claims included)
- [ ] Every statistic has a `source_file` reference
- [ ] Every `cross_tab_significance` entry has a valid `p_value`
- [ ] The `respondent_profile` covers all demographic columns from the analysis plan
- [ ] All verified themes are represented
- [ ] `data_limitations` includes Challenger-flagged caveats
- [ ] The `appendix_summary` file counts match what's on disk (read the directories to check)
- [ ] No duplicate findings across themes
- [ ] Conclusions are grounded in specific findings, not generalizations

## When to Write the File

Begin writing `refined_analysis.json` immediately upon invocation. Read the Challenger's verification report and the source files to verify numbers and populate all sections of the schema.
