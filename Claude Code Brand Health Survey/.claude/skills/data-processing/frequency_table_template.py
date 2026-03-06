"""
Frequency Table Generator Template

Adapt this script for the specific dataset. Replace the placeholder
paths and column lists with actual values from the analysis plan.

Usage:
    python frequency_table_template.py <data_path> <analysis_plan_path> <output_dir>
"""

import hashlib
import json
import os
import re
import sys

import pandas as pd


def sanitize_filename(name, max_len=60):
    """Replace spaces and special characters with underscores, truncate if long."""
    sanitized = re.sub(r"[^a-zA-Z0-9_]", "_", str(name))
    if len(sanitized) <= max_len:
        return sanitized
    hash_suffix = hashlib.md5(sanitized.encode()).hexdigest()[:8]
    return sanitized[: max_len - 9] + "_" + hash_suffix


# Common Likert scale orderings (normalized to lowercase for matching)
LIKERT_SCALES = [
    # 5-point agreement
    ["strongly disagree", "disagree", "neutral", "agree", "strongly agree"],
    ["strongly disagree", "disagree", "neither agree nor disagree", "agree", "strongly agree"],
    ["strongly disagree", "somewhat disagree", "neutral", "somewhat agree", "strongly agree"],
    ["strongly disagree", "somewhat disagree", "neither agree nor disagree", "somewhat agree", "strongly agree"],
    # 5-point satisfaction
    ["very dissatisfied", "dissatisfied", "neutral", "satisfied", "very satisfied"],
    ["very dissatisfied", "somewhat dissatisfied", "neutral", "somewhat satisfied", "very satisfied"],
    # 5-point likelihood
    ["very unlikely", "unlikely", "neutral", "likely", "very likely"],
    ["very unlikely", "somewhat unlikely", "neutral", "somewhat likely", "very likely"],
    # 5-point frequency
    ["never", "rarely", "sometimes", "often", "always"],
    # 5-point importance
    ["not at all important", "slightly important", "moderately important", "important", "very important"],
    ["not important", "slightly important", "moderately important", "important", "very important"],
    # 4-point agreement (no neutral)
    ["strongly disagree", "disagree", "agree", "strongly agree"],
    # 3-point
    ["disagree", "neutral", "agree"],
    ["negative", "neutral", "positive"],
    ["low", "medium", "high"],
    # Favorability
    ["very unfavorable", "somewhat unfavorable", "neutral", "somewhat favorable", "very favorable"],
    ["very unfavorable", "unfavorable", "neutral", "favorable", "very favorable"],
    # Quality
    ["very poor", "poor", "fair", "good", "excellent"],
    ["poor", "fair", "good", "very good", "excellent"],
]


def get_likert_order(values):
    """Return ordinal sort order if values match a known Likert scale, else None.

    Returns a dict mapping each value to its sort position, or None if no match.
    """
    normalized = {str(v).strip().lower(): str(v) for v in values}
    norm_set = set(normalized.keys())

    for scale in LIKERT_SCALES:
        scale_set = set(scale)
        # Match if the values are a subset of a known scale (allows partial scales)
        if norm_set.issubset(scale_set) and len(norm_set) >= 2:
            order = {normalized[s]: i for i, s in enumerate(scale) if s in norm_set}
            return order
        # Also try exact match
        if norm_set == scale_set:
            order = {normalized[s]: i for i, s in enumerate(scale)}
            return order

    return None


def generate_frequency_tables(data_path, analysis_plan_path, output_dir):
    df = pd.read_csv(data_path)

    with open(analysis_plan_path, encoding="utf-8") as f:
        plan = json.load(f)

    question_cols = plan["question_columns"]
    open_ended = plan.get("open_ended_columns", [])

    os.makedirs(output_dir, exist_ok=True)
    generated = []

    for col in question_cols:
        if col in open_ended:
            continue
        if col not in df.columns:
            print(f"WARNING: Column '{col}' not found in data, skipping")
            continue

        valid = df[col].dropna()
        if len(valid) == 0:
            print(f"WARNING: Column '{col}' has no valid responses, skipping")
            continue

        counts = valid.value_counts()

        # Sort: numeric → Likert ordinal → alphabetical fallback
        try:
            counts = counts.reindex(sorted(counts.index, key=float))
        except (ValueError, TypeError):
            likert_order = get_likert_order(counts.index)
            if likert_order is not None:
                counts = counts.reindex(sorted(counts.index, key=lambda v: likert_order.get(str(v), 999)))
            else:
                counts = counts.sort_index()

        total = len(valid)
        pct = (counts / total * 100).round(2)
        cum_pct = pct.cumsum().round(2)

        freq_df = pd.DataFrame(
            {
                "response_value": counts.index,
                "count": counts.values,
                "percent": pct.values,
                "cumulative_percent": cum_pct.values,
                "valid_n": total,
            }
        )

        filename = f"freq_{sanitize_filename(col)}.csv"
        freq_df.to_csv(os.path.join(output_dir, filename), index=False)
        generated.append(filename)
        print(f"  Generated: {filename} ({len(counts)} categories, N={total})")

    print(f"\nTotal frequency tables: {len(generated)}")
    return generated


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python frequency_table_template.py <data_path> <plan_path> <output_dir>")
        sys.exit(1)
    generate_frequency_tables(sys.argv[1], sys.argv[2], sys.argv[3])
