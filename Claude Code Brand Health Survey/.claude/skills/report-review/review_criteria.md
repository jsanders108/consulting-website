# Detailed Review Scoring Rubric

> **Scope note:** The Report Verifier uses only sections 1 (Accuracy) and 2 (Completeness) of this rubric. Sections 3 (Clarity), 4 (Actionability), and 5 (Formatting) are reference material for the Content Writer and are not part of the verification scope.

Use this rubric to systematically evaluate each aspect of a survey report draft. For each criterion, assign PASS, NEEDS_WORK, or FAIL.

---

## 1. Accuracy Criteria (Critical)

| # | Criterion | How to Verify | Rating |
|---|-----------|---------------|--------|
| 1.1 | Percentages match source data | Open the referenced freq_*.csv file, find the response value, compare the percent column | |
| 1.2 | Cross-tab claims match banner tables | Open the referenced banner_*.csv file, find the row/column intersection, compare values | |
| 1.3 | Significance claims match chi-square results | Open significance_results.csv, find the demographic+question row, verify p-value and significance flag | |
| 1.4 | Sample sizes are correct | Compare N values against valid_n in frequency tables and n_observations in significance results | |
| 1.5 | Rounding is consistent | Check that all percentages are rounded to one decimal place consistently | |
| 1.6 | No false significance claims | Verify that every claim of "significant" corresponds to p < 0.05 in the source data | |
| 1.7 | No missed significance denials | Verify that no significant result (p < 0.05) is described as "no difference" or "not significant" | |

**Scoring:** Any FAIL in section 1 → report rating must be NEEDS_MAJOR_REVISION.

---

## 2. Completeness Criteria

| # | Criterion | How to Verify | Rating |
|---|-----------|---------------|--------|
| 2.1 | All questions discussed | Cross-reference question_columns from analysis_plan.json against topics discussed in the report | |
| 2.2 | All significant cross-tabs mentioned | Cross-reference significance_results.csv (significant_05 == True) against cross-tab section | |
| 2.3 | All report sections present | Check for: Executive Summary, Methodology, Respondent Profile, Key Findings, Cross-Tab Analysis, Conclusions, Appendix | |
| 2.4 | Executive summary has 3-5 findings with stats | Count the bullet points; verify each has a specific number | |
| 2.5 | Methodology includes sample size | Check for both original N and cleaned N | |
| 2.6 | Respondent profile covers all demographics | Cross-reference demographic_columns from analysis_plan.json | |
| 2.7 | Appendix references data tables | Check for file path references | |
| 2.8 | Project objectives addressed (if provided) | Check analysis_plan.json for project_objectives; verify each is addressed in Conclusions | |

**Scoring:** 3+ FAILs in section 2 → NEEDS_MAJOR_REVISION. 1-2 FAILs → NEEDS_MINOR_REVISION.

---

## 3. Clarity Criteria

| # | Criterion | How to Verify | Rating |
|---|-----------|---------------|--------|
| 3.1 | Thematic organization | Findings should be grouped by theme, not listed Q1, Q2, Q3 sequentially | |
| 3.2 | Plain language before statistics | Each finding should state the insight in words before giving numbers | |
| 3.3 | Technical terms defined | "Chi-square test," "statistical significance," and "cross-tabulation" should be defined on first use | |
| 3.4 | Tables properly formatted | Markdown table syntax correct, numbers right-aligned, headers clear | |
| 3.5 | Logical flow | Report should read coherently from executive summary through conclusions | |
| 3.6 | No contradictions | No two statements in the report should contradict each other | |

---

## 4. Actionability Criteria

| # | Criterion | How to Verify | Rating |
|---|-----------|---------------|--------|
| 4.1 | Evidence-based conclusions | Each conclusion should reference specific findings from the report | |
| 4.2 | Specific recommendations | Recommendations should name specific actions, not vague suggestions like "improve communication" | |
| 4.3 | Executive summary stands alone | A reader should understand key takeaways from the executive summary without reading further | |
| 4.4 | Demographic targeting | Cross-tab findings should indicate which groups to focus on | |

---

## 5. Formatting Criteria

| # | Criterion | How to Verify | Rating |
|---|-----------|---------------|--------|
| 5.1 | Consistent heading hierarchy | ## for sections, ### for subsections — no skipping levels | |
| 5.2 | Proper markdown tables | Pipes aligned, header row has separator, numbers formatted consistently | |
| 5.3 | Bold statistics | Key numbers wrapped in ** ** | |
| 5.4 | Quoted survey questions | Exact question text in > blockquotes | |
| 5.5 | Numbered tables | "Table 1:", "Table 2:", etc. | |

---

## Overall Rating Decision Tree

```
Any Accuracy FAIL? → NEEDS_MAJOR_REVISION
3+ Completeness FAILs? → NEEDS_MAJOR_REVISION
1-2 Completeness FAILs? → NEEDS_MINOR_REVISION
Clarity/Actionability FAILs only? → NEEDS_MINOR_REVISION
Only Formatting issues? → NEEDS_MINOR_REVISION (unless very minor → APPROVED with suggestions)
All PASS? → APPROVED
```
