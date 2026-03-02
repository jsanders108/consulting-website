/**
 * Footer Component
 * - Clean, minimal footer
 * - Broadened positioning tagline
 *
 * DESIGN: The Studio — Warm White & Copper
 * Minimal footer with warm styling, copper hover accents
 */

import { Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-muted/30 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left - Branding */}
          <div className="text-center md:text-left">
            <p className="text-lg font-display font-semibold text-foreground mb-1">
              Jason Sanders
            </p>
            <p className="text-sm text-muted-foreground font-accent">
              AI systems for market research and marketing analytics
            </p>
          </div>

          {/* Right - Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="mailto:jason.sanders.ai@gmail.com"
              className="w-10 h-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
              aria-label="Email"
            >
              <Mail className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://www.linkedin.com/in/jason-sanders-9723ba13/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground font-accent">
            © {currentYear} Jason Sanders. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
