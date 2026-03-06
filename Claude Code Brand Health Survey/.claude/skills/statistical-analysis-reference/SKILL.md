---
name: statistical-analysis-reference
description:
  Reference guide for reading statistical outputs and evaluating insight quality. Used by the Insight Explorer and Insight Challenger subagents.
---

# Statistical Analysis Reference

This skill provides reference information for reading and interpreting survey statistical outputs.
Both the Insight Explorer and Insight Challenger subagents load this skill.

## Reading Statistical Outputs

### Frequency Tables (`frequency_tables/freq_{column}.csv`)

Each file contains:
- `response_value`: The answer option
- `count`: Number of respondents who chose this answer
- `percent`: Percentage of valid (non-null) responses
- `cumulative_percent`: Running total of percentages
- `valid_n`: Total valid responses for this question

**How to cite:** "freq_Q3.csv: 'Somewhat familiar' = 42.3% (count=127, valid_n=300)"

### Banner Tables (`banner_tables/banner_{demo}_{question}.csv`)

Cross-tabulations with:
- Rows = question response values (stub)
- Columns = demographic categories (banner)
- Each cell contains count and row percentage in the format `count (percent%)`
- Includes row totals and column totals

**How to cite:** "banner_Age_Q3.csv: Among 18-24 age group, 'Very familiar' = 58.2% vs 31.0% for 45+ group"

### Significance Results (`significance_tests/significance_results.csv`)

Each row contains:
- `demographic_col`: The demographic column tested
- `question_col`: The question column tested
- `chi2_statistic`: Chi-square test statistic
- `p_value`: Probability value
- `degrees_of_freedom`: Degrees of freedom
- `significant_05`: True if p < 0.05
- `significant_01`: True if p < 0.01
- `min_expected_freq`: Minimum expected cell frequency
- `assumption_warning`: Warning text if expected frequency < 5 or other issues
- `n_observations`: Number of valid observations used in the test

**How to cite:** "significance_results.csv: Age x Q3, chi2_statistic=14.23, p_value=0.003, degrees_of_freedom=4, significant_01=True"

### Expected Frequency Tables (`significance_tests/expected_{demo}_{question}.csv`)

The expected frequencies under the null hypothesis. Used to check chi-square assumptions.

## What Makes a Valid Insight

### Insight (Good)
"Despite high overall awareness of cryptocurrencies (78.3% reporting at least some familiarity, freq_Q1.csv), opinion toward crypto is cautiously negative (only 31.2% favorable, freq_Q5.csv). This pattern of 'informed skepticism' is strongest among respondents aged 35-44 (p=0.008, significance_results.csv), who show the highest awareness (84.1%) paired with the lowest favorability (22.7%)."

This is an insight because it:
- Connects two separate findings (awareness + opinion)
- Names the pattern ("informed skepticism")
- Identifies a specific demographic driver
- Cites exact sources for every number

### Not an Insight (Bad)
"78.3% of respondents are familiar with cryptocurrencies."

This is just restating a frequency table. It adds no interpretive value.

### Not an Insight (Bad)
"Younger people seem to be more interested in crypto."

This is vague, uncited, and uses "seem" which implies uncertainty about the data.
