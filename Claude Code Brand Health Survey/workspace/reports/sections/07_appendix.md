# Appendix

## A. Source Data Locations

| Data Type | File Count | Directory |
|---|---|---|
| Frequency tables | 38 | `workspace/analysis/frequency_tables/` |
| Banner tables | 152 | `workspace/analysis/banner_tables/` |
| Significance tests | — | `workspace/analysis/significance_tests/` |
| Derived importance | — | `workspace/analysis/derived_importance.csv` |

Full absolute paths:
- Frequency tables: `C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/analysis/frequency_tables/`
- Banner tables: `C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/analysis/banner_tables/`
- Significance tests: `C:/Users/jsand/OneDrive/Desktop/Claude Code Projects/Claude Code Brand Health Survey/workspace/analysis/significance_tests/`

---

## B. Summary of Frequency Tables Produced

The following frequency tables were produced by the data processor. "Top Response" refers to the modal response value.

### Table A1: Awareness and Purchase Frequency Tables

| Question | Description | Valid N | Top Response |
|---|---|---|---|
| Q1Q2_unaided_Acme_Strawberries | Unaided Acme recall | 800 | Not recalled (63.4%) |
| Q1Q2_unaided_Crimson_Crown_Berries | Unaided Crimson Crown recall | 800 | Not recalled |
| Q1Q2_unaided_Sunrise_Berries | Unaided Sunrise Berries recall | 800 | Not recalled |
| Q1Q2_unaided_Red_Valley_Organics | Unaided Red Valley recall | 800 | Not recalled |
| Q1Q2_unaided_FreshPick_Strawberries | Unaided FreshPick recall | 800 | Not recalled |
| Q1Q2_unaided_Golden_Meadow_Berries | Unaided Golden Meadow recall | 800 | Not recalled |
| Q1Q2_unaided_Harvest_Hill_Berries | Unaided Harvest Hill recall | 800 | Not recalled |
| Q3_aided_Acme_Strawberries | Aided Acme awareness | 800 | Recognized: 73.9% (591) |
| Q3_aided_Crimson_Crown_Berries | Aided Crimson Crown awareness | 800 | Recognized |
| Q3_aided_Sunrise_Berries | Aided Sunrise Berries awareness | 800 | Recognized |
| Q3_aided_Red_Valley_Organics | Aided Red Valley awareness | 800 | Recognized |
| Q3_aided_FreshPick_Strawberries | Aided FreshPick awareness | 800 | Recognized |
| Q3_aided_Golden_Meadow_Berries | Aided Golden Meadow awareness | 800 | Recognized |
| Q3_aided_Harvest_Hill_Berries | Aided Harvest Hill awareness | 800 | Recognized |
| Q4_purchased_Acme_Strawberries | Acme past-12-month purchase | 800 | Not purchased |
| Q4_purchased_Crimson_Crown_Berries | Crimson Crown purchase | 800 | Not purchased |
| Q4_purchased_Sunrise_Berries | Sunrise Berries purchase | 800 | Not purchased |
| Q4_purchased_Red_Valley_Organics | Red Valley purchase | 800 | Not purchased |
| Q4_purchased_FreshPick_Strawberries | FreshPick purchase | 800 | Not purchased |
| Q4_purchased_Golden_Meadow_Berries | Golden Meadow purchase | 800 | Not purchased |
| Q4_purchased_Harvest_Hill_Berries | Harvest Hill purchase | 800 | Not purchased |

### Table A2: Brand Evaluation Frequency Tables (Q5 — 5-Point Likert Scale)

| Question | Attribute | Valid N | Modal Response | Top-2-Box (Combined Waves) |
|---|---|---|---|---|
| Q5_01_quality_overall | High quality overall | 800 | 3 — Neutral (41.3%; 330/800) | 39.1% (313/800) |
| Q5_02_freshness | Taste fresh | 800 | 3 — Neutral (39.9%; 319/800) | 39.75% (318/800) |
| Q5_03_sweetness_flavor | Excellent sweetness/flavor | 800 | 3 — Neutral | — |
| Q5_04_appearance | Appealing appearance | 800 | 3 — Neutral | — |
| Q5_05_value_for_price | Good value for price | 800 | 3 — Neutral | — |
| Q5_06_consistency | Consistently good | 800 | 3 — Neutral | — |
| Q5_07_availability | Widely available | 800 | 3 — Neutral | — |
| Q5_08_sustainability | Committed to sustainability | 800 | 3 — Neutral | — |
| Q5_09_packaging | Attractive packaging | 800 | 3 — Neutral | — |
| Q5_10_trust | Brand I trust | 800 | 3 — Neutral (48.9%; 391/800) | 26.1% (209/800) |
| Q5_11_shelf_life | Longer shelf life than competitors | 800 | 3 — Neutral | — |

