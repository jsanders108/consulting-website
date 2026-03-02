/**
 * Survey Analysis & Automated Reporting — One-Pager Content
 * All copy is from the original document and must not be edited.
 *
 * DESIGN: The Studio — Warm White & Copper
 * Uses shared OnePager sub-components for consistent styling
 * Quantitative/structured feel — same layout as focus group but
 * visually distinguishable through content structure
 */

import ProjectOnePager, {
  OnePagerSection,
  OnePagerStage,
  OnePagerCapability,
  OnePagerNote,
  OnePagerResults,
} from "./ProjectOnePager";

interface SurveyAnalysisOnePagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SurveyAnalysisOnePager({
  open,
  onOpenChange,
}: SurveyAnalysisOnePagerProps) {
  return (
    <ProjectOnePager
      open={open}
      onOpenChange={onOpenChange}
      headline="From Raw Survey Data to Verified Reports — Without the Manual Analysis"
      badge="Capability Demo — Synthetic Data"
      intro="Survey analysis follows the same pattern every time — export the data, build the tabs, write the report, build the deck. Much of that work is mechanical — cleaning, tabulating, formatting — but the analysis and interpretation that make a report valuable require real skill. Together, it takes days. I built a system that handles both, taking a raw survey file and producing a verified analytical report and executive briefing in a single run."
      ctaText="If your team is spending days turning survey data into reports, I'd be happy to walk you through the system and discuss how it could fit your workflow."
    >
      {/* The Challenge */}
      <OnePagerSection title="The Challenge">
        <p className="text-foreground leading-relaxed">
          Every research team knows how this goes. A survey closes and the data
          lands. Someone cleans it. Someone else runs the cross-tabs. An analyst
          writes up the findings, checking every number twice because one wrong
          percentage in a client deliverable undermines the whole project. Then
          someone builds a presentation from the report — reformatting the same
          findings into slides. The whole process takes days of skilled analyst
          time. The tabulation and verification are essential — one wrong
          percentage in a client deliverable undermines the whole project — but
          the real challenge is the analysis itself. You're working through
          hundreds of charts and tables to build a deliverable that doesn't just
          summarize results but provides actionable recommendations. That's the
          work that demands the most from an analyst, and it's where this
          system's ability to identify patterns and synthesize findings is most
          valuable.
        </p>
      </OnePagerSection>

      {/* The Approach */}
      <OnePagerSection title="The Approach">
        <p className="text-foreground leading-relaxed mb-6">
          The system coordinates thirteen specialized AI agents across four
          stages, each with a defined role and structured handoffs between them.
        </p>
        <div className="space-y-0">
          <OnePagerStage label="Stage 1">
            cleans the raw data file, classifies each column as a demographic or
            survey question, and runs the full statistical workbook — frequency
            tables, cross-tabulations across every demographic break, and
            chi-square significance tests. A validation script checks the outputs
            for internal consistency before anything moves forward.
          </OnePagerStage>
          <OnePagerStage label="Stage 2">
            is where analysis happens. One agent reads the statistical outputs
            and identifies patterns and themes — not just restating numbers, but
            interpreting what they mean together. A second agent then opens the
            source data files and independently verifies every statistic cited.
            Claims that don't hold up get corrected or excluded. A third agent
            assembles the verified findings into a structured analysis.
          </OnePagerStage>
          <OnePagerStage label="Stage 3">
            produces the report — a professional HTML document with an executive
            summary, methodology, demographic profile, thematic findings,
            cross-tabulation analysis, conclusions, and appendix. Then a
            dedicated verification agent checks every number in the finished
            report against the raw source data. Not against the analysis from
            Stage 2 — against the original data files, to catch any errors
            introduced along the way. If issues are found, the system corrects
            and re-verifies, up to three rounds.
          </OnePagerStage>
          <OnePagerStage label="Stage 4">
            produces a visual executive briefing. A three-agent creative team
            debates how to frame the findings for an executive audience, then a
            production agent builds the final slides — a scroll-snap HTML
            presentation with large metric callouts and inline charts.
          </OnePagerStage>
        </div>
      </OnePagerSection>

      {/* Key Capabilities */}
      <OnePagerSection title="Key Capabilities">
        <div className="space-y-4">
          <OnePagerCapability title="Automated Statistical Workbook">
            Frequency tables, demographic cross-tabs, and significance tests
            generated from a single data file. No manual tab-building.
          </OnePagerCapability>
          <OnePagerCapability title="Two-Layer Verification">
            Every statistic gets checked against source data twice: once during
            analysis, once in the final deliverable. The report verification
            agent independently checked 200 statistics in the demo run and found
            zero errors.
          </OnePagerCapability>
          <OnePagerCapability title="Thematic Analysis, Not Just Tables">
            The system identifies patterns across findings and organizes the
            report by themes, not by question number. Insights get challenged for
            overstatement before they reach the report.
          </OnePagerCapability>
          <OnePagerCapability title="Correction Loops">
            When verification catches an issue, the system fixes it and
            re-verifies automatically. No manual error-chasing.
          </OnePagerCapability>
          <OnePagerCapability title="Two Distinct Deliverables">
            A detailed analytical report for the research team and a visual
            executive briefing for stakeholders, both produced in the same run.
          </OnePagerCapability>
          <OnePagerCapability title="Self-Contained Output">
            Both deliverables are single HTML files. No software required to open
            them. Print-ready CSS included.
          </OnePagerCapability>
        </div>
      </OnePagerSection>

      {/* Results */}
      <OnePagerSection title="Results">
        <OnePagerResults>
          In a demo run on a 175-respondent survey, the system produced 6
          frequency tables, 24 cross-tabulation tables, and 24 significance
          tests. It identified 6 themes with 11 verified findings, produced a
          comprehensive analytical report and a 10-slide executive briefing, and
          verified 200 statistics in the final report with zero errors — all in
          approximately 85 minutes from raw data file to finished deliverables.
        </OnePagerResults>
      </OnePagerSection>

      {/* Data Note */}
      <OnePagerNote>
        This demo uses data from a real survey on cryptocurrency attitudes
        fielded through QuestionPro, with a sample of 175 respondents. No
        client data is used or exposed in any project materials.
      </OnePagerNote>
    </ProjectOnePager>
  );
}
