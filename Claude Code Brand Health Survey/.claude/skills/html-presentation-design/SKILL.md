---
name: html-presentation-design
description:
  HTML/CSS design system for executive survey briefings. Defines slide-style layout with scroll-snap, large metric components, chart patterns, navigation, and responsive design. Distinct from the Stage 3 report design. Used by the Presentation Designer subagent.
---

# HTML Executive Briefing Design System

This skill defines the visual design system for the self-contained HTML executive briefing.
The aesthetic is **executive presentation quality** — visual, spacious, and slide-like. Think
keynote presentation in a browser, NOT a dense report.

**This is NOT the Stage 3 report.** The report is detailed, text-heavy, and comprehensive.
The executive briefing is visual, metric-focused, and built for screen sharing. If your output
has paragraphs of text or dense tables, you've gone wrong.

## Design Tokens

### Color Palette

```
Primary:
  --navy:        #1B2A4A    (title/closing slide backgrounds, headings)
  --navy-light:  #2D4A7A    (secondary headings, subtle borders)
  --slate:       #475569    (body text, context labels)
  --slate-light: #94A3B8    (captions, footnotes, secondary text)

Backgrounds:
  --white:       #FFFFFF    (content slide backgrounds)
  --gray-50:     #F8FAFC    (alternate slide backgrounds for visual rhythm)
  --gray-100:    #F1F5F9    (card backgrounds, callout boxes)
  --gray-200:    #E2E8F0    (borders, dividers)

Accent:
  --blue:        #2563EB    (hero metrics, key numbers, chart highlights)
  --blue-light:  #DBEAFE    (metric label backgrounds, highlighted elements)

Semantic:
  --green:       #059669    (positive indicators, up arrows)
  --amber:       #D97706    (caution indicators)
  --red:         #DC2626    (critical findings, down arrows)
```

### Typography

```css
/* Slide titles: large serif for authority */
.slide-title {
  font-family: Georgia, 'Times New Roman', serif;
  color: var(--navy);
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
}

/* Hero metrics: oversized for impact */
.hero-metric {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 4rem;
  font-weight: 800;
  color: var(--blue);
  font-variant-numeric: tabular-nums;
}

/* Context text: readable sans-serif */
.context-text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--slate);
  font-size: 1.25rem;
  line-height: 1.6;
}

/* Data labels: clean and aligned */
.data-label {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1rem;
  color: var(--slate);
  font-variant-numeric: tabular-nums;
}
```

### Spacing Scale

```
--space-xs:   0.5rem   (8px)
--space-sm:   1rem     (16px)
--space-md:   2rem     (32px)
--space-lg:   3rem     (48px)
--space-xl:   4rem     (64px)
--space-2xl:  6rem     (96px)
```

Note: spacing is more generous than the report design. Presentations need room to breathe.

## Page Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Survey Title} — Executive Briefing</title>
  <style>
    /* All CSS here — no external stylesheets */

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html {
      scroll-snap-type: y mandatory;
      scroll-behavior: smooth;
    }

    .slide {
      min-height: 100vh;
      scroll-snap-align: start;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: var(--space-xl) var(--space-lg);
      position: relative;
    }

    .slide-content {
      max-width: 1000px;
      width: 100%;
    }
  </style>
</head>
<body>
  <!-- Progress indicator -->
  <nav class="progress-nav" aria-label="Slide navigation">
    <!-- Dots or numbers for each slide -->
  </nav>

  <section class="slide slide--dark" id="slide-1">
    <!-- Title slide -->
  </section>

  <section class="slide slide--light" id="slide-2">
    <!-- Content slide -->
  </section>

  <!-- ... more slides ... -->

  <section class="slide slide--dark" id="slide-closing">
    <!-- Closing slide -->
  </section>

  <script>
    /* Keyboard navigation + progress indicator updates */
  </script>
</body>
</html>
```

## Component Patterns

### Title Slide (Dark Background)

```html
<section class="slide slide--dark" id="slide-1">
  <div class="slide-content title-content">
    <p class="title-label">Survey Analysis</p>
    <h1 class="title-main">{Survey Title}</h1>
    <p class="title-hook">{Hook — one compelling sentence or stat}</p>
    <div class="title-meta">
      <span>{Date}</span>
      <span class="meta-separator">|</span>
      <span>{N} respondents</span>
    </div>
  </div>
