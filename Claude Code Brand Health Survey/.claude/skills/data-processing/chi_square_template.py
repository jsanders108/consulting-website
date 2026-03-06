"""
Chi-Square Significance Test Template

Runs chi-square tests of independence on every demographic x question
cross-tabulation and produces a consolidated results CSV.

Usage:
    python chi_square_template.py <data_path> <analysis_plan_path> <output_dir>
"""

import hashlib
import json
import os
import re
import sys

import pandas as pd
from scipy.stats import chi2_contingency


def sanitize_filename(name, max_len=60):
    sanitized = re.sub(r"[^a-zA-Z0-9_]", "_", str(name))
    if len(sanitized) <= max_len:
        return sanitized
    hash_suffix = hashlib.md5(sanitized.encode()).hexdigest()[:8]
    return sanitized[: max_len - 9] + "_" + hash_suffix


def run_chi_square_tests(data_path, analysis_plan_path, output_dir):
    df = pd.read_csv(data_path)

    with open(analysis_plan_path, encoding="utf-8") as f:
        plan = json.load(f)

    demo_cols = plan["demographic_columns"]
    question_cols = plan["question_columns"]
    open_ended = plan.get("open_ended_columns", [])
    category_mappings = plan.get("category_mappings", {})

    os.makedirs(output_dir, exist_ok=True)
    results = []

    for demo_col in demo_cols:
        if demo_col not in df.columns:
            continue
        if df[demo_col].nunique() > 20 and demo_col not in category_mappings:
            continue

        for q_col in question_cols:
            if q_col in open_ended:
                continue
            if q_col not in df.columns:
                continue
            if df[q_col].nunique() > 30:
                continue

            # Apply category mapping if one exists for this demographic
            if demo_col in category_mappings:
                demo_series = df[demo_col].map(category_mappings[demo_col])
            else:
                demo_series = df[demo_col]

            temp_df = pd.DataFrame({"demo": demo_series, "question": df[q_col]})
            subset = temp_df.dropna()
            if len(subset) < 10:
                results.append(
                    {
                        "demographic_col": demo_col,
                        "question_col": q_col,
                        "chi2_statistic": None,
                        "p_value": None,
                        "degrees_of_freedom": None,
                        "significant_05": False,
                        "significant_01": False,
                        "min_expected_freq": None,
                        "assumption_warning": "Insufficient observations (N < 10)",
                        "n_observations": len(subset),
                    }
                )
                continue

            observed = pd.crosstab(subset["question"], subset["demo"])

            # Remove rows or columns that are all zeros
            observed = observed.loc[(observed != 0).any(axis=1)]
            observed = observed.loc[:, (observed != 0).any(axis=0)]

            if observed.shape[0] < 2 or observed.shape[1] < 2:
                results.append(
                    {
                        "demographic_col": demo_col,
                        "question_col": q_col,
                        "chi2_statistic": None,
                        "p_value": None,
                        "degrees_of_freedom": None,
                        "significant_05": False,
                        "significant_01": False,
                        "min_expected_freq": None,
                        "assumption_warning": "Insufficient variation (< 2 rows or columns)",
                        "n_observations": len(subset),
                    }
                )
                continue

            try:
                chi2, p_value, dof, expected = chi2_contingency(observed)
                min_expected = float(expected.min())

                results.append(
                    {
                        "demographic_col": demo_col,
                        "question_col": q_col,
                        "chi2_statistic": round(chi2, 4),
                        "p_value": round(p_value, 6),
                        "degrees_of_freedom": int(dof),
                        "significant_05": p_value < 0.05,
                        "significant_01": p_value < 0.01,
                        "min_expected_freq": round(min_expected, 2),
                        "assumption_warning": (
                            "Expected frequency < 5 in some cells"
                            if min_expected < 5
                            else ""
                        ),
                        "n_observations": len(subset),
                    }
                )

                # Save expected frequencies for this combination
                expected_df = pd.DataFrame(
                    expected, index=observed.index, columns=observed.columns
                )
                exp_filename = f"expected_{sanitize_filename(demo_col)}_{sanitize_filename(q_col)}.csv"
                expected_df.to_csv(os.path.join(output_dir, exp_filename))

            except Exception as e:
                results.append(
                    {
                        "demographic_col": demo_col,
                        "question_col": q_col,
                        "chi2_statistic": None,
                        "p_value": None,
                        "degrees_of_freedom": None,
                        "significant_05": False,
                        "significant_01": False,
                        "min_expected_freq": None,
                        "assumption_warning": f"Error: {str(e)}",
                        "n_observations": len(subset),
                    }
                )

    results_df = pd.DataFrame(results)
    output_path = os.path.join(output_dir, "significance_results.csv")
    results_df.to_csv(output_path, index=False)

    sig_05 = results_df["significant_05"].sum() if len(results_df) > 0 else 0
    sig_01 = results_df["significant_01"].sum() if len(results_df) > 0 else 0
    print(f"\nChi-square tests completed: {len(results)}")
    print(f"  Significant at p<0.05: {sig_05}")
    print(f"  Significant at p<0.01: {sig_01}")
    print(f"  Results saved to: {output_path}")

    return results


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python chi_square_template.py <data_path> <plan_path> <output_dir>")
        sys.exit(1)
    run_chi_square_tests(sys.argv[1], sys.argv[2], sys.argv[3])
