"""
Banner Table (Cross-Tabulation) Generator Template

Produces cross-tabs with demographic columns as banners and question
columns as stubs. Includes both counts and row percentages.

Usage:
    python banner_table_template.py <data_path> <analysis_plan_path> <output_dir>
"""

import hashlib
import json
import os
import re
import sys

import pandas as pd


def sanitize_filename(name, max_len=60):
    sanitized = re.sub(r"[^a-zA-Z0-9_]", "_", str(name))
    if len(sanitized) <= max_len:
        return sanitized
    hash_suffix = hashlib.md5(sanitized.encode()).hexdigest()[:8]
    return sanitized[: max_len - 9] + "_" + hash_suffix


def generate_banner_tables(data_path, analysis_plan_path, output_dir):
    df = pd.read_csv(data_path)

    with open(analysis_plan_path, encoding="utf-8") as f:
        plan = json.load(f)

    demo_cols = plan["demographic_columns"]
    question_cols = plan["question_columns"]
    open_ended = plan.get("open_ended_columns", [])
    category_mappings = plan.get("category_mappings", {})

    os.makedirs(output_dir, exist_ok=True)
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

            # Apply category mapping if one exists for this demographic
            if demo_col in category_mappings:
                demo_series = df[demo_col].map(category_mappings[demo_col])
            else:
                demo_series = df[demo_col]

            # Drop rows where either column is NaN
            temp_df = pd.DataFrame({"demo": demo_series, "question": df[q_col]})
            subset = temp_df.dropna()
            if len(subset) == 0:
                skipped.append(f"{demo_col} x {q_col}: no valid observations")
                continue

            # Counts cross-tab
            ct_counts = pd.crosstab(
                subset["question"], subset["demo"], margins=True, margins_name="Total"
            )
            ct_counts.index.name = q_col
            ct_counts.columns.name = demo_col

            # Row percentages (exclude Total row/col for calculation, then add back)
            ct_no_margins = pd.crosstab(subset["question"], subset["demo"])
            row_totals = ct_no_margins.sum(axis=1)
            ct_pct = ct_no_margins.div(row_totals, axis=0).multiply(100).round(2)
            ct_pct["Total"] = 100.0

            # Combine counts and percentages
            combined = ct_counts.copy().astype(str)
            for row_idx in ct_pct.index:
                for col_idx in ct_pct.columns:
                    count_val = ct_counts.loc[row_idx, col_idx] if col_idx in ct_counts.columns else ""
                    pct_val = ct_pct.loc[row_idx, col_idx] if col_idx in ct_pct.columns else ""
                    combined.loc[row_idx, col_idx] = f"{count_val} ({pct_val}%)"

            filename = f"banner_{sanitize_filename(demo_col)}_{sanitize_filename(q_col)}.csv"
            combined.to_csv(os.path.join(output_dir, filename))
            generated.append(filename)
            print(f"  Generated: {filename}")

    print(f"\nTotal banner tables: {len(generated)}")
    if skipped:
        print(f"Skipped: {len(skipped)}")
        for s in skipped:
            print(f"  - {s}")

    return generated, skipped


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python banner_table_template.py <data_path> <plan_path> <output_dir>")
        sys.exit(1)
    generate_banner_tables(sys.argv[1], sys.argv[2], sys.argv[3])