### Table A3: Purchase Intent, NPS, Frequency, and Preference Tables

| Question | Description | Valid N | Key Distribution |
|---|---|---|---|
| Q6_purchase_intent | Purchase intent (1–5) | 800 | Score 3: 58.3% (466); Positive (4+5): 28.75% (230); Negative (1+2): 13.0% (104) |
| Q7_category_frequency | Category strawberry purchase frequency | 800 | — |
| Q8_acme_frequency | Acme-specific purchase frequency | 800 | Weekly+: 6.4% combined (51/800) |
| Q9_last_brand_purchased | Most recent brand purchased | 800 | — |
| Q10_nps | Net Promoter Score (0–10) | 800 | Promoters (9–10): 18.6% (149); Detractors (0–6): 53.8% (430); NPS = -35 |
| Q11_brand_preference | Brand preference (equal price) | 754 | Top: Crimson Crown 27.3% (206); Acme 25.3% (191) |

---

## C. Summary of All Statistically Significant Cross-Tabulations (p < 0.05)

A total of 26 of 191 chi-square tests reached statistical significance at p < 0.05.

### Table A4: All Significant Cross-Tabulations

| Demographic | Question | Chi-Square | p-value | Direction | Notes |
|---|---|---|---|---|---|
| Year | Q10 — NPS | 130.976 | <0.001 | Strongly higher NPS scores in 2026 | Expected freq warning (min=3.5) |
| Year | Q5_01 — Quality overall | 76.611 | <0.001 | Top-2-box: 25.75% → 52.5% | +26.75 pp |
| Year | Q6 — Purchase intent | 76.323 | <0.001 | Positive intent: 16.75% → 40.75% | Expected freq warning (min=0.5) |
| Year | Q5_06 — Consistency | 52.618 | <0.001 | Top-2-box: 17.5% → 37.25% | +19.75 pp |
| Year | Q5_02 — Freshness | 45.947 | <0.001 | Top-2-box: 29.25% → 50.25% | +21 pp |
| Year | Q5_03 — Sweetness/flavor | 35.866 | <0.001 | Significantly higher in 2026 | 3rd-ranked driver |
| Year | Q11 — Brand preference | 34.373 | <0.001 | Acme: 15.95% → 34.38% (1st place) | Valid N=754 |
| Year | Q9 — Last brand purchased | 32.319 | <0.001 | Shifted toward Acme in 2026 | — |
| Year | Q8 — Acme purchase frequency | 29.659 | <0.001 | Weekly+: 3.0% → 9.75% | — |
| Year | Q3 — Aided Acme awareness | 29.948 | <0.001 | 65.25% → 82.5% | +17.25 pp |
| Year | Q5_07 — Availability | 28.155 | <0.001 | Changed in 2026 | Lowest driver rank |
| Year | Q5_10 — Trust | 26.495 | <0.001 | Top-2-box: 21.25% → 31.0% | +9.75 pp; high unique beta |
| Year | Q4 — Acme purchase rate | 15.384 | <0.001 | 28.5% → 42.0% | +13.5 pp |
| Year | Q4 — Crimson Crown purchase | 13.325 | <0.001 | 48.75% → 35.75% | -13 pp |
| Year | Q3 — Aided Crimson Crown awareness | 10.278 | 0.001 | Changed concurrent with Acme gains | — |
| Year | Q1/Q2 — Unaided Crimson Crown | 10.728 | 0.001 | Lower in 2026 | Competitive erosion |
| Year | Q1/Q2 — Unaided Acme recall | 10.001 | 0.002 | 30.75% → 41.75% | +11 pp |
| Year | Q1/Q2 — Unaided Sunrise Berries | 6.477 | 0.011 | Changed year-over-year | Minor competitor |
| Year | Q1/Q2 — Unaided FreshPick | 6.128 | 0.013 | Changed year-over-year | Minor competitor |
| Year | Q5_04 — Appearance | 11.212 | 0.024 | Higher in 2026 | 7th-ranked driver |
| Year | Q5_09 — Packaging | 11.145 | 0.025 | Changed in 2026 | 9th-ranked driver |
| Year | Q5_05 — Value for price | 3.878 | 0.423 | Not significant | — |
| Age (Q14) | Q3 — Harvest Hill aided awareness | 6.376 | 0.041 | Varies by age | Minor competitor |
| Age (Q14) | Q5_08 — Sustainability | 16.259 | 0.039 | Varies by age | 10th-ranked driver; min expected freq=5.73 |
| Gender (Q15) | Q5_11 — Shelf life | 16.661 | 0.034 | Varies by gender | **Unreliable: min expected freq=0.73** |
| Income (Q17) | Q5_01 — Quality overall | 18.845 | 0.016 | $100K+ lower Strongly agree (7.4%) | **Caution: min expected freq=3.14** |
| Income (Q17) | Q7 — Category frequency | 17.536 | 0.025 | Varies by income group | — |

