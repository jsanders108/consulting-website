---
name: analysis-planning
description: 
  "Classifies survey dataset columns as demographic, survey question, or metadata and generates an analysis plan JSON. Used by the orchestrator before dispatching to data processing subagents."
---

# Survey Analysis Planning

You will read a column summary JSON that describes each column in a survey dataset. Your job is to classify each column and produce an analysis plan.

## Input

The file at `workspace/analysis/column_summary.json` contains an array of objects, each with:
- `column_name`: the column header
- `dtype`: pandas dtype
- `unique_count`: number of unique values
- `sample_values`: up to 10 sample values
- `null_count`: number of null values
- `null_percent`: percentage of nulls
- `total_rows`: total number of rows

## Classification Rules

### Demographic columns (banner variables)

Classify a column as **DEMOGRAPHIC** if it matches ANY of these:

1. **Keyword match** — column name contains (case-insensitive): age, gender, sex, race, ethnicity, income, education, region, location, state, city, zip, department, role, title, tenure, employment, marital, household, occupation, company, industry, country, salary
2. **Category pattern** — has low cardinality (2–15 unique values) AND sample values look like named categories (e.g., "Male"/"Female", "18-24"/"25-34", "Northeast"/"South", "Bachelor's"/"Master's")
3. **Age range pattern** — values match patterns like "18-24", "25-34", "35-44" or "Under 18", "18 to 24"

### Survey question columns (stub variables)

Classify a column as **QUESTION** if it matches ANY of these:

1. **Question numbering** — column name starts with or contains "Q" followed by a number (Q1, Q2, Q2a, Q10, etc.) or contains "question"
2. **Likert scale** — values are numbers 1-5 or 1-7, or text like "Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"
3. **Rating/opinion** — column name contains: satisfaction, rating, agree, important, likely, recommend, score, opinion, preference, experience, quality
4. **Yes/No survey responses** — values are "Yes"/"No" or "True"/"False" and the column name suggests a survey item (not a demographic flag)
5. **Open-ended** — column has high cardinality (>50 unique values), dtype is string/object, and values are sentence-length text. Classify as QUESTION but flag as "open_ended" in the plan.

### Metadata columns (exclude from analysis)

Classify as **METADATA** and exclude from analysis:

1. **Identifiers** — column name contains: id, respondent, response_id, record
2. **Timestamps** — dtype is datetime or column name contains: date, time, timestamp, created, submitted, started, completed
3. **Platform fields** — column name contains: ip, browser, user_agent, source, collector, channel
4. **Email/contact** — column name contains: email, phone, name, address

## Category Collapsing Rules

After classifying columns, examine each **demographic column** to determine whether its categories should be collapsed for banner tables and chi-square tests. This reduces sparse cells and improves statistical reliability.

### When to Collapse

Collapse a demographic column if it has **more than 3** unique non-null values. Demographics with exactly 2 or 3 unique values are left unmapped.

### How to Decide Groupings

Create **exactly 3** collapsed groups per mapped demographic. The groupings should be:

1. **Semantically meaningful** — groups should represent real, interpretable segments (e.g., "Young", "Middle-aged", "Older" — not arbitrary splits)
2. **Roughly balanced** — prefer groupings that distribute respondents somewhat evenly, but never sacrifice interpretability for perfect balance
3. **Preserve natural boundaries** — respect the inherent ordering and grouping of the original categories:
   - **Age ranges:** Collapse adjacent ranges (e.g., "Under 18" + "18-24" = "Under 25")
   - **Income brackets:** Collapse adjacent brackets (e.g., "Under $20,000" + "$20,000 to $39,999" = "Under $40,000")
   - **Education levels:** Group by attainment tier (e.g., "No formal education" + "Primary" + "Secondary" = "High School Or Below")
   - **Ordinal scales:** Collapse adjacent points on the scale

### Generating the `category_mappings` Object

For each demographic that needs collapsing, create an entry in `category_mappings` where:
- The key is the demographic column name
- The value is an object mapping every original value (exactly as it appears in `sample_values`) to its collapsed group label

**Important rules:**
- Every unique value listed in `sample_values` for that column MUST appear as a key. Missing values get dropped at processing time.
- Use short, clear, professional group labels suitable for table headers (Title Case).
- If a demographic has exactly 4 categories, still collapse to 3 — merge the two most similar.
- If `unique_count` exceeds 10, `sample_values` may be incomplete. Note this in `notes`.

## Output

Write a JSON file to `workspace/analysis/analysis_plan.json` with this exact structure:

```json
{
  "demographic_columns": ["col_name_1", "col_name_2"],
  "question_columns": ["col_name_3", "col_name_4"],
  "open_ended_columns": ["col_name_5"],
  "metadata_columns": ["col_name_6"],
  "unclassified_columns": ["col_name_7"],
  "category_mappings": {
    "col_name_1": {
      "original_value_A": "Group 1",
      "original_value_B": "Group 1",
      "original_value_C": "Group 2",
      "original_value_D": "Group 3"
    }
  },
  "project_objectives": "Text from supporting docs or null",
  "total_rows": 500,
  "total_columns": 25,
  "notes": "Any special considerations for this dataset"
}
```

## Rules

- If a column does not clearly fit any category, put it in `unclassified_columns` and note why.
- If `input/supporting/` contains documents, read them and extract project objectives into the `project_objectives` field.
- Open-ended text columns go in both `question_columns` AND `open_ended_columns` (they are analyzed differently — frequency tables may not be meaningful for them).
- Prefer demographic classification over question classification when ambiguous (e.g., a column named "Department" with 8 values is demographic even if it could be a survey response).
- Demographics with 2 or 3 unique values should NOT appear in `category_mappings`. Only demographics with more than 3 unique values get entries.
- If `category_mappings` would be empty (all demographics have <= 3 values), still include the key with an empty object: `"category_mappings": {}`.
