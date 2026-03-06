---
name: report-review
description:
  Accuracy verification criteria for the Report Verifier subagent. Focuses on statistical accuracy and completeness checks against source CSV data. Outputs a structured verification report.
---

# Report Verification Criteria

This skill is used by the **Report Verifier** subagent in the Stage 3 report production pipeline.
Your sole job is to verify that every statistic in the HTML report matches the source
data files. You do not evaluate prose quality, design, or narrative structure.

## Verification Process

1. Read `workspace/reports/final_report.html`.
2. Systematically verify every statistic (see checklist below).
3. Write `workspace/reports/verification_report.json` with your findings.
4. Set verdict to "VERIFIED" if all numbers check out, or "NEEDS_CORRECTION" with a list of issues.

## Accuracy Checklist (Critical)

### Percentages
- [ ] Every percentage in the report matches the `percent` column in the corresponding `freq_{column}.csv`
- [ ] No rounding errors greater than 0.5 percentage points
- [ ] Percentages attributed to specific subgroups match the corresponding banner table CSV

### Cross-Tabulation Claims
- [ ] Every cross-tab percentage matches the corresponding `banner_{demo}_{question}.csv`
- [ ] Direction of differences is correctly stated (which group is higher/lower)
- [ ] Magnitude of differences is accurately reported

### Statistical Significance
- [ ] Every p-value matches `significance_results.csv`
- [ ] No claims of "significant differences" for results with p >= 0.05
- [ ] No claims of "no difference" when the result IS significant (p < 0.05)
- [ ] Chi-square statistics match if reported

### Sample Sizes
- [ ] Original and cleaned sample sizes match `cleaning_summary.json`
- [ ] Valid N values match the `valid_n` column in frequency tables
- [ ] Subgroup sizes mentioned in cross-tab discussion are consistent with banner tables

### Chart/Visualization Values
- [ ] Bar chart lengths/values match the corresponding table data
- [ ] SVG chart labels match the data they represent
- [ ] Chart totals are consistent with frequency tables

## Completeness Checklist

- [ ] All survey questions from `analysis_plan.json` question_columns are discussed
- [ ] All statistically significant cross-tab findings (p < 0.05 in `significance_results.csv`) are mentioned
- [ ] All 7 report sections are present (Executive Summary, Methodology, Respondent Profile, Key Findings, Cross-Tab Analysis, Conclusions, Appendix)
- [ ] If project objectives exist in `analysis_plan.json`, each is addressed

## Output Format

Write `workspace/reports/verification_report.json` with:
- `verdict`: "VERIFIED" or "NEEDS_CORRECTION"
- `summary`: counts of checks performed and issues found
- `issues`: array of specific issues with type, section, description, claimed vs correct values, source file, and fix instructions
- `verified_stats`: summary of what checked out

Provide specific fix instructions for each issue:
- For accuracy issues: specify the section file and what value to change
- For rendering issues: specify what the Designer should fix in the HTML
- For completeness issues: specify what content needs to be added and to which section

## Rules

- **Read the actual source CSV.** Do not guess, do not assume, do not trust memory.
- **Verify against raw CSV files, not `refined_analysis.json`.** This catches errors introduced during synthesis.
- **Check chart values separately from prose.** The Designer may have rendered data incorrectly.
- **Do NOT fabricate corrections.** If the number is right, confirm it. Do not invent issues.
- **Focus ONLY on accuracy and completeness.** Prose quality, tone, and visual design are not your concern.
- **Be precise.** Quote the exact text from the report and the exact value from the CSV.

## Reference Files

- `review_criteria.md` in this skill directory provides the detailed scoring rubric
