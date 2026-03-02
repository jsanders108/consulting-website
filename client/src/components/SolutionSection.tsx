/**
 * Solution Section
 * Reusable component for showcasing AI solutions
 * Layout: Section header → One-pager card (top) → Video placeholder (bottom) → Capabilities grid
 *
 * DESIGN: The Studio — Warm White & Copper
 * The one-pager card and video placeholder form a unified pair
 * but are clearly distinct — one is a written overview, the other a video demo.
 */

import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";

interface SolutionSectionProps {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  videoPlaceholderText: string;
  capabilities: { icon: LucideIcon; title: string; text: string }[];
  className?: string;
  sectionImage?: string;
  /** Thumbnail image for the one-pager card */
  onePagerThumbnail?: string;
  /** Label for the one-pager card */
  onePagerLabel?: string;
  /** Callback when one-pager card is clicked */
  onOnePagerClick?: () => void;
}

export default function SolutionSection({
  id,
  eyebrow,
  title,
  description,
  videoPlaceholderText,
  capabilities,
  className = "",
  onePagerThumbnail,
  onePagerLabel,
  onOnePagerClick,
}: SolutionSectionProps) {
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
      { threshold: 0.08 }
    );

    const el = sectionRef.current;
    if (el) {
      const revealElements = el.querySelectorAll(".reveal");
      revealElements.forEach((child) => observer.observe(child));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} className={`py-24 md:py-32 ${className}`}>
      <div className="container" ref={sectionRef}>
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-12 reveal">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[2px] bg-primary" />
            <p className="text-sm font-accent font-semibold text-primary tracking-widest uppercase">
              {eyebrow}
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-6">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* One-Pager Card + Video Placeholder — unified pair */}
        {(onePagerThumbnail || onOnePagerClick) && (
          <div className="max-w-4xl mx-auto mb-16 reveal">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Top/Left: One-Pager Card */}
              <button
                onClick={onOnePagerClick}
                className="group text-left w-full"
                aria-label={`Read ${onePagerLabel || title} project overview`}
              >
                <Card className="overflow-hidden border border-border/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/30 h-full">
                  {onePagerThumbnail && (
                    <div className="overflow-hidden">
                      <img
                        src={onePagerThumbnail}
                        alt=""
                        className="w-full h-40 md:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <CardContent className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <p className="text-xs font-accent font-semibold text-primary tracking-wider uppercase">
                            Project Overview
                          </p>
                        </div>
                        <p className="text-lg font-display font-semibold text-foreground leading-snug">
                          {onePagerLabel || title}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 mt-1 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </button>

              {/* Bottom/Right: Video Placeholder */}
              <Card className="overflow-hidden border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                <div className="w-full h-full min-h-[200px] md:min-h-0 bg-muted/40 flex flex-col items-center justify-center gap-4 p-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <Play className="w-7 h-7 text-primary ml-0.5" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-accent font-semibold text-muted-foreground/70 tracking-wider uppercase mb-1">
                      Video Walkthrough
                    </p>
                    <p className="text-sm font-accent text-muted-foreground px-2">
                      {videoPlaceholderText}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Fallback: Original video-only placeholder for sections without one-pagers */}
        {!onePagerThumbnail && !onOnePagerClick && (
          <div className="max-w-4xl mx-auto mb-16 reveal">
            <Card className="overflow-hidden border-2 border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
              <AspectRatio ratio={16 / 9}>
                <div className="w-full h-full bg-muted/40 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                  <p className="text-sm font-accent text-muted-foreground px-4 text-center">
                    {videoPlaceholderText}
                  </p>
                </div>
              </AspectRatio>
            </Card>
          </div>
        )}

        {/* Capabilities Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {capabilities.map((cap, index) => (
            <div
              key={index}
              className="flex gap-4 reveal"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {cap.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {cap.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
