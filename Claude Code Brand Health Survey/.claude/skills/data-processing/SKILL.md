---
name: data-processing
description:
  Comprehensive instructions for survey data statistical analysis including frequency tables, banner/cross-tabulation tables, chi-square significance testing, and derived importance analysis. Used by the data-processor subagent.
---

# Survey Data Statistical Analysis Instructions

You are the data-processor subagent. You receive cleaned survey data and an analysis plan, and you must produce four types of statistical outputs by writing and executing Python scripts.

## Your Inputs

- **Cleaned data file:** path provided in your task prompt (CSV)
- **Analysis plan:** path provided in your task prompt (JSON) — contains `demographic_columns`, `question_columns`, `open_ended_columns`
- **Output directory:** path provided in your task prompt

## General Rules

- Write Python scripts to disk and execute them via `python script_path`. Do NOT try to process data in your context window.
- Use the template scripts in this skill directory as starting points. Read them, adapt them to the specific dataset, then execute.
- If a script fails, read the error, fix the script, and retry. Do not give up after one failure.
- After all scripts complete, write `analysis_summary.json` to the output directory.

---

## Step 1: Frequency Tables

For EACH column listed in `question_columns` (skip columns also in `open_ended_columns`):

### Process
1. Count occurrences of each unique response value
2. Calculate percentage of total valid responses (exclude NaN)
3. Calculate cumulative percentage
4. Sort by response value (numeric sort if values are numbers, alphabetical otherwise)

### Output Format (CSV)
Columns: `response_value`, `count`, `percent`, `cumulative_percent`, `valid_n`

### File Naming
One CSV per question column: `frequency_tables/freq_{column_name}.csv`

Use sanitized column names for filenames (replace spaces and special characters with underscores).

### Reference Template
Read `.claude/skills/data-processing/frequency_table_template.py` and adapt it.

---

## Step 2: Banner Tables (Cross-Tabulations)

For EACH combination of (demographic_column, question_column) — skip open-ended columns:

### Process
1. Create a cross-tabulation using `pd.crosstab()`
2. The **question column** is the STUB (row variable — its values become row labels)
3. The **demographic column** is the BANNER (column variable — its values become column headers)
4. Calculate both raw counts and row percentages
5. Include row totals and column totals (margins)

### Output Format (CSV)
A multi-index CSV with:
- Row index: question response values
- Column headers: demographic category values
- Each cell contains the count
- A separate row-percentage version is appended or saved alongside

### File Naming
One CSV per combination: `banner_tables/banner_{demographic}_{question}.csv`

### Edge Cases
- If a demographic column has more than 20 unique values, skip it for banner tables and note this in the analysis summary.
- If a question column has more than 30 unique values, skip it for banner tables.
- If a cross-tab would have fewer than 5 total observations in any cell, still produce it but flag it.

### Category Collapsing

Before creating each cross-tabulation, check if `analysis_plan.json` contains a `category_mappings` entry for the current demographic column. If it does:

1. Apply the mapping to the demographic column using `pd.Series.map()` — this replaces each original value with its collapsed group label
2. Any values not present in the mapping become NaN and are excluded from the cross-tab
3. The resulting banner table columns will show the collapsed group names rather than the original categories

If no mapping exists for a demographic (it has 3 or fewer categories), use the original values unchanged. The banner table template script already implements this logic.

### Reference Template
Read `.claude/skills/data-processing/banner_table_template.py` and adapt it.

---

## Step 3: Chi-Square Significance Tests

For EACH banner table produced in Step 2:

### Process
1. Extract the observed frequency table (without margins/totals)
2. Run `scipy.stats.chi2_contingency()` on the observed frequencies
3. Record: chi-square statistic, p-value, degrees of freedom
4. Flag as significant if p < 0.05
5. Flag as highly significant if p < 0.01
6. Check if any expected frequency is < 5 — if so, add an assumption warning

### Output Format
A single consolidated CSV: `significance_tests/significance_results.csv`

Columns: `demographic_col`, `question_col`, `chi2_statistic`, `p_value`, `degrees_of_freedom`, `significant_05`, `significant_01`, `min_expected_freq`, `assumption_warning`, `n_observations`

### Edge Cases
- If a cross-tab has a row or column that is entirely zero, skip the chi-square test and note "insufficient variation" in the results.
- If `chi2_contingency` raises an error, catch it, record the error message, and continue to the next combination.

### Category Collapsing

Apply the same `category_mappings` logic as in Step 2. The chi-square test runs on the collapsed cross-tabulation, not the original high-cardinality table. This typically improves the test's validity by increasing expected cell frequencies. The chi-square template script already implements this logic.

### Reference Template
Read `.claude/skills/data-processing/chi_square_template.py` and adapt it.

---

## Step 4: Derived Importance Analysis

This step determines which brand evaluation attributes (Q5_01 through Q5_11) are the strongest drivers of purchase intent (Q6_purchase_intent).

### Process
1. Identify all columns starting with `Q5_` as attribute columns and `Q6_purchase_intent` as the outcome column
2. Drop rows with NaN in any of these columns
3. Calculate Pearson correlation (`scipy.stats.pearsonr`) between each Q5 attribute and Q6_purchase_intent
4. Run a multiple linear regression with all Q5 columns as predictors and Q6 as the dependent variable to get standardized beta coefficients (standardize all variables to z-scores first, then use OLS via `numpy.linalg.lstsq`)
5. Rank attributes by absolute correlation strength

### Output Format (CSV)
File: `derived_importance.csv` in the output directory (not a subdirectory)

Columns: `attribute`, `attribute_label`, `pearson_r`, `p_value`, `standardized_beta`, `abs_r`, `rank`

### Attribute Labels
- Q5_01: High quality overall
- Q5_02: Taste fresh
- Q5_03: Excellent sweetness/flavor
- Q5_04: Appealing appearance
- Q5_05: Good value for price
- Q5_06: Consistently good
- Q5_07: Widely available
- Q5_08: Committed to sustainability
- Q5_09: Attractive packaging
- Q5_10: Brand I trust
- Q5_11: Longer shelf life

### Interpretation Guide
- `pearson_r`: Bivariate correlation — shows total association with purchase intent
- `standardized_beta`: Unique contribution when controlling for all other attributes
- High pearson_r + high beta = true driver
- High pearson_r + low beta = correlated but redundant with other attributes
- Low pearson_r + high beta = suppressor effect (unusual, flag it)

### Edge Cases
- If any Q5 column has zero variance (all same rating), skip it and note in the output
- If multicollinearity is extreme (near-singular matrix), `lstsq` with `rcond=None` handles this via SVD

### Reference Template
Read `.claude/skills/data-processing/derived_importance_template.py` and adapt it.

---

## Step 5: Analysis Summary

After all four steps complete, write `analysis_summary.json` to the output directory:

```json
{
  "frequency_tables_count": 15,
  "frequency_tables_files": ["freq_Q1.csv", "freq_Q2.csv"],
  "banner_tables_count": 45,
  "banner_tables_files": ["banner_age_Q1.csv"],
  "significance_tests_count": 45,
  "significant_results_count": 12,
  "highly_significant_count": 5,
  "derived_importance": {
    "attributes_analyzed": 11,
    "valid_n": 780,
    "top_3_drivers": ["Brand I trust (r=0.72)", "High quality overall (r=0.68)", "Consistently good (r=0.65)"]
  },
  "skipped_combinations": ["reason for each skip"],
  "warnings": ["any assumption violations or edge cases"],
  "open_ended_columns_skipped": ["Q15_comments"]
}
```
