/**
 * Case Study Section
 * Condensed case study with NDA note
 *
 * DESIGN: The Studio — Warm White & Copper
 * Uses the geometric accent image as a decorative element
 * Card with warm border, editorial typography
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";

const ACCENT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663291798489/DAEwzpX5KtJjLtj2F8MqRo/case-study-accent-3HSyuUoNLuz2mmert5wWBH.webp";

export default function CaseStudy() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const el = sectionRef.current;
    if (el) {
      const revealElements = el.querySelectorAll(".reveal");
      revealElements.forEach((child) => observer.observe(child));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="case-study" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Decorative accent image */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 opacity-10 pointer-events-none">
        <img
          src={ACCENT_IMG}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="container relative z-10" ref={sectionRef}>
        {/* Section Header */}
        <div className="max-w-3xl mb-12 reveal">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[2px] bg-primary" />
            <p className="text-sm font-accent font-semibold text-primary tracking-widest uppercase">
              Case Study
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-6">
            From Days of Manual Analysis to Under One Hour
          </h2>
          <Badge variant="secondary" className="text-sm px-4 py-1.5 font-accent">
            In Production — Paid Engagement
          </Badge>
        </div>

        {/* Case Study Narrative */}
        <div className="max-w-3xl reveal">
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="p-8 md:p-10 space-y-4">
              <p className="text-lg text-foreground leading-relaxed">
                A market research firm in the Netherlands needed to transform how they processed focus group projects for an international banking client. Their workflow — transcription, translation, coding, and report writing — required several days of senior analyst time per project.
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                I designed and built a custom AI system that automates the entire pipeline. The system handles multiple language transcripts, integrates pre-session survey data with discussion responses, and produces both a detailed report and executive presentation. Every quote in the output is verified against the original recording with a timestamp. Every statistic is audited against raw data.
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                The result: projects that took days now complete in under an hour, and the system scales across the firm's entire client portfolio without reconfiguration.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed italic mt-6">
                Due to confidentiality agreements, specific client data and proprietary methodologies cannot be shared. I'm happy to discuss the architecture and approach in detail.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
