"""Adapted derived importance script for Brand Health Survey."""
import numpy as np
import pandas as pd
from scipy import stats

DATA_PATH = r"C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/cleaned/cleaned_data.csv"
OUT_DIR   = r"C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/analysis"

df = pd.read_csv(DATA_PATH)

# Q5 columns in this dataset have full names like Q5_01_quality_overall
attribute_cols = sorted([c for c in df.columns if c.startswith("Q5_")])
outcome_col = "Q6_purchase_intent"

# Map from column prefix to label
attribute_labels = {
    "Q5_01": "High quality overall",
    "Q5_02": "Taste fresh",
    "Q5_03": "Excellent sweetness/flavor",
    "Q5_04": "Appealing appearance",
    "Q5_05": "Good value for price",
    "Q5_06": "Consistently good",
    "Q5_07": "Widely available",
    "Q5_08": "Committed to sustainability",
    "Q5_09": "Attractive packaging",
    "Q5_10": "Brand I trust",
    "Q5_11": "Longer shelf life",
}

def get_label(col):
    for prefix, label in attribute_labels.items():
        if col.startswith(prefix):
            return label
    return col

print(f"Attribute columns found: {attribute_cols}")
print(f"Outcome column: {outcome_col}, in data: {outcome_col in df.columns}")

cols_needed = attribute_cols + [outcome_col]
df_clean = df[cols_needed].dropna()
print(f"Valid rows: {len(df_clean)} (dropped {len(df) - len(df_clean)} with NaN)")

results = []
for col in attribute_cols:
    r, p = stats.pearsonr(df_clean[col], df_clean[outcome_col])
    results.append({
        "attribute": col,
        "attribute_label": get_label(col),
        "pearson_r": round(r, 4),
        "p_value": round(p, 6),
        "abs_r": round(abs(r), 4),
    })

X = df_clean[attribute_cols].values
y = df_clean[outcome_col].values

X_mean = X.mean(axis=0)
X_std = X.std(axis=0)
y_mean = y.mean()
y_std = y.std()

zero_var = X_std == 0
if zero_var.any():
    print(f"Warning: {zero_var.sum()} attribute(s) have zero variance")
    X_std[zero_var] = 1

X_z = (X - X_mean) / X_std
y_z = (y - y_mean) / y_std

betas, _, _, _ = np.linalg.lstsq(X_z, y_z, rcond=None)

for i, col in enumerate(attribute_cols):
    results[i]["standardized_beta"] = 0.0 if zero_var[i] else round(betas[i], 4)

results.sort(key=lambda x: x["abs_r"], reverse=True)
for rank_num, r in enumerate(results, 1):
    r["rank"] = rank_num

out_df = pd.DataFrame(results)[["attribute","attribute_label","pearson_r","p_value","standardized_beta","abs_r","rank"]]
out_path = f"{OUT_DIR}/derived_importance.csv"
out_df.to_csv(out_path, index=False)

print(f"\nDerived importance written to {out_path}")
print(f"Attributes analyzed: {len(results)}, N={len(df_clean)}")
print("\nTop 3 drivers:")
for r in results[:3]:
    print(f"  {r['rank']}. {r['attribute_label']}: r={r['pearson_r']}, beta={r['standardized_beta']}")
print(f"VALID_N:{len(df_clean)}")
print(f"ATTRS:{len(results)}")
for r in results[:3]:
    print(f"TOP3:{r['attribute_label']}|r={r['pearson_r']}")
