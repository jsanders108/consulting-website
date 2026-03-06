"""Adapted banner table script for Brand Health Survey."""
import hashlib, json, os, re
import pandas as pd

DATA_PATH = r"C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/cleaned/cleaned_data.csv"
PLAN_PATH = r"C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/analysis/analysis_plan.json"
OUT_DIR   = r"C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/analysis/banner_tables"

def sanitize_filename(name, max_len=60):
    s = re.sub(r"[^a-zA-Z0-9_]", "_", str(name))
    if len(s) <= max_len:
        return s
    h = hashlib.md5(s.encode()).hexdigest()[:8]
    return s[:max_len-9] + "_" + h

df = pd.read_csv(DATA_PATH)
with open(PLAN_PATH, encoding="utf-8") as f:
    plan = json.load(f)

demo_cols = plan["demographic_columns"]
question_cols = plan["question_columns"]
open_ended = plan.get("open_ended_columns", [])
category_mappings = plan.get("category_mappings", {})

os.makedirs(OUT_DIR, exist_ok=True)
generated = []
skipped = []

for demo_col in demo_cols:
    if demo_col not in df.columns:
        skipped.append(f"{demo_col}: not found in data")
        continue
    if df[demo_col].nunique() > 20 and demo_col not in category_mappings:
        skipped.append(f"{demo_col}: too many unique values ({df[demo_col].nunique()})")
        continue

    for q_col in question_cols:
        if q_col in open_ended:
            continue
        if q_col not in df.columns:
            continue
        if df[q_col].nunique() > 30:
            skipped.append(f"{demo_col} x {q_col}: question has >30 unique values")
            continue

        if demo_col in category_mappings:
            demo_series = df[demo_col].map(category_mappings[demo_col])
        else:
            demo_series = df[demo_col]

        temp_df = pd.DataFrame({"demo": demo_series, "question": df[q_col]})
        subset = temp_df.dropna()
        if len(subset) == 0:
            skipped.append(f"{demo_col} x {q_col}: no valid observations")
            continue

        ct_counts = pd.crosstab(subset["question"], subset["demo"], margins=True, margins_name="Total")
        ct_counts.index.name = q_col
        ct_counts.columns.name = demo_col

        ct_no_margins = pd.crosstab(subset["question"], subset["demo"])
        row_totals = ct_no_margins.sum(axis=1)
        ct_pct = ct_no_margins.div(row_totals, axis=0).multiply(100).round(2)
        ct_pct["Total"] = 100.0

        combined = ct_counts.copy().astype(str)
        for row_idx in ct_pct.index:
            for col_idx in ct_pct.columns:
                count_val = ct_counts.loc[row_idx, col_idx] if col_idx in ct_counts.columns else ""
                pct_val = ct_pct.loc[row_idx, col_idx] if col_idx in ct_pct.columns else ""
                combined.loc[row_idx, col_idx] = f"{count_val} ({pct_val}%)"

        filename = f"banner_{sanitize_filename(demo_col)}_{sanitize_filename(q_col)}.csv"
        combined.to_csv(os.path.join(OUT_DIR, filename))
        generated.append(filename)

print(f"Total banner tables: {len(generated)}")
if skipped:
    print(f"Skipped: {len(skipped)}")
    for s in skipped:
        print(f"  - {s}")
print("GENERATED_FILES:" + "|".join(generated))
print("SKIPPED:" + "|".join(skipped))