*Note: Value/price (year × Q5_05, p=0.423) and shelf life (year × Q5_11, p=0.540) did not reach significance at p < 0.05.*

---

## D. Derived Importance — Full Results Table

### Table A5: All Brand Attribute Drivers of Purchase Intent — Complete Results

| Rank | Attribute Label | Column | Pearson r | Standardized Beta | p-value |
|---|---|---|---|---|---|
| 1 | High quality overall | Q5_01 | 0.4379 | 0.3358 | <0.001 |
| 2 | Taste fresh | Q5_02 | 0.3857 | 0.3003 | <0.001 |
| 3 | Excellent sweetness/flavor | Q5_03 | 0.2886 | 0.2159 | <0.001 |
| 4 | Brand I trust | Q5_10 | 0.2144 | 0.1361 | <0.001 |
| 5 | Good value for price | Q5_05 | 0.1552 | 0.1208 | <0.001 |
| 6 | Consistently good | Q5_06 | 0.1523 | 0.0638 | <0.001 |
| 7 | Appealing appearance | Q5_04 | 0.1455 | 0.0575 | <0.001 |
| 8 | Longer shelf life than competitors | Q5_11 | 0.1044 | 0.0744 | 0.003 |
| 9 | Attractive packaging | Q5_09 | 0.0796 | 0.0485 | 0.024 |
| 10 | Committed to sustainability | Q5_08 | 0.0702 | 0.0416 | 0.047 |
| 11 | Widely available | Q5_07 | 0.0672 | -0.0003 | 0.058 (NS) |

*NS = not statistically significant at p < 0.05. Rankings based on absolute Pearson r. Source: derived_importance.csv.*

---

## E. Data Limitations Reference

The following limitations apply to this analysis and should be considered when interpreting results:

1. **Cross-sectional wave design:** Year-over-year comparisons use different respondents in each wave. Individual-level switching behavior cannot be confirmed from aggregate share shifts.
2. **Chi-square expected frequency warnings:** Q6 × year (min=0.5) and Q10 × year (min=3.5) have cells below the conventional threshold of 5. Results are practically unaffected given the magnitude of effects.
3. **Income × quality warning:** Min expected frequency = 3.14; p-value of 0.016 may be unreliable.
4. **Gender × shelf life warning:** Min expected frequency = 0.73; p-value of 0.034 is likely unreliable.
5. **Q11 missing data:** 46 respondents (5.75%) did not answer brand preference; valid N = 754.
6. **Derived importance multicollinearity:** Top three sensory attributes are likely intercorrelated; individual beta values should be treated as directional.
7. **Derived importance is correlational:** Identifies associations with purchase intent; does not establish causation.
8. **Availability finding is sample-specific:** Zero unique beta reflects a screened sample of existing category purchasers for whom availability is already resolved.
9. **Demographic frequency tables unavailable:** Exact demographic composition (age, gender, state) cannot be reported from available files.
10. **Causal mechanisms for awareness growth are unobservable:** Reasons for brand awareness gains cannot be determined from survey data.
