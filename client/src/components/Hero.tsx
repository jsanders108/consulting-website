/**
 * Hero Section
 * Prospect-focused messaging for market research firms and marketing teams
 * - Pain point → value proposition → CTAs
 *
 * DESIGN: The Studio — Warm White & Copper
 * Hero uses generated abstract warm background, dark text on light image
 * Left-aligned editorial layout with generous whitespace
 */

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663291798489/DAEwzpX5KtJjLtj2F8MqRo/hero-bg-e4uQ2LrGfEsgXtSyKj6b9Z.webp";

export default function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/92 via-background/75 to-background/35" />
      </div>

      {/* Content */}
      <div className="container pt-32 pb-24 relative z-10">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
            <div className="w-8 h-[2px] bg-primary" />
            <p className="text-sm font-accent font-semibold text-primary tracking-widest uppercase">
              AI-Powered Research & Analytics
            </p>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-8 leading-tight animate-fade-in-up animation-delay-100">
            Your team spends days turning research into reports. My AI systems do it in under an hour.
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed animate-fade-in-up animation-delay-200">
            I help companies use AI to transform how they generate consumer insights and activate them in marketing — from research design through brand strategy and marketing effectiveness. Built by someone who's spent 20 years doing this work firsthand.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
            <Button
              size="lg"
              onClick={() => scrollToSection("#solutions")}
              className="rounded-full text-base group"
            >
              See How It Works
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("#contact")}
              className="rounded-full text-base bg-background/50 backdrop-blur-sm"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-muted-foreground/30 rounded-full" />
        </div>
      </div>
    </section>
  );
}
