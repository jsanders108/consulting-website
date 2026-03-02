import { useEffect, useRef } from "react";

/**
 * Hook that adds the 'visible' class to elements when they enter the viewport.
 * Works with the .reveal CSS class for scroll-triggered animations.
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold }
    );

    const el = ref.current;
    if (el) {
      // Observe the element itself and all .reveal children
      const revealElements = el.querySelectorAll(".reveal");
      revealElements.forEach((child) => observer.observe(child));
      if (el.classList.contains("reveal")) {
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
