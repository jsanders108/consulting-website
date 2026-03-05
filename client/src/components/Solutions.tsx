/**
 * Solutions Page
 * Three solution sections using the reusable SolutionSection component
 * 1. Focus Group / Transcript Analysis — with one-pager modal
 * 2. Survey Analysis & Reporting — with one-pager modal
 * 3. Brand & Marketing Analytics — capabilities only (no one-pager yet)
 *
 * DESIGN: The Studio — Warm White & Copper
 */

import { useState } from "react";
import SolutionSection from "./SolutionSection";
import FocusGroupOnePager from "./FocusGroupOnePager";
import SurveyAnalysisOnePager from "./SurveyAnalysisOnePager";
import {
  FileText,
  Shield,
  Zap,
  BarChart3,
  Brain,
  Target,
  TrendingUp,
  Users,
  Layers,
  Search,
  RefreshCw,
  LineChart,
} from "lucide-react";

const THUMB_FOCUS_GROUP =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663291798489/DAEwzpX5KtJjLtj2F8MqRo/thumb-focus-group-gPENuNgG8L4JHsC8ZEa8TB.webp";
const THUMB_SURVEY =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663291798489/DAEwzpX5KtJjLtj2F8MqRo/thumb-survey-analysis-9yhUCzHq72Yiwr54PpjkVQ.webp";

export default function Solutions() {
  const [focusGroupOpen, setFocusGroupOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);

  return (
    <>
      {/* Solution 1: Transcript Analysis */}
      <SolutionSection
        id="solutions"
        eyebrow="Solution 1"
        title="Focus Group & Transcript Analysis"
        description="Turn hours of recorded discussions into structured, quote-verified reports — in minutes, not days. Built for firms that run qualitative research at scale and need to maintain rigor without the bottleneck."
        className="bg-background"
        onePagerThumbnail={THUMB_FOCUS_GROUP}
        onePagerLabel="Focus Group & Transcript Analysis"
        onOnePagerClick={() => setFocusGroupOpen(true)}
        capabilities={[
          {
            icon: FileText,
            title: "Multi-Language Transcription & Translation",
            text: "Handles recordings in any language, producing clean English-language transcripts with context preserved. No manual transcription or third-party translation steps required.",
          },
          {
            icon: Shield,
            title: "Every Quote Verified Against Source",
            text: "A second AI agent audits every quote in the final report against the original transcript with a timestamp — so nothing is fabricated, paraphrased, or taken out of context.",
          },
          {
            icon: Layers,
            title: "Survey + Discussion Data Integrated",
            text: "Automatically links pre-session survey responses with what participants actually said in discussion, surfacing patterns between stated attitudes and spoken feedback.",
          },
          {
            icon: Zap,
            title: "Client-Ready Output in Under an Hour",
            text: "Produces a detailed analytical report and an executive summary presentation — formatted and ready for delivery without manual cleanup.",
          },
        ]}
      />

      {/* Solution 2: Survey Analysis */}
      <SolutionSection
        eyebrow="Solution 2"
        title="Survey Analysis & Automated Reporting"
        description="Feed in raw survey data, get back a stakeholder-ready narrative report with every statistic independently verified. Adapts its methodology dynamically to any question structure — no pre-scripted logic required."
        className="bg-muted/30"
        onePagerThumbnail={THUMB_SURVEY}
        onePagerLabel="Survey Analysis & Automated Reporting"
        onOnePagerClick={() => setSurveyOpen(true)}
        capabilities={[
          {
            icon: Brain,
            title: "Adaptive Question Analysis",
            text: "Automatically detects question types — scales, rankings, open-ends, multi-select — and applies the appropriate analytical approach to each without manual configuration.",
          },
          {
            icon: BarChart3,
            title: "Statistical Accuracy Guaranteed",
            text: "A dedicated verification agent independently recalculates every percentage, mean, and cross-tab in the report before it's finalized. Zero tolerance for hallucinated statistics.",
          },
          {
            icon: RefreshCw,
            title: "Iterative Quality Loops",
            text: "Agents draft, review, and revise until quality gates are met — mimicking the back-and-forth between an analyst and a senior reviewer, compressed into minutes.",
          },
          {
            icon: Target,
            title: "Narrative, Not Just Numbers",
            text: "Produces reports written in the language of business strategy — with findings contextualized, implications drawn out, and recommendations clearly stated.",
          },
        ]}
      />

      {/* Solution 3: Brand & Marketing Analytics — no one-pager yet */}
      <SolutionSection
        eyebrow="Solution 3"
        title="Brand & Marketing Analytics"
        description="The same AI architecture applied to the problems marketing teams face every day — tracking brand health, understanding campaign effectiveness, synthesizing competitive intelligence, and turning customer feedback into strategic direction."
        className="bg-background"
        capabilities={[
          {
            icon: TrendingUp,
            title: "Brand Health Monitoring",
            text: "Automated ingestion and analysis of brand tracking data across markets — surfacing trends, anomalies, and competitive shifts without waiting for the quarterly deck.",
          },
          {
            icon: Users,
            title: "Customer Sentiment Synthesis",
            text: "Aggregates and analyzes feedback across channels — reviews, NPS, social, support tickets — to produce a unified view of how customers perceive your brand.",
          },
          {
            icon: Search,
            title: "Competitive Intelligence Automation",
            text: "Systematic monitoring and analysis of competitor positioning, messaging, and market activity — distilled into structured briefs your team can act on.",
          },
          {
            icon: LineChart,
            title: "Campaign & Creative Effectiveness",
            text: "Connects research data to marketing outcomes — which messages resonate, which audiences respond, and where to allocate budget based on evidence rather than intuition.",
          },
        ]}
      />

      {/* One-Pager Modals */}
      <FocusGroupOnePager
        open={focusGroupOpen}
        onOpenChange={setFocusGroupOpen}
      />
      <SurveyAnalysisOnePager
        open={surveyOpen}
        onOpenChange={setSurveyOpen}
      />
    </>
  );
}
