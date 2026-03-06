"""Adapted chi-square significance test script for Brand Health Survey."""
import hashlib, json, os, re
import pandas as pd
from scipy.stats import chi2_contingency

DATA_PATH = r"C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/cleaned/cleaned_data.csv"
PLAN_PATH = r"C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/analysis/analysis_plan.json"
OUT_DIR   = r"C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/analysis/significance_tests"

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

        if demo_col in category_mappings:
            demo_series = df[demo_col].map(category_mappings[demo_col])
        else:
            demo_series = df[demo_col]

        temp_df = pd.DataFrame({"demo": demo_series, "question": df[q_col]})
        subset = temp_df.dropna()

        if len(subset) < 10:
            results.append({
                "demographic_col": demo_col, "question_col": q_col,
                "chi2_statistic": None, "p_value": None, "degrees_of_freedom": None,
                "significant_05": False, "significant_01": False,
                "min_expected_freq": None, "assumption_warning": "Insufficient observations (N < 10)",
                "n_observations": len(subset),
            })
            continue

        observed = pd.crosstab(subset["question"], subset["demo"])
        observed = observed.loc[(observed != 0).any(axis=1)]
        observed = observed.loc[:, (observed != 0).any(axis=0)]

        if observed.shape[0] < 2 or observed.shape[1] < 2:
            results.append({
                "demographic_col": demo_col, "question_col": q_col,
                "chi2_statistic": None, "p_value": None, "degrees_of_freedom": None,
                "significant_05": False, "significant_01": False,
                "min_expected_freq": None, "assumption_warning": "Insufficient variation (< 2 rows or columns)",
                "n_observations": len(subset),
            })
            continue

        try:
            chi2, p_value, dof, expected = chi2_contingency(observed)
            min_expected = float(expected.min())
            results.append({
                "demographic_col": demo_col, "question_col": q_col,
                "chi2_statistic": round(chi2, 4), "p_value": round(p_value, 6),
                "degrees_of_freedom": int(dof),
                "significant_05": p_value < 0.05, "significant_01": p_value < 0.01,
                "min_expected_freq": round(min_expected, 2),
                "assumption_warning": "Expected frequency < 5 in some cells" if min_expected < 5 else "",
                "n_observations": len(subset),
            })
            expected_df = pd.DataFrame(expected, index=observed.index, columns=observed.columns)
            exp_filename = f"expected_{sanitize_filename(demo_col)}_{sanitize_filename(q_col)}.csv"
            expected_df.to_csv(os.path.join(OUT_DIR, exp_filename))
        except Exception as e:
            results.append({
                "demographic_col": demo_col, "question_col": q_col,
                "chi2_statistic": None, "p_value": None, "degrees_of_freedom": None,
                "significant_05": False, "significant_01": False,
                "min_expected_freq": None, "assumption_warning": f"Error: {str(e)}",
                "n_observations": len(subset),
            })

results_df = pd.DataFrame(results)
output_path = os.path.join(OUT_DIR, "significance_results.csv")
results_df.to_csv(output_path, index=False)

sig_05 = int(results_df["significant_05"].sum()) if len(results_df) > 0 else 0
sig_01 = int(results_df["significant_01"].sum()) if len(results_df) > 0 else 0
print(f"Chi-square tests completed: {len(results)}")
print(f"  Significant at p<0.05: {sig_05}")
print(f"  Significant at p<0.01: {sig_01}")
print(f"SIG05:{sig_05}")
print(f"SIG01:{sig_01}")
print(f"TOTAL:{len(results)}")