</section>
```

Style:
- Background: navy (#1B2A4A)
- All text white
- Title: 3rem, serif, bold
- Hook: 1.5rem, sans-serif, lighter weight, slightly transparent white
- Meta: small, slate-light, bottom of slide
- Centered vertically and horizontally

### Key Metric Slide

```html
<section class="slide slide--light" id="slide-N">
  <div class="slide-content metric-content">
    <h2 class="slide-title">{Finding Headline}</h2>
    <div class="hero-metric-container">
      <span class="hero-metric">{78%}</span>
      <p class="metric-context">{of respondents said they would recommend the service}</p>
    </div>
    <p class="metric-detail">{1-2 sentences of additional context}</p>
  </div>
</section>
```

Style:
- Hero metric: 4-5rem, accent blue (#2563EB), bold
- Context: 1.25rem, slate, directly below the metric
- Slide title: 2rem, navy, serif
- White or gray-50 background
- All content vertically centered

### Comparison Slide

```html
<section class="slide slide--light" id="slide-N">
  <div class="slide-content comparison-content">
    <h2 class="slide-title">{Comparison Headline}</h2>
    <div class="comparison-cards">
      <div class="comparison-card">
        <span class="comparison-label">{Group A}</span>
        <span class="comparison-value comparison-value--high">{91%}</span>
      </div>
      <div class="comparison-divider">
        <span class="comparison-vs">vs</span>
      </div>
      <div class="comparison-card">
        <span class="comparison-label">{Group B}</span>
        <span class="comparison-value comparison-value--low">{62%}</span>
      </div>
    </div>
    <div class="comparison-footnote">
      <span class="sig-badge">p = {0.003}</span>
      <span>{Significance context}</span>
    </div>
  </div>
</section>
```

Style:
- Cards: side-by-side, centered, subtle border or background
- Values: 3-4rem, bold. High value in accent blue, low value in slate
- "vs" divider: small, circular, between cards
- Significance badge: small, rounded, blue background
- Responsive: stack vertically on narrow viewports

### Distribution Slide (Bar Chart)

```html
<section class="slide slide--light" id="slide-N">
  <div class="slide-content chart-content">
    <h2 class="slide-title">{Question or Distribution Title}</h2>
    <figure class="chart-figure">
      <svg viewBox="0 0 600 300" class="bar-chart" role="img"
           aria-label="{Accessible chart description}">
        <!-- Horizontal bars -->
        <g class="bar-group" transform="translate(0, 20)">
          <text x="180" y="15" text-anchor="end" class="bar-label">{Category}</text>
          <rect x="190" y="0" width="{proportional}" height="28" fill="#2D4A7A" rx="4"/>
          <text x="{end + 10}" y="18" class="bar-value">{42.3%}</text>
        </g>
        <!-- Repeat for each category, spaced 45px apart -->
      </svg>
    </figure>
  </div>
</section>
```

Style:
- Bars: navy-light fill, 4px border-radius, proportional width to max value
- Labels: right-aligned, left of bars, slate color, 1rem
- Values: right of bars, slate color, tabular-nums
- Chart centered in slide, max-width 700px
- Accessible: role="img" and aria-label

**Bar sizing rules:**
- Minimum bar height: 36px (the 28px example above is the compact minimum for ≤3 categories)
- For charts with 4+ categories: use 40px bars
- SVG viewBox height should be at least: (bar_count × (bar_height + 12)) + 40 for padding
- Bars must be tall enough that length differences are immediately visible at presentation scale

### Insight Slide (Cross-tab Finding)

```html
<section class="slide slide--light" id="slide-N">
  <div class="slide-content insight-content">
    <h2 class="slide-title">{Insight Headline}</h2>
    <p class="insight-narrative">{Plain language explanation of the finding}</p>
    <div class="insight-data">
      <!-- Mini comparison or chart showing the data -->
    </div>
    <div class="insight-significance">
      <span class="sig-badge">p = {value}</span>
      <span class="sig-label">Statistically significant difference</span>
    </div>
  </div>
</section>
```

### Closing Slide (Dark Background)

```html
<section class="slide slide--dark" id="slide-closing">
  <div class="slide-content closing-content">
    <h2 class="closing-title">Key Actions</h2>
    <ol class="action-list">
      <li class="action-item">
        <span class="action-number">1</span>
        <div class="action-text">
          <strong>{Action headline}</strong>
          <p>{Brief evidence reference}</p>
        </div>
      </li>
      <!-- 3-5 action items -->
    </ol>
    <div class="closing-meta">
      <p>{Survey Title} | {Date}</p>
      <p class="closing-generated">Generated {generation date}</p>
    </div>
  </div>
