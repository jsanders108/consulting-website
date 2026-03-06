"""Adapted frequency table script for Brand Health Survey."""
import hashlib, json, os, re
import pandas as pd

DATA_PATH = r"C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/cleaned/cleaned_data.csv"
PLAN_PATH = r"C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/analysis/analysis_plan.json"
OUT_DIR   = r"C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/analysis/frequency_tables"

LIKERT_SCALES = [
    ["strongly disagree","disagree","neutral","agree","strongly agree"],
    ["strongly disagree","disagree","neither agree nor disagree","agree","strongly agree"],
    ["strongly disagree","somewhat disagree","neutral","somewhat agree","strongly agree"],
    ["strongly disagree","somewhat disagree","neither agree nor disagree","somewhat agree","strongly agree"],
    ["very dissatisfied","dissatisfied","neutral","satisfied","very satisfied"],
    ["very dissatisfied","somewhat dissatisfied","neutral","somewhat satisfied","very satisfied"],
    ["very unlikely","unlikely","neutral","likely","very likely"],
    ["very unlikely","somewhat unlikely","neutral","somewhat likely","very likely"],
    ["never","rarely","sometimes","often","always"],
    ["not at all important","slightly important","moderately important","important","very important"],
    ["not important","slightly important","moderately important","important","very important"],
    ["strongly disagree","disagree","agree","strongly agree"],
    ["disagree","neutral","agree"],
    ["negative","neutral","positive"],
    ["low","medium","high"],
    ["very unfavorable","somewhat unfavorable","neutral","somewhat favorable","very favorable"],
    ["very unfavorable","unfavorable","neutral","favorable","very favorable"],
    ["very poor","poor","fair","good","excellent"],
    ["poor","fair","good","very good","excellent"],
]

def sanitize_filename(name, max_len=60):
    s = re.sub(r"[^a-zA-Z0-9_]", "_", str(name))
    if len(s) <= max_len:
        return s
    h = hashlib.md5(s.encode()).hexdigest()[:8]
    return s[:max_len-9] + "_" + h

def get_likert_order(values):
    normalized = {str(v).strip().lower(): str(v) for v in values}
    norm_set = set(normalized.keys())
    for scale in LIKERT_SCALES:
        scale_set = set(scale)
        if norm_set.issubset(scale_set) and len(norm_set) >= 2:
            return {normalized[s]: i for i, s in enumerate(scale) if s in norm_set}
        if norm_set == scale_set:
            return {normalized[s]: i for i, s in enumerate(scale)}
    return None

df = pd.read_csv(DATA_PATH)
with open(PLAN_PATH, encoding="utf-8") as f:
    plan = json.load(f)

question_cols = plan["question_columns"]
open_ended = plan.get("open_ended_columns", [])
os.makedirs(OUT_DIR, exist_ok=True)
generated = []

for col in question_cols:
    if col in open_ended:
        continue
    if col not in df.columns:
        print(f"WARNING: '{col}' not found in data, skipping")
        continue
    valid = df[col].dropna()
    if len(valid) == 0:
        print(f"WARNING: '{col}' has no valid responses, skipping")
        continue
    counts = valid.value_counts()
    try:
        counts = counts.reindex(sorted(counts.index, key=float))
    except (ValueError, TypeError):
        lo = get_likert_order(counts.index)
        if lo is not None:
            counts = counts.reindex(sorted(counts.index, key=lambda v: lo.get(str(v), 999)))
        else:
            counts = counts.sort_index()
    total = len(valid)
    pct = (counts / total * 100).round(2)
    cum_pct = pct.cumsum().round(2)
    freq_df = pd.DataFrame({
        "response_value": counts.index,
        "count": counts.values,
        "percent": pct.values,
        "cumulative_percent": cum_pct.values,
        "valid_n": total,
    })
    filename = f"freq_{sanitize_filename(col)}.csv"
    freq_df.to_csv(os.path.join(OUT_DIR, filename), index=False)
    generated.append(filename)
    print(f"  Generated: {filename} ({len(counts)} categories, N={total})")

print(f"\nTotal frequency tables: {len(generated)}")
print("GENERATED_FILES:" + "|".join(generated))
