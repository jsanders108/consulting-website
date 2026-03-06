# [Survey Name] — Analysis Report

**Prepared:** [Date]
**Prepared for:** [Client/Stakeholder, if known]

---

## Executive Summary

- **[Finding 1]:** [Plain language statement with **key statistic**]
- **[Finding 2]:** [Plain language statement with **key statistic**]
- **[Finding 3]:** [Plain language statement with **key statistic**]
- **[Finding 4]:** [Plain language statement with **key statistic**] *(if applicable)*
- **[Finding 5]:** [Plain language statement with **key statistic**] *(if applicable)*

[1-2 sentences on recommended actions based on these findings.]

---

## Methodology

| Parameter | Detail |
|-----------|--------|
| Original sample size | N = [original count from cleaning summary] |
| Cleaned sample size | N = [cleaned count] |
| Responses removed | [count] ([reason: incomplete, duplicate, etc.]) |
| Data collection method | [From supporting docs or "Not provided"] |
| Analysis methods | Frequency analysis, cross-tabulation, chi-square test of independence (α = 0.05) |
| Analysis date | [Date] |

**Data quality notes:** [Summary of cleaning actions taken]

**Key terms:**
- **Cross-tabulation**: A table showing how responses to one question break down across categories of another variable (e.g., satisfaction by age group)
- **Chi-square test**: A statistical test that determines whether two categorical variables are related. A result is "statistically significant" (p < 0.05) when the observed pattern is unlikely to be due to chance alone.

---

## Respondent Profile

### [Demographic 1, e.g., Age]

| Category | Count | Percent |
|----------|------:|--------:|
| [Value] | [n] | [%] |
| [Value] | [n] | [%] |
| **Total** | **[N]** | **100%** |

### [Demographic 2, e.g., Gender]

[Same table format]

### [Demographic 3, etc.]

[Same table format]

---

## Key Findings

### Theme 1: [Thematic Heading]

> [Exact survey question text, if available]

[Plain language finding]. **[Key statistic]**.

[If cross-tab result is significant:]
This varied significantly by [demographic] (chi-square test, p = [value]). [Description of the differences between groups].

**Table [N]: [Description]**

| Response | Overall | [Demo Group 1] | [Demo Group 2] | [Demo Group 3] |
|----------|--------:|----------------:|----------------:|----------------:|
| [Value] | [%] | [%] | [%] | [%] |

### Theme 2: [Thematic Heading]

[Same pattern]

### Theme 3: [Thematic Heading]

[Same pattern]

---

## Detailed Cross-Tabulation Analysis

[Only include statistically significant results (p < 0.05)]

**Table [N]: Summary of Significant Cross-Tabulations**

| Demographic | Question | Chi-Square | p-value | Key Difference |
|-------------|----------|------------|---------|----------------|
| [Demo] | [Question] | [χ²] | [p] | [Brief description] |

[For each significant result, provide 1-2 sentences of interpretation]

---

## Conclusions and Recommendations

### Conclusion 1: [Statement]
[Evidence from the report that supports this conclusion]
**Recommendation:** [Specific, actionable recommendation]

### Conclusion 2: [Statement]
[Evidence]
**Recommendation:** [Action]

### Conclusion 3: [Statement]
[Evidence]
**Recommendation:** [Action]

[If project objectives were provided:]

### Addressing Project Objectives
- **Objective 1:** [How the findings address this objective]
- **Objective 2:** [How the findings address this objective]

---

## Appendix

### A. Frequency Table Summary

| Question | Valid N | Top Response | Top Response % |
|----------|--------:|--------------|---------------:|
| [Q name] | [N] | [value] | [%] |

### B. Significant Cross-Tabulations

| Demographic | Question | p-value | Direction |
|-------------|----------|---------|-----------|
| [Demo] | [Q] | [p] | [Brief direction] |

### C. Data File References

All source data tables are available in:
- Frequency tables: `workspace/analysis/frequency_tables/`
- Banner tables: `workspace/analysis/banner_tables/`
- Significance tests: `workspace/analysis/significance_tests/`
