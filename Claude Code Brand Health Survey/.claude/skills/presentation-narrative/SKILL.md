---
name: presentation-narrative
description:
  Guidelines for crafting executive survey presentation narratives. Defines story arc patterns, slide type taxonomy, finding selection criteria, and script format specification. Used by the concept team (Storyteller, Strategist, Script Writer).
---

# Executive Presentation Narrative Guidelines

This skill is used by the **concept team** in the Stage 4 Presentation Production pipeline:
the Visual Storyteller, Narrative Strategist, and Script Writer. It defines the narrative
framework, slide types, and script format for the executive briefing.

## Concept Team Context

The concept team works via broadcast dialogue:
- **Visual Storyteller** — proposes concepts, hero statistics, narrative arcs, surprising angles
- **Narrative Strategist** — evaluates proposals for executive audience fit, pushes for the most compelling findings
- **Script Writer** — observes the dialogue and produces the final `presentation_script.md` when the concept is locked

The concept team's output (the locked script) is the sole input for the production Designer.
Once the script is locked, the narrative arc is final — the Designer executes visually but does not restructure the story.

## Narrative Arc

Every executive presentation follows this arc:

### 1. Hook (Title Slide)
- Open with the single most surprising or consequential finding
- Frame it as a question or a bold statement
- Example: "78% of your customers can't name your core product" — not "Survey Results Overview"
- Include: survey name, date, sample size (briefly), the hook

### 2. Context (1 slide)
- Who was surveyed, how many responded, when
- Keep it to 3-4 data points maximum
- Purpose: establish credibility, not bore the audience

### 3. Findings (4-7 slides)
- Each slide = ONE finding or insight
- Lead with the most impactful finding, end with the second most impactful
- Middle slides build the story — each should connect to the next
- Vary the slide types: metric → comparison → distribution → insight → metric

### 4. Implications (1-2 slides)
- What do these findings mean together?
- Connect the dots across findings
- Identify the narrative theme: "Your audience is shifting," "Satisfaction is fragile," etc.

### 5. Call to Action (Closing Slide)
- 3-5 specific, actionable recommendations
- Each tied to a specific finding
- Prioritized: what to do first, second, third
- End with forward momentum, not a summary

## Slide Type Taxonomy

Use these slide types in the script to guide the Designer:

### Title
- Survey name, date, sample size
- Hook: one compelling sentence or statistic
- Dark background (navy)

### Key Metric
- ONE hero number, oversized and centered
- 1-2 lines of context below
- Example: "**84%** of respondents said they would recommend the service"
- Best for: headline findings, satisfaction scores, NPS

### Comparison
- Two or three metrics side-by-side
- Highlight the difference or gap
- Example: "18-24: **91%** vs. 55+: **62%**"
- Best for: demographic differences, before/after, segment comparisons
- Include the source banner table path in chart spec

### Distribution
- Full breakdown of responses to one question
- Horizontal bar chart (most readable for survey data)
- Show all categories with percentages
- Best for: Likert scales, multiple-choice distributions
- Include the source frequency table path in chart spec

### Insight
- A cross-tab finding with statistical significance
- Lead with the plain-language insight, then show the data
- Include the p-value as a credibility marker
- Best for: surprising demographic differences, significant associations

### Takeaway
- An actionable conclusion drawn from the findings
- Pair the recommendation with the evidence that supports it
- Best for: transitions between finding sections, building toward the close

### Closing
- 3-5 action items, each linked to a finding
- Survey title and date for reference
- Dark background (navy) to bookend with the title slide

## Finding Selection Criteria

You have an entire survey analysis. You can only show 8-12 slides. Choose findings that:

1. **Surprise Factor** — Does this challenge what the audience assumed?
2. **Magnitude** — Is the number large enough to be meaningful? 51% vs 49% is not a slide. 84% vs 32% is.
3. **Statistical Significance** — Cross-tab differences with p < 0.05 have scientific backing.
4. **Actionability** — Does this finding imply something the audience should DO?
5. **Narrative Connection** — Does this finding connect to others to form a story?

**Kill criteria** — Do NOT include a finding if:
- The sample size is too small to be meaningful (< 30 per subgroup)
- The result is exactly what everyone expected (no surprise value)
- It requires extensive explanation to understand
- It doesn't connect to the rest of the narrative

## Script Format Specification

Write the script as a markdown file with this structure:

```markdown
# Presentation Script: [Survey Title]

**Total slides:** [N]
**Narrative theme:** [One sentence describing the overall story]
**Target audience:** [Who this presentation is for]

---

## Slide 1: Title

**Title:** [Survey name or hook question]

**Headline Stat:** [The hook number, if using a stat-based hook]

**Narrative:** [What makes this survey worth paying attention to? Set up the story.]

**Chart Specification:** None — text and branding only

**Talking Points:**
- [Survey context: who, when, how many]
- [The hook: why should the audience care?]

---

## Slide 2: [Slide Type]

**Title:** [Headline text — punchy, max 8 words]

**Headline Stat:** [The anchor number for this slide]

**Narrative:** [2-3 sentences: what does this mean in plain language?]

**Chart Specification:** [Chart type] from [source_file_path.csv], plotting [which columns/values]

**Talking Points:**
- [Key takeaway]
- [Supporting detail]

---
[... repeat for each slide ...]
```

## Framing Techniques

- **Lead with the surprising:** "Despite high overall satisfaction..." not "Overall satisfaction was 4.2/5"
- **Anchor with the concrete:** "3 out of 4 employees" is more vivid than "75%"
- **Contextualize comparisons:** "Nearly double the rate" not just "62% vs 34%"
- **Use plain language first:** "Most respondents are unfamiliar" then "(only 23% rated themselves as very familiar)"
- **Close with the actionable:** "This suggests..." or "Teams should consider..."

## Rules

- Use **EXACT numbers** from `refined_analysis.json`. Do not round, recompute, or reinterpret.
- **8-12 slides total** — enough to tell the story, not so many that the audience loses interest
- Every slide must pass the **"so what" test** — why does this matter to the audience?
- Do NOT write HTML, CSS, or design code — production happens in Phase 2
- If project objectives exist, ensure the narrative addresses each one
- Include source file paths in chart specifications so the Designer can pull real data
