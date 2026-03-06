"""
Derived Importance Analysis Template

Calculates Pearson correlations and standardized regression coefficients
between brand attribute ratings and a purchase intent outcome variable.

Usage:
    python derived_importance_template.py <data_path> <output_dir>
"""
import sys
import numpy as np
import pandas as pd
from scipy import stats


def run_derived_importance(data_path, output_dir):
    df = pd.read_csv(data_path)

    # Attribute columns and outcome
    attribute_cols = sorted([c for c in df.columns if c.startswith('Q5_')])
    outcome_col = 'Q6_purchase_intent'

    attribute_labels = {
        'Q5_01': 'High quality overall',
        'Q5_02': 'Taste fresh',
        'Q5_03': 'Excellent sweetness/flavor',
        'Q5_04': 'Appealing appearance',
        'Q5_05': 'Good value for price',
        'Q5_06': 'Consistently good',
        'Q5_07': 'Widely available',
        'Q5_08': 'Committed to sustainability',
        'Q5_09': 'Attractive packaging',
        'Q5_10': 'Brand I trust',
        'Q5_11': 'Longer shelf life',
    }

    # Drop rows with NaN in relevant columns
    cols_needed = attribute_cols + [outcome_col]
    df_clean = df[cols_needed].dropna()
    print(f"Derived importance: {len(df_clean)} valid rows (dropped {len(df) - len(df_clean)} with NaN)")

    # Pearson correlations
    results = []
    for col in attribute_cols:
        r, p = stats.pearsonr(df_clean[col], df_clean[outcome_col])
        results.append({
            'attribute': col,
            'attribute_label': attribute_labels.get(col, col),
            'pearson_r': round(r, 4),
            'p_value': round(p, 6),
            'abs_r': round(abs(r), 4),
        })

    # Multiple regression for standardized betas
    X = df_clean[attribute_cols].values
    y = df_clean[outcome_col].values

    # Standardize both X and y
    X_mean = X.mean(axis=0)
    X_std = X.std(axis=0)
    y_mean = y.mean()
    y_std = y.std()

    # Handle zero-variance columns
    zero_var = X_std == 0
    if zero_var.any():
        print(f"Warning: {zero_var.sum()} attribute(s) have zero variance — beta set to 0")
        X_std[zero_var] = 1  # Avoid division by zero

    X_standardized = (X - X_mean) / X_std
    y_standardized = (y - y_mean) / y_std

    # OLS via least squares (SVD-based, handles multicollinearity)
    betas, residuals, rank, sv = np.linalg.lstsq(X_standardized, y_standardized, rcond=None)

    for i, col in enumerate(attribute_cols):
        if zero_var[i]:
            results[i]['standardized_beta'] = 0.0
        else:
            results[i]['standardized_beta'] = round(betas[i], 4)

    # Rank by absolute correlation
    results.sort(key=lambda x: x['abs_r'], reverse=True)
    for rank_num, r in enumerate(results, 1):
        r['rank'] = rank_num

    # Save output
    out_df = pd.DataFrame(results)
    col_order = ['attribute', 'attribute_label', 'pearson_r', 'p_value', 'standardized_beta', 'abs_r', 'rank']
    out_df = out_df[col_order]
    out_path = f"{output_dir}/derived_importance.csv"
    out_df.to_csv(out_path, index=False)

    print(f"Derived importance written to {out_path}")
    print(f"  {len(results)} attributes analyzed, N={len(df_clean)}")
    print(f"\nTop 3 drivers by correlation:")
    for r in results[:3]:
        print(f"  {r['rank']}. {r['attribute_label']}: r={r['pearson_r']}, beta={r['standardized_beta']}")


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python derived_importance_template.py <data_path> <output_dir>")
        sys.exit(1)
    run_derived_importance(sys.argv[1], sys.argv[2])
