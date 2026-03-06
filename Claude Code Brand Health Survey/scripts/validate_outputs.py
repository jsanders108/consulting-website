"""Validate Stage 1 outputs for internal consistency."""
import json
import os
import sys
import pandas as pd
from pathlib import Path

def validate():
    project_root = Path(__file__).resolve().parent.parent
    workspace = project_root / 'workspace'
    errors = []
    warnings = []

    # 1. Validate cleaning outputs
    cleaned_csv = workspace / 'cleaned' / 'cleaned_data.csv'
    cleaning_summary = workspace / 'cleaned' / 'cleaning_summary.json'

    if not cleaned_csv.exists():
        errors.append("cleaned_data.csv not found")
    else:
        df_cleaned = pd.read_csv(cleaned_csv)
        if not cleaning_summary.exists():
            errors.append("cleaning_summary.json not found")
        else:
            with open(cleaning_summary, 'r') as f:
                cs = json.load(f)
            expected_rows = cs.get('cleaned_rows', cs.get('rows_after', 0))
            if expected_rows and abs(len(df_cleaned) - expected_rows) > 0:
                errors.append(f"Cleaning: CSV has {len(df_cleaned)} rows but summary says {expected_rows}")
            expected_cols = cs.get('columns', cs.get('columns_after', 0))
            if expected_cols and abs(len(df_cleaned.columns) - expected_cols) > 1:
                warnings.append(f"Cleaning: CSV has {len(df_cleaned.columns)} columns but summary says {expected_cols}")

    # 2. Validate frequency tables
    freq_dir = workspace / 'analysis' / 'frequency_tables'
    freq_files = list(freq_dir.glob('freq_*.csv')) if freq_dir.exists() else []

    for ff in freq_files:
        try:
            freq_df = pd.read_csv(ff)
            if 'Percentage' in freq_df.columns or 'percentage' in freq_df.columns:
                pct_col = 'Percentage' if 'Percentage' in freq_df.columns else 'percentage'
                pct_sum = freq_df[pct_col].sum()
                if abs(pct_sum - 100.0) > 5.0:
                    errors.append(f"Frequency {ff.name}: percentages sum to {pct_sum:.1f}% (expected ~100%)")
            if 'Count' in freq_df.columns or 'count' in freq_df.columns:
                cnt_col = 'Count' if 'Count' in freq_df.columns else 'count'
                count_sum = freq_df[cnt_col].sum()
                if cleaned_csv.exists():
                    total = len(pd.read_csv(cleaned_csv))
                    if count_sum > total * 1.1:
                        warnings.append(f"Frequency {ff.name}: count sum {count_sum} exceeds total rows {total}")
        except Exception as e:
            errors.append(f"Frequency {ff.name}: failed to parse — {e}")

    # 3. Validate banner tables
    banner_dir = workspace / 'analysis' / 'banner_tables'
    banner_files = list(banner_dir.glob('banner_*.csv')) if banner_dir.exists() else []

    for bf in banner_files:
        try:
            banner_df = pd.read_csv(bf)
            pct_rows = banner_df[banner_df.iloc[:, 0].astype(str).str.contains('%|pct|Pct|PCT', na=False)]
            for _, row in pct_rows.iterrows():
                numeric_vals = pd.to_numeric(row.iloc[1:], errors='coerce').dropna()
                if len(numeric_vals) > 0:
                    row_sum = numeric_vals.sum()
                    if abs(row_sum - 100.0) > 10.0 and row_sum > 0:
                        warnings.append(f"Banner {bf.name}: pct row sums to {row_sum:.1f}%")
        except Exception as e:
            warnings.append(f"Banner {bf.name}: could not fully validate — {e}")

    # 4. Validate significance tests
    sig_file = workspace / 'analysis' / 'significance_tests' / 'significance_results.csv'
    if sig_file.exists():
        try:
            sig_df = pd.read_csv(sig_file)
            if 'p_value' in sig_df.columns:
                invalid_p = sig_df[(sig_df['p_value'] < 0) | (sig_df['p_value'] > 1)]
                if len(invalid_p) > 0:
                    errors.append(f"Significance: {len(invalid_p)} rows have p-value outside [0, 1]")
            if 'chi2_statistic' in sig_df.columns:
                valid_chi = sig_df['chi2_statistic'].dropna()
                neg_chi = valid_chi[valid_chi < 0]
                if len(neg_chi) > 0:
                    errors.append(f"Significance: {len(neg_chi)} rows have negative chi-square")
            if 'significant_05' in sig_df.columns and 'p_value' in sig_df.columns:
                for _, row in sig_df.iterrows():
                    is_sig = str(row.get('significant_05', '')).lower() in ['true', 'yes', '1']
                    p = row.get('p_value', 1.0)
                    if pd.isna(p):
                        continue
                    if is_sig and p >= 0.05:
                        warnings.append(f"Significance: flagged significant but p={p:.4f} >= 0.05")
                    elif not is_sig and p < 0.05:
                        warnings.append(f"Significance: not flagged significant but p={p:.4f} < 0.05")
        except Exception as e:
            errors.append(f"Significance results: failed to parse — {e}")

    # 5. Validate derived importance analysis
    di_file = workspace / 'analysis' / 'derived_importance.csv'
    if not di_file.exists():
        errors.append("derived_importance.csv not found")
    else:
        try:
            di_df = pd.read_csv(di_file)
            # Check expected columns
            expected_cols_di = ['attribute', 'attribute_label', 'pearson_r', 'p_value']
            for col in expected_cols_di:
                if col not in di_df.columns:
                    errors.append(f"Derived importance: missing column '{col}'")
            # Check row count (should have 11 Q5 attributes)
            if len(di_df) != 11:
                warnings.append(f"Derived importance: expected 11 rows but found {len(di_df)}")
            # Validate correlation values in [-1, 1]
            if 'pearson_r' in di_df.columns:
                invalid_r = di_df[(di_df['pearson_r'] < -1) | (di_df['pearson_r'] > 1)]
                if len(invalid_r) > 0:
                    errors.append(f"Derived importance: {len(invalid_r)} rows have pearson_r outside [-1, 1]")
            # Validate p-values in [0, 1]
            if 'p_value' in di_df.columns:
                invalid_p = di_df[(di_df['p_value'] < 0) | (di_df['p_value'] > 1)]
                if len(invalid_p) > 0:
                    errors.append(f"Derived importance: {len(invalid_p)} rows have p-value outside [0, 1]")
            # Validate standardized betas if present
            if 'standardized_beta' in di_df.columns:
                invalid_beta = di_df[(di_df['standardized_beta'] < -2) | (di_df['standardized_beta'] > 2)]
                if len(invalid_beta) > 0:
                    warnings.append(f"Derived importance: {len(invalid_beta)} rows have unusually large standardized_beta")
        except Exception as e:
            errors.append(f"Derived importance: failed to parse — {e}")

    # 6. Validate analysis summary
    summary_file = workspace / 'analysis' / 'analysis_summary.json'
    if not summary_file.exists():
        errors.append("analysis_summary.json not found")
    else:
        try:
            with open(summary_file, 'r') as f:
                summary = json.load(f)
            reported_freq = summary.get('frequency_tables_count', summary.get('total_frequency_tables', 0))
            if reported_freq and abs(reported_freq - len(freq_files)) > 0:
                warnings.append(f"Summary: reports {reported_freq} freq tables but found {len(freq_files)}")
            reported_banner = summary.get('banner_tables_count', summary.get('total_banner_tables', 0))
            if reported_banner and abs(reported_banner - len(banner_files)) > 0:
                warnings.append(f"Summary: reports {reported_banner} banner tables but found {len(banner_files)}")
        except Exception as e:
            errors.append(f"analysis_summary.json: failed to parse — {e}")

    # Report results
    print("=" * 60)
    print("STAGE 1 OUTPUT VALIDATION")
    print("=" * 60)

    if errors:
        print(f"\nERRORS ({len(errors)}):")
        for e in errors:
            print(f"  [X] {e}")

    if warnings:
        print(f"\nWARNINGS ({len(warnings)}):")
        for w in warnings:
            print(f"  [!] {w}")

    if not errors and not warnings:
        print("\n[OK] All checks passed -- outputs are internally consistent.")
    elif not errors:
        print(f"\n[OK] No errors. {len(warnings)} warning(s) -- review recommended but not blocking.")

    print("=" * 60)

    if errors:
        print(f"\nVALIDATION FAILED -- {len(errors)} error(s) found.")
        sys.exit(1)
    else:
        print("\nVALIDATION PASSED")
        sys.exit(0)

if __name__ == '__main__':
    validate()
