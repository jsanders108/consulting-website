/**
 * Project One-Pager Modal
 * Full-screen scrollable dialog for detailed project write-ups.
 * Uses Radix Dialog for accessibility. Content is passed as children
 * so each project can have its own unique layout while sharing the shell.
 *
 * DESIGN: The Studio — Warm White & Copper
 * Warm white background, editorial typography, copper accents
 * Smooth entrance animation, natively scrollable content area
 *
 * SCROLL FIX: Uses native overflow-y-auto on a flex child instead of
 * Radix ScrollArea, which can clip content when the dialog uses
 * CSS grid internally.
 */

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface ProjectOnePagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headline: string;
  badge: string;
  intro: string;
  children: React.ReactNode;
  ctaText: string;
}

export default function ProjectOnePager({
  open,
  onOpenChange,
  headline,
  badge,
  intro,
  children,
  ctaText,
}: ProjectOnePagerProps) {
  const scrollToContact = () => {
    onOpenChange(false);
    setTimeout(() => {
      const el = document.querySelector("#contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="!max-w-4xl !w-[95vw] !h-[90vh] !max-h-[90vh] !p-0 !gap-0 !flex !flex-col !translate-x-[-50%] !translate-y-[-50%] rounded-xl border border-border/60 shadow-2xl"
      >
        {/* Accessible title for screen readers */}
        <DialogTitle className="sr-only">{headline}</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed project overview
        </DialogDescription>

        {/* Custom close button */}
        <DialogPrimitive.Close className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity shadow-sm">
          <X className="w-5 h-5 text-foreground" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>

        {/* Scrollable content — native overflow instead of Radix ScrollArea */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
          <div className="px-6 sm:px-10 md:px-16 py-10 md:py-14">
            {/* Header */}
            <header className="mb-10 md:mb-14">
              <Badge
                variant="secondary"
                className="text-sm px-4 py-1.5 font-accent mb-6"
              >
                {badge}
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-foreground leading-tight mb-6">
                {headline}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                {intro}
              </p>
            </header>

            {/* Divider */}
            <div className="w-12 h-[2px] bg-primary mb-10 md:mb-14" />

            {/* Body content — unique per project */}
            <div className="space-y-10 md:space-y-14">{children}</div>

            {/* CTA */}
            <div className="mt-14 md:mt-20 pt-10 border-t border-border">
              <p className="text-lg text-foreground leading-relaxed mb-6 max-w-2xl">
                {ctaText}
              </p>
              <Button
                size="lg"
                className="rounded-full text-base"
                onClick={scrollToContact}
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Shared sub-components for consistent section styling ─── */

export function OnePagerSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-5">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function OnePagerStage({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pl-5 border-l-2 border-primary/30 mb-5 last:mb-0">
      <p className="text-sm font-accent font-semibold text-primary tracking-wider uppercase mb-2">
        {label}
      </p>
      <p className="text-foreground leading-relaxed">{children}</p>
    </div>
  );
}

export function OnePagerCapability({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
      <div>
        <p className="font-accent font-semibold text-foreground mb-1">
          {title}
        </p>
        <p className="text-muted-foreground leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

export function OnePagerNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-accent/30 border border-primary/10 rounded-lg px-6 py-5">
      <p className="text-sm text-muted-foreground leading-relaxed italic">
        {children}
      </p>
    </div>
  );
}

export function OnePagerResults({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/50 rounded-lg px-6 py-5 border border-border/60">
      <p className="text-foreground leading-relaxed">{children}</p>
    </div>
  );
}
