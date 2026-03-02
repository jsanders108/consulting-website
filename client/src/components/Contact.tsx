/**
 * Contact Section
 * Simple CTA with Calendly placeholder and email fallback
 *
 * DESIGN: The Studio — Warm White & Copper
 * Centered layout, prominent copper CTA button
 * Card with warm border styling
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Linkedin } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Contact() {
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
    <section id="contact" className="py-24 md:py-32 bg-muted/30">
      <div className="container" ref={sectionRef}>
        <div className="max-w-3xl mx-auto text-center reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 h-[2px] bg-primary" />
            <p className="text-sm font-accent font-semibold text-primary tracking-widest uppercase">
              Get Started
            </p>
            <div className="w-6 h-[2px] bg-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-6">
            Let's Talk About Your Workflow
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">
            Whether you run a research firm looking to automate reporting, or a marketing team that needs better insight-to-action infrastructure — I'd like to hear what you're working on and see if there's a fit.
          </p>

          {/* CTA Card */}
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="p-8 md:p-12">
              <p className="text-muted-foreground mb-6 font-accent">Reach out directly:</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href="mailto:jason.sanders.ai@gmail.com"
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-sm font-accent">jason.sanders.ai@gmail.com</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/jason-sanders-9723ba13/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="text-sm font-accent">LinkedIn</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
