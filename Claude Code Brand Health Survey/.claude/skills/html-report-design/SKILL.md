---
name: html-report-design
description:
  HTML/CSS design system for survey analysis reports. Defines the consulting-firm aesthetic, layout structure, color system, typography, table styling, chart patterns, and print CSS. Used by the HTML Designer subagent.
---

# HTML Report Design System

This skill defines the visual design system for the self-contained HTML survey report.
The aesthetic is **consulting firm quality** — clean, corporate, authoritative. Think
McKinsey, Deloitte, or BCG deliverable.

## Design Tokens

### Color Palette

```
Primary:
  --navy:        #1B2A4A    (headings, header bar, table headers)
  --navy-light:  #2D4A7A    (secondary headings, borders)
  --slate:       #475569    (body text, secondary text)
  --slate-light: #94A3B8    (captions, footnotes)

Backgrounds:
  --white:       #FFFFFF    (main content)
  --gray-50:     #F8FAFC    (alternating table rows, section backgrounds)
  --gray-100:    #F1F5F9    (sidebar, callout boxes)
  --gray-200:    #E2E8F0    (borders, dividers)

Accent:
  --blue:        #2563EB    (key metrics, links, chart highlights)
  --blue-light:  #DBEAFE    (metric backgrounds, highlighted rows)

Semantic:
  --green:       #059669    (positive indicators)
  --amber:       #D97706    (caution/warning indicators)
  --red:         #DC2626    (critical findings)
```

### Typography

```css
/* Headings: serif for authority */
h1, h2, h3 {
  font-family: Georgia, 'Times New Roman', serif;
  color: var(--navy);
  font-weight: 700;
}

/* Body: sans-serif for readability */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--slate);
  font-size: 16px;
  line-height: 1.6;
}

/* Data/numbers: monospace for alignment */
td.number, .metric-value {
  font-family: 'Consolas', 'Monaco', monospace;
  font-variant-numeric: tabular-nums;
}
```

### Spacing Scale

```
--space-xs:  0.25rem (4px)
--space-sm:  0.5rem  (8px)
--space-md:  1rem    (16px)
--space-lg:  1.5rem  (24px)
--space-xl:  2rem    (32px)
--space-2xl: 3rem    (48px)
```

## Page Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Survey Title} — Analysis Report</title>
  <style>
    /* All CSS goes here — no external stylesheets */
  </style>
</head>
<body>
  <header class="report-header">
    <!-- Navy bar with title and date -->
  </header>

  <nav class="table-of-contents">
    <!-- Anchor links to each section -->
  </nav>

  <main class="report-content">
    <section id="executive-summary">...</section>
    <section id="methodology">...</section>
    <section id="respondent-profile">...</section>
    <section id="key-findings">...</section>
    <section id="cross-tab-analysis">...</section>
    <section id="conclusions">...</section>
    <section id="appendix">...</section>
  </main>

  <footer class="report-footer">
    <!-- Generation date, data source reference -->
  </footer>

  <script>
    /* Optional: collapsible sections, TOC highlighting */
  </script>
</body>
</html>
```

## Component Patterns

### Report Header

```html
<header class="report-header">
  <div class="header-content">
    <h1 class="report-title">{Survey Title}</h1>
    <p class="report-subtitle">Survey Analysis Report</p>
    <p class="report-date">{Analysis Date}</p>
  </div>
</header>
```

Style: Navy background (#1B2A4A), white text, full-width bar, generous padding (2rem 3rem).

### Executive Summary Callout

```html
<section id="executive-summary" class="section">
  <h2>Executive Summary</h2>
  <div class="key-findings-box">
    <ul class="key-findings-list">
      <li><span class="metric">78.3%</span> of respondents reported familiarity...</li>
      <!-- 3-5 bullets with highlighted metrics -->
    </ul>
  </div>
