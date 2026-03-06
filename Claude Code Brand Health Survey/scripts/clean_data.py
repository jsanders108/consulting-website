import pandas as pd
import numpy as np
import json
import os
import re
from datetime import datetime

INPUT_FILE = "C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/input/acme_brand_health_data.csv"
OUTPUT_DIR = "C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/cleaned"

cleaning_actions = []
removal_reasons = {"incomplete": 0, "duplicate": 0}

# --- Read ---
try:
    df = pd.read_csv(INPUT_FILE, encoding="utf-8")
except UnicodeDecodeError:
    df = pd.read_csv(INPUT_FILE, encoding="latin-1")
    cleaning_actions.append("File read with latin-1 encoding fallback")

original_rows = len(df)
original_cols = len(df.columns)

print(f"Loaded {original_rows} rows x {original_cols} columns")

# --- Data quality assessment ---
print("\n=== DATA QUALITY ASSESSMENT ===")
print(f"Shape: {df.shape}")
print(f"\nDtypes:\n{df.dtypes}")
missing = df.isnull().sum()
missing_pct = (missing / len(df) * 100).round(2)
missing_report = missing_pct[missing_pct > 0]
print(f"\nColumns with missing data:\n{missing_report}")
print(f"\nDuplicate rows: {df.duplicated().sum()}")

# --- Identify metadata columns ---
metadata_cols = ["respondent_id", "year"]
non_meta_cols = [c for c in df.columns if c not in metadata_cols]

# --- Replace empty strings with NaN ---
df.replace("", np.nan, inplace=True)
cleaning_actions.append("Replaced empty strings with NaN")

# --- Remove rows where >50% of non-metadata columns are NaN ---
before = len(df)
threshold = len(non_meta_cols) * 0.5
mask = df[non_meta_cols].isnull().sum(axis=1) > threshold
df = df[~mask]
incomplete_removed = before - len(df)
removal_reasons["incomplete"] = incomplete_removed
if incomplete_removed > 0:
    cleaning_actions.append(f"Removed {incomplete_removed} rows with >50% missing non-metadata values")

# --- Remove duplicate rows ---
before = len(df)
df.drop_duplicates(keep="first", inplace=True)
dup_removed = before - len(df)
removal_reasons["duplicate"] = dup_removed
if dup_removed > 0:
    cleaning_actions.append(f"Removed {dup_removed} duplicate rows")

# --- Strip whitespace from string columns ---
str_cols = df.select_dtypes(include="object").columns.tolist()
for col in str_cols:
    df[col] = df[col].str.strip()
cleaning_actions.append(f"Stripped leading/trailing whitespace from {len(str_cols)} string columns")

# --- Detect and convert numeric columns stored as strings ---
converted_numeric = []
for col in str_cols:
    sample = df[col].dropna()
    if len(sample) == 0:
        continue
    try:
        converted = pd.to_numeric(sample, errors="raise")
        df[col] = pd.to_numeric(df[col], errors="coerce")
        converted_numeric.append(col)
    except (ValueError, TypeError):
        pass
if converted_numeric:
    cleaning_actions.append(f"Converted string-encoded numeric columns: {converted_numeric}")

# --- Detect and convert date columns ---
date_cols = [c for c in df.columns if re.search(r"date|time|dt", c, re.IGNORECASE)]
converted_dates = []
for col in date_cols:
    try:
        df[col] = pd.to_datetime(df[col], errors="raise").dt.strftime("%Y-%m-%d")
        converted_dates.append(col)
    except Exception:
        pass
if converted_dates:
    cleaning_actions.append(f"Converted date columns to ISO format: {converted_dates}")

# --- Identify columns still with nulls ---
cols_with_nulls = df.columns[df.isnull().any()].tolist()

cleaned_rows = len(df)
rows_removed = original_rows - cleaned_rows

print(f"\n=== CLEANING COMPLETE ===")
print(f"Original rows: {original_rows}, Cleaned rows: {cleaned_rows}, Removed: {rows_removed}")

# --- Warning: very few rows ---
if cleaned_rows < 5:
    cleaning_actions.append("WARNING: Fewer than 5 rows remain after cleaning. Dataset may be too small for analysis.")
    print("WARNING: Fewer than 5 rows remain after cleaning.")

# --- Save cleaned CSV ---
out_csv = os.path.join(OUTPUT_DIR, "cleaned_data.csv")
df.to_csv(out_csv, index=False, encoding="utf-8")
print(f"Saved cleaned CSV: {out_csv}")

# --- Save cleaning_summary.json ---
summary = {
    "original_rows": original_rows,
    "cleaned_rows": cleaned_rows,
    "rows_removed": rows_removed,
    "removal_reasons": removal_reasons,
    "columns": original_cols,
    "columns_with_nulls": cols_with_nulls,
    "cleaning_actions": cleaning_actions
}
out_json = os.path.join(OUTPUT_DIR, "cleaning_summary.json")
with open(out_json, "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=2)
print(f"Saved summary JSON: {out_json}")

# --- Save cleaning_report.md ---
missing_after = df.isnull().sum()
missing_after_pct = (missing_after / cleaned_rows * 100).round(2)
null_detail = missing_after[missing_after > 0]

report_lines = [
    "# Survey Data Cleaning Report",
    f"\n**Date:** {datetime.today().strftime('%Y-%m-%d')}",
    f"**Source file:** `acme_brand_health_data.csv`",
    "",
    "## Overview",
    f"| Metric | Value |",
    f"|---|---|",
    f"| Original rows | {original_rows} |",
    f"| Cleaned rows | {cleaned_rows} |",
    f"| Rows removed | {rows_removed} |",
    f"| Columns | {original_cols} |",
    "",
    "## Removal Breakdown",
    f"| Reason | Rows Removed |",
    f"|---|---|",
    f"| Incomplete (>50% missing non-metadata) | {removal_reasons['incomplete']} |",
    f"| Exact duplicates | {removal_reasons['duplicate']} |",
    "",
    "## Cleaning Actions",
]
for action in cleaning_actions:
    report_lines.append(f"- {action}")

report_lines += [
    "",
    "## Columns with Missing Values (Post-Cleaning)",
]
if len(null_detail) > 0:
    report_lines.append("| Column | Missing Count | Missing % |")
    report_lines.append("|---|---|---|")
    for col, cnt in null_detail.items():
        pct = missing_after_pct[col]
        report_lines.append(f"| {col} | {cnt} | {pct}% |")
else:
    report_lines.append("No columns have missing values after cleaning.")

report_lines += [
    "",
    "## Data Types (Post-Cleaning)",
    "| Column | Dtype |",
    "|---|---|",
]
for col, dtype in df.dtypes.items():
    report_lines.append(f"| {col} | {dtype} |")

report_lines.append("")
report_lines.append("*Report generated by the data-cleaner agent.*")

out_md = os.path.join(OUTPUT_DIR, "cleaning_report.md")
with open(out_md, "w", encoding="utf-8") as f:
    f.write("\n".join(report_lines))
print(f"Saved cleaning report: {out_md}")
