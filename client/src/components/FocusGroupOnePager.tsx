/**
 * Focus Group Analysis — One-Pager Content
 * All copy is from the original document and must not be edited.
 *
 * DESIGN: The Studio — Warm White & Copper
 * Uses shared OnePager sub-components for consistent styling
 * Qualitative/organic feel — left-aligned, flowing narrative
 */

import ProjectOnePager, {
  OnePagerSection,
  OnePagerStage,
  OnePagerCapability,
  OnePagerNote,
  OnePagerResults,
} from "./ProjectOnePager";

interface FocusGroupOnePagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FocusGroupOnePager({
  open,
  onOpenChange,
}: FocusGroupOnePagerProps) {
  return (
    <ProjectOnePager
      open={open}
      onOpenChange={onOpenChange}
      headline="From Transcripts to Verified Executive Reports — Without the Manual Grind"
      badge="Capability Demo — Synthetic Data"
      intro="Focus group analysis is one of the most labor-intensive stages in qualitative research — days or weeks of reading transcripts, tagging themes, pulling quotes, comparing groups, and writing reports. I built a system that takes raw transcripts and does all of that, including producing verified executive deliverables, in a single run. Here's how it works."
      ctaText="If your team is spending days on work like this, I'd be happy to walk you through the system and discuss how it could fit your workflow."
    >
      {/* The Challenge */}
      <OnePagerSection title="The Challenge">
        <p className="text-foreground leading-relaxed">
          Every research firm knows the bottleneck. A project wraps fieldwork and
          the real work begins — analysts spend days reading transcripts line by
          line, tagging themes, pulling quotes, and building a synthesis across
          sessions. Then someone has to write the report. Then someone else has to
          build the deck. It's skilled, painstaking work, and it doesn't scale. A
          two-group project might take days; a ten-group study can take weeks. And
          throughout all of it, rigor matters — a misattributed quote, a finding
          that overstates consensus, or a claim that doesn't hold up when the
          client checks the transcript can undermine the entire deliverable. The
          system compresses that timeline from days or weeks into a single run,
          while building in the kind of verification that protects your
          credibility with clients.
        </p>
      </OnePagerSection>

      {/* The Approach */}
      <OnePagerSection title="The Approach">
        <p className="text-foreground leading-relaxed mb-6">
          The system coordinates ten specialized AI agents across four stages,
          each with a defined role and structured handoffs between them.
        </p>
        <div className="space-y-0">
          <OnePagerStage label="Stage 1">
            analyzes each transcript individually — identifying themes,
            extracting quotes with full attribution, and assessing group
            dynamics. Then a dedicated verification agent checks every extracted
            quote against the raw source transcript and corrects any errors
            before anything moves forward.
          </OnePagerStage>
          <OnePagerStage label="Stage 2">
            synthesizes findings across all sessions — mapping where groups
            agree, where they diverge, and what demographic patterns emerge. Each
            theme gets a consensus assessment: strong agreement, general
            alignment, mixed, or divided.
          </OnePagerStage>
          <OnePagerStage label="Stage 3">
            produces the executive report — a professional HTML document with
            eight sections, from executive summary through an appendix of
            verified quotes. A separate verification agent then re-checks every
            quote in the finished report against the original transcripts. If
            issues are found, the system corrects and re-verifies, up to three
            rounds.
          </OnePagerStage>
          <OnePagerStage label="Stage 4">
            produces a visual executive briefing — a slide-style HTML
            presentation designed for screen sharing. A three-agent creative team
            debates how to frame the findings for an executive audience before a
            production agent builds the final slides.
          </OnePagerStage>
        </div>
        <p className="text-foreground leading-relaxed mt-6">
          The key differentiator is the two-stage quote verification. Every
          participant quote gets checked against source transcripts twice — once
          during extraction, once in the final deliverable. That's the kind of
          rigor that protects your credibility with clients.
        </p>
      </OnePagerSection>

      {/* Key Capabilities */}
      <OnePagerSection title="Key Capabilities">
        <div className="space-y-4">
          <OnePagerCapability title="Automated Theme Extraction">
            Identifies themes, sentiment, and intensity across sessions without
            predefined codebooks.
          </OnePagerCapability>
          <OnePagerCapability title="Two-Stage Quote Verification">
            Every quote checked against raw transcripts at extraction and again
            in the final report. Misattributions and fabrications get caught
            before they reach your client.
          </OnePagerCapability>
          <OnePagerCapability title="Cross-Session Consensus Mapping">
            Automatically flags where groups agree and where they diverge, with
            demographic pattern detection built in.
          </OnePagerCapability>
          <OnePagerCapability title="Dual Deliverable Formats">
            Produces both a detailed analytical report and a visual executive
            briefing from a single analysis run. Both are self-contained HTML
            files — no special software needed.
          </OnePagerCapability>
          <OnePagerCapability title="Full Audit Trail">
            Timestamped pipeline log, structured data at every stage, and
            traceable links from final findings back to source transcripts.
          </OnePagerCapability>
          <OnePagerCapability title="Flexible Input">
            Handles multiple transcript formats, optional discussion guides,
            research objectives, and screener documents. Adapts the analysis plan
            to whatever supporting materials you provide.
          </OnePagerCapability>
        </div>
      </OnePagerSection>

      {/* Results */}
      <OnePagerSection title="Results">
        <OnePagerResults>
          In a demo run with two focus group sessions and 20 participants, the
          system extracted and verified 95+ participant quotes, identified five
          cross-cutting themes with consensus assessments, and produced both a
          comprehensive report and an executive briefing — from raw transcripts
          to final deliverables. The two-stage verification process caught and
          corrected quote errors before they reached the final output.
        </OnePagerResults>
      </OnePagerSection>

      {/* Data Note */}
      <OnePagerNote>
        This demo uses synthetic focus group data — a fictional study about berry
        preferences — specifically created to showcase the system's capabilities.
        No real client data is used or exposed in any project materials.
      </OnePagerNote>
    </ProjectOnePager>
  );
}