</section>
```

Style:
- Navy background, white text
- Action numbers: large, accent blue, circular
- Action text: white, clear hierarchy (bold headline, lighter detail)
- Meta: small, bottom, slate-light

## Progress Navigation

```html
<nav class="progress-nav" aria-label="Slide navigation">
  <div class="progress-dots">
    <button class="dot active" data-slide="1" aria-label="Slide 1"></button>
    <button class="dot" data-slide="2" aria-label="Slide 2"></button>
    <!-- ... one dot per slide -->
  </div>
</nav>
```

Style:
- Fixed position: right side, vertically centered
- Dots: 10px circles, gray-200 default, accent blue when active
- Transition: smooth color change
- Click: scrolls to corresponding slide
- Z-index above slides

## Keyboard Navigation

```javascript
// Arrow key navigation between slides
document.addEventListener('keydown', (e) => {
  const slides = document.querySelectorAll('.slide');
  const currentSlide = Math.round(window.scrollY / window.innerHeight);

  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault();
    const next = Math.min(currentSlide + 1, slides.length - 1);
    slides[next].scrollIntoView({ behavior: 'smooth' });
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault();
    const prev = Math.max(currentSlide - 1, 0);
    slides[prev].scrollIntoView({ behavior: 'smooth' });
  }
});

// Update progress dots on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const slideId = entry.target.id;
      document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      const activeDot = document.querySelector(`[data-slide="${slideId}"]`);
      if (activeDot) activeDot.classList.add('active');
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.slide').forEach(slide => observer.observe(slide));
```

## Print CSS

```css
@media print {
  html { scroll-snap-type: none; }
  .slide {
    min-height: auto;
    page-break-after: always;
    padding: 2rem;
  }
  .slide:last-child { page-break-after: avoid; }
  .progress-nav { display: none; }
  .slide--dark {
    background: white !important;
    color: var(--navy) !important;
    border-bottom: 3px solid var(--navy);
  }
  .slide--dark * { color: var(--navy) !important; }
  .hero-metric { color: var(--blue) !important; }
  body { font-size: 11pt; }
}
```

## Responsive Design

```css
/* Optimized for screen sharing (16:9) */
@media (min-aspect-ratio: 16/9) {
  .slide-content { max-width: 900px; }
  .hero-metric { font-size: 5rem; }
}

/* Standard viewport */
@media (max-width: 768px) {
  .slide { padding: var(--space-md); }
  .slide-title { font-size: 1.75rem; }
  .hero-metric { font-size: 3rem; }
  .comparison-cards { flex-direction: column; gap: var(--space-sm); }
  .progress-nav { display: none; }
}
```

## Visual Rhythm

Alternate slide backgrounds to create visual rhythm:
- **Slide 1 (Title):** Dark (navy)
- **Slide 2-3:** Light (white)
- **Slide 4:** Light (gray-50) — subtle shift
- **Slide 5-6:** Light (white)
- **Slide 7:** Light (gray-50)
- **Closing:** Dark (navy)

This prevents the "endless white" feeling while keeping the palette restrained.

## Self-Containment Checklist

Before finalizing the HTML file, verify:
- [ ] No `<link>` tags to external stylesheets
- [ ] No `<script src="">` tags to external scripts
- [ ] No `url()` references to external resources in CSS
- [ ] No `@import` in CSS
- [ ] No Google Fonts or other web font imports
- [ ] All charts are inline SVG (no `<img src="">` tags)
- [ ] File opens correctly from `file://` protocol
- [ ] Scroll-snap works — each slide fills the viewport
- [ ] Keyboard navigation works (arrow keys)
- [ ] Progress dots update on scroll
- [ ] Print preview shows one slide per page
- [ ] All text is readable — no text hidden behind dark backgrounds without white color

## Key Difference from Stage 3 Report

| Aspect | Stage 3 Report | Stage 4 Briefing |
|--------|---------------|-----------------|
| Layout | Scrollable document | Scroll-snap slides |
| Text density | Paragraphs + tables | Headlines + key stats |
| Charts | Supplementary | Focal point |
| Audience | Detailed readers | Executive screen-sharing |
| Navigation | Table of contents | Progress dots + arrows |
| Background | All white | Dark/light alternating |
| Metric size | Inline bold | 4-5rem hero numbers |
