/**
 * Video Creation Pipeline — One-Pager Content
 * All copy is from the original document and must not be edited.
 *
 * DESIGN: The Studio — Warm White & Copper
 * Uses shared OnePager sub-components for consistent styling
 * Includes embedded video hero — unique to this one-pager
 */

import ProjectOnePager, {
  OnePagerSection,
  OnePagerStage,
  OnePagerCapability,
  OnePagerNote,
  OnePagerResults,
} from "./ProjectOnePager";

interface VideoCreationOnePagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VideoCreationOnePager({
  open,
  onOpenChange,
}: VideoCreationOnePagerProps) {
  return (
    <ProjectOnePager
      open={open}
      onOpenChange={onOpenChange}
      headline="From Research Report to Animated Video — In 90 Minutes"
      badge="Capability Demo — Synthetic Data"
      intro="Market research findings can reach a wider audience when they're packaged as something people can easily watch. 
      I built a system that reads a research report and produces a polished, two-minute animated video summarizing the key 
      findings — the kind of deliverable that actually gets watched in an executive's inbox. Three agent teams handle the work 
      across three stages: narrative and visual design, motion design, and video development. The video below was produced 
      from a focus group analysis report (using synthetic data) in about 60 minutes, with roughly 15 minutes of human review."
      ctaText="If you'd like to see how this could work with your research deliverables, I'd be happy to walk you through the system."
    >
      {/* Embedded Video Hero */}
      <div className="my-8">
        <video
          className="w-full rounded-lg shadow-lg"
          controls
          preload="metadata"
        >
          <source src="/video-creation-demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="text-muted-foreground text-sm mt-3 text-center">
          White Strawberry Campaign Research — a 13-scene animated summary
          produced from a focus group analysis report (using synthetic data)
        </p>
      </div>

      {/* The Challenge */}
      <OnePagerSection title="The Challenge">
        <p className="text-foreground leading-relaxed">
          Research teams invest weeks in fieldwork and analysis, then deliver
          findings in formats that compete for attention — long reports and dense
          slide decks. The insights are valuable, but the packaging limits their
          reach. A two-minute video summary would get watched; a 40-page report
          often doesn't. But producing that video manually requires a creative
          brief, a designer, a motion graphics artist, and a production cycle
          that can take weeks and cost thousands. The gap between what research
          teams deliver and what busy stakeholders will actually consume is a
          packaging problem, not a quality problem. This system closes that gap.
        </p>
      </OnePagerSection>

      {/* The Approach */}
      <OnePagerSection title="The Approach">
        <p className="text-foreground leading-relaxed mb-6">
          The system coordinates eleven specialized AI agents across three
          sequential stages, each with dedicated reviewers and structured
          approval workflows.
        </p>
        <div className="space-y-0">
          <OnePagerStage label="Stage 1 — Visual Storyboard">
            A five-agent team transforms the research report into a polished
            HTML storyboard. A writer reads the full report and crafts a
            scene-by-scene narrative outline — story arc, on-screen copy, and
            emotional beats. A designer then renders each scene as
            production-quality HTML at exact video resolution. Three reviewers —
            an editor, an executive-perspective reviewer who reads the outline
            cold without seeing the source report, and a research-integrity
            reviewer — evaluate each draft. The outline goes through up to three
            revision rounds and the HTML storyboard up to five, advancing only
            when all three reviewers approve.
          </OnePagerStage>
          <OnePagerStage label="Stage 2 — Animation Brief">
            A three-agent team designs the motion layer. A motion designer reads
            the approved storyboard and specifies entrance animations, internal
            motion — counter animations, sequential reveals, chart builds — exit
            transitions, and per-scene timing for every element. A motion editor
            checks feasibility and completeness, while an executive-perspective
            reviewer ensures the pacing will hold attention for two minutes. Up
            to five revision rounds, advancing only when both reviewers approve.
          </OnePagerStage>
          <OnePagerStage label="Stage 3 — Remotion Video">
            A three-agent team translates the storyboard and animation brief
            into working Remotion code — React and TypeScript components that
            render to video. A developer builds individual scene components, a
            theme system derived from the storyboard's design tokens, and a main
            composition that orchestrates all scenes with transitions. A code
            reviewer checks TypeScript correctness and API usage, while a visual
            QA reviewer compares rendered output frame-by-frame against the
            storyboard and animation brief. Up to five revision rounds before a
            final compilation check.
          </OnePagerStage>
        </div>
        <p className="text-foreground leading-relaxed mt-6">
          Each stage produces a distinct deliverable — storyboard, animation
          brief, video code — and each has its own approval gate. A dedicated
          polish agent makes targeted edits after team approval at every stage,
          catching issues like jargon in on-screen text, vague motion
          descriptions, or hardcoded values in the code.
        </p>
      </OnePagerSection>

      {/* Key Capabilities */}
      <OnePagerSection title="Key Capabilities">
        <div className="space-y-4">
          <OnePagerCapability title="Report to Video in a Single Pipeline">
            Drop in a research report — PDF, Word, Markdown, HTML — and the
            system handles everything from narrative extraction through final
            video code. No creative brief, no designer, no motion graphics
            artist.
          </OnePagerCapability>
          <OnePagerCapability title="Research-Integrity Review">
            A dedicated reviewer ensures findings are accurately represented at
            every stage. Data is not mischaracterized, statistics are not taken
            out of context, and the narrative faithfully reflects the original
            report's conclusions.
          </OnePagerCapability>
          <OnePagerCapability title="Cold-Read Comprehension Test">
            The executive-perspective reviewer evaluates the narrative outline
            without reading the source report — the most authentic test of
            whether the video will make sense to a viewer with no prior context.
          </OnePagerCapability>
          <OnePagerCapability title="Structured Convergence">
            Every deliverable goes through multiple rounds of review with
            explicit approval gates. Reviewers categorize feedback as must-fix,
            should-fix, or nice-to-have, and drafts only advance when all
            reviewers approve in the same round.
          </OnePagerCapability>
          <OnePagerCapability title="Visual Fidelity Pipeline">
            The HTML storyboard serves as an exact visual spec — not a wireframe
            or a description. The video developer matches colors, typography,
            layout, and spacing directly from the HTML, eliminating the
            interpretation gap that plagues prose-based creative briefs.
          </OnePagerCapability>
          <OnePagerCapability title="Production-Ready Output">
            The final Remotion project compiles to a standard React application.
            Preview in Remotion Studio, render to MP4, and deliver — no
            post-production software required.
          </OnePagerCapability>
        </div>
      </OnePagerSection>

      {/* Results */}
      <OnePagerSection title="Results">
        <OnePagerResults>
          In a demo run using a focus group analysis report, the system produced
          a 13-scene, two-minute animated video. The storyboard team built a
          narrative outline and rendered it as a production-quality HTML
          storyboard. The animation team specified entrance, internal, and exit
          motion for every element across all scenes. The video team built 13
          React/TypeScript scene components with a shared theme system and
          orchestrated composition — all in approximately 90 minutes from
          research report to finished video, with about 20 minutes of human
          review and minor visual adjustments.
        </OnePagerResults>
      </OnePagerSection>

      {/* Data Note */}
      <OnePagerNote>
        This demo uses a report generated from synthetic focus group data — a
        fictional study about white strawberry marketing campaigns —
        specifically created to showcase the system's capabilities. No real
        client data is used or exposed in any project materials.
      </OnePagerNote>
    </ProjectOnePager>
  );
}