</section>
```

Style: Light blue background (#DBEAFE) box with navy left border (4px). Metric spans use --blue color and bold weight.

### Data Tables

```html
<figure class="data-table-container">
  <figcaption>Table 1: Distribution of Responses to Q3</figcaption>
  <table class="data-table">
    <thead>
      <tr>
        <th>Response</th>
        <th class="number">Count</th>
        <th class="number">Percent</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Strongly Agree</td>
        <td class="number">127</td>
        <td class="number"><strong>42.3%</strong></td>
      </tr>
      <!-- alternating row colors via CSS -->
    </tbody>
  </table>
</figure>
```

Style:
- Header row: navy background, white text, uppercase small font
- Body rows: alternating white / gray-50
- Numbers: right-aligned, tabular-nums
- Borders: gray-200, 1px
- Container: centered, max-width 800px

### Inline SVG Bar Chart

For frequency distributions and demographic breakdowns:

```html
<figure class="chart-container">
  <figcaption>Figure 1: Familiarity with Cryptocurrencies</figcaption>
  <svg viewBox="0 0 500 200" class="bar-chart" role="img" aria-label="Bar chart showing...">
    <!-- Horizontal bars -->
    <g class="bar-group">
      <text x="140" y="30" text-anchor="end" class="bar-label">Very familiar</text>
      <rect x="150" y="18" width="180" height="20" fill="#2D4A7A" rx="2"/>
      <text x="335" y="33" class="bar-value">36.0%</text>
    </g>
    <!-- Repeat for each bar -->
  </svg>
</figure>
```

Style:
- Bars: navy-light color, 2px border-radius
- Labels: slate color, right-aligned left of bars
- Values: slate color, right of bars
- Accessible: role="img" and aria-label describing the chart

### Significance Highlight

For statistically significant findings:

```html
<div class="significance-callout">
  <span class="sig-badge">p = 0.003</span>
  <p>Younger respondents (18-24) showed significantly higher awareness
  (<strong>84.1%</strong>) compared to those 45+ (<strong>62.3%</strong>).</p>
</div>
```

Style: Left border in accent blue, subtle blue background, badge in small caps.

### Blockquote for Survey Questions

```html
<blockquote class="survey-question">
  "How familiar are you with cryptocurrencies?"
</blockquote>
```

Style: Left border gray-200, italic, slate-light color, indented.

## Print CSS

```css
@media print {
  .report-header { background: white; color: var(--navy); border-bottom: 3px solid var(--navy); }
  .table-of-contents { display: none; }
  nav { display: none; }
  section { page-break-inside: avoid; }
  .data-table-container { page-break-inside: avoid; }
  .chart-container { page-break-inside: avoid; }
  body { font-size: 11pt; line-height: 1.4; }
  a { color: var(--navy); text-decoration: none; }
  .report-footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 9pt; }
}
```

## Optional JavaScript

Only for progressive enhancement. The report must be fully usable without JS.

```javascript
// Collapsible sections
document.querySelectorAll('.section h2').forEach(h2 => {
  h2.style.cursor = 'pointer';
  h2.addEventListener('click', () => {
    const content = h2.nextElementSibling;
    // toggle visibility
  });
});

// Active TOC highlighting on scroll
// ... intersection observer pattern
```

## Self-Containment Checklist

Before finalizing the HTML file, verify:
- [ ] No `<link>` tags to external stylesheets
- [ ] No `<script src="">` tags to external scripts
- [ ] No `url()` references to external resources in CSS
- [ ] No `@import` in CSS
- [ ] No Google Fonts or other web font imports
- [ ] All images are inline SVG (no `<img src="">` tags)
- [ ] File opens correctly from `file://` protocol
- [ ] Print preview shows clean, readable output
- [ ] All heading hierarchy is correct (h1 > h2 > h3, no skipped levels)
- [ ] Tables have proper `<thead>` and `<tbody>` elements

## Reference Template

See `report_template.html` in this skill directory for a complete working example
with all CSS applied and placeholder content showing the expected visual structure.
