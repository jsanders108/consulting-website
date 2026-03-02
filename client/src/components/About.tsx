/**
 * About Section
 * Shortened, prospect-focused with pull quote
 * Positions expertise across research, brand strategy, and marketing effectiveness
 *
 * DESIGN: The Studio — Warm White & Copper
 * Pull quote uses copper-tinted accent background
 * Editorial typography with generous line height
 */

import { useEffect, useRef } from "react";

export default function About() {
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
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container" ref={sectionRef}>
        {/* Section Header */}
        <div className="max-w-3xl mb-16 reveal">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[2px] bg-primary" />
            <p className="text-sm font-accent font-semibold text-primary tracking-widest uppercase">
              About
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-6">
            Built on 20 Years Inside the Industry
          </h2>
        </div>

        {/* Content */}
        <div className="max-w-3xl space-y-6 mb-20 reveal">
          <p className="text-lg text-foreground leading-relaxed">
            I've spent two decades at the intersection of market research and marketing strategy. For eight years at Driscoll's, I led research and analytics within the marketing organization — building global brand health tracking systems across five continents, running creative optimization studies, validating new product launches with mixed-method research, and translating consumer sentiment into marketing narratives that drove brand growth.
          </p>
          <p className="text-lg text-foreground leading-relaxed">
            I know what good research output looks like because I've been the one delivering it — and I know what marketing teams actually need from that research because I sat inside the department.
          </p>
          <p className="text-lg text-foreground leading-relaxed">
            Four years ago, I started building AI systems specifically for this space. Not general-purpose chatbots — purpose-built tools that encode real research methodology and include the verification layers that high-stakes client work demands. The same rigor I applied to research design, I now apply to AI architecture.
          </p>
        </div>

        {/* Pull Quote */}
        <div className="max-w-4xl mx-auto py-16 px-8 md:px-16 bg-accent/40 rounded-2xl border border-primary/15 reveal">
          <blockquote className="text-2xl md:text-3xl font-display font-semibold text-foreground text-center leading-relaxed">
            "AI is powerful, but it doesn't know what it doesn't know. My role is to architect the systems, encode the domain expertise, and design the validation layers that turn raw AI capability into reliable, production-grade output."
          </blockquote>
        </div>
      </div>
    </section>
  );
}
