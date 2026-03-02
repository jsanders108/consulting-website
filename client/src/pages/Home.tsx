/**
 * Home Page
 * Assembles all sections in order:
 * Navigation → Hero → Solutions (3 sections) → Case Study → About → Contact → Footer
 *
 * DESIGN: The Studio — Warm White & Copper
 */

import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Solutions from "@/components/Solutions";
import CaseStudy from "@/components/CaseStudy";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main>
        <Hero />
        <Solutions />
        <CaseStudy />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
