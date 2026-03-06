"""Pre-scan survey data file and produce column metadata."""
import json
import os
import hashlib
import re
import pandas as pd
from pathlib import Path

def sanitize_filename(name, max_len=60):
    sanitized = re.sub(r'[^\w\s-]', '_', name).strip()
    sanitized = re.sub(r'\s+', '_', sanitized)
    if len(sanitized) > max_len:
        h = hashlib.md5(name.encode()).hexdigest()[:8]
        sanitized = sanitized[:max_len] + '_' + h
    return sanitized

def scan_columns():
    project_root = Path(__file__).resolve().parent.parent
    input_dir = project_root / 'input'
    output_dir = project_root / 'workspace' / 'analysis'
    output_dir.mkdir(parents=True, exist_ok=True)

    data_files = list(input_dir.glob('*.csv')) + list(input_dir.glob('*.xlsx')) + list(input_dir.glob('*.xls'))
    if not data_files:
        raise FileNotFoundError("No CSV or Excel file found in input/")
    data_file = data_files[0]

    if data_file.suffix == '.csv':
        df = pd.read_csv(data_file)
    else:
        df = pd.read_excel(data_file)

    columns = []
    for col in df.columns:
        series = df[col].dropna()
        unique_values = series.unique().tolist()
        sample_values = unique_values[:10]

        col_info = {
            "column_name": col,
            "sanitized_name": sanitize_filename(col),
            "dtype": str(df[col].dtype),
            "total_count": len(df[col]),
            "non_null_count": int(series.count()),
            "null_count": int(df[col].isnull().sum()),
            "unique_count": len(unique_values),
            "sample_values": [str(v) for v in sample_values],
            "all_unique_values": [str(v) for v in unique_values],
        }
        columns.append(col_info)

    summary = {
        "data_file": str(data_file),
        "total_rows": len(df),
        "total_columns": len(df.columns),
        "columns": columns
    }

    output_path = output_dir / 'column_summary.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print(f"Column summary written to {output_path}")
    print(f"  {len(df)} rows, {len(df.columns)} columns scanned")

if __name__ == '__main__':
    scan_columns()
