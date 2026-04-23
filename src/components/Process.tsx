import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProcessStep } from "../data/site";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  kicker: string;
  title: string;
  steps: ProcessStep[];
}

export default function Process({ kicker, title, steps }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".process-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card, {
          scale: 0.95,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={rootRef}
      className="relative bg-[var(--color-background)]"
    >
      {/* Section heading */}
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-4">
        <p className="mb-4 font-sans text-sm uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
          {kicker}
        </p>
        <h2
          className="max-w-[18ch] font-serif leading-[1.05]"
          style={{ fontSize: "var(--text-display-lg)" }}
        >
          {title}
        </h2>
      </div>

      {/* Sticky stack */}
      {steps.map((step, i) => (
        <div
          key={step.num}
          className="process-card sticky top-0 flex min-h-[100dvh] items-center bg-[var(--color-background)]"
          style={{ zIndex: i + 1 }}
        >
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:grid-cols-2 md:gap-20">
            <div>
              <p className="mb-6 font-sans text-sm tracking-[0.18em] text-[var(--color-accent)]">
                {step.num} // Schritt
              </p>
              <h3
                className="mb-6 font-serif leading-[1.05]"
                style={{ fontSize: "var(--text-display-md)" }}
              >
                {step.title}
              </h3>
              <p className="font-sans text-lg leading-relaxed text-[var(--color-ink-muted)]">
                {step.desc}
              </p>
            </div>

            <div className="relative hidden md:block">
              {/* Minimal numeric glyph instead of widget illustration.
                  Decorative only — both wrapper and span carry aria-hidden
                  so color-contrast checkers and screen readers skip it. */}
              <div
                aria-hidden="true"
                role="presentation"
                className="absolute inset-0 flex items-center justify-end"
              >
                <span
                  aria-hidden="true"
                  role="presentation"
                  className="font-serif leading-[0.75] text-[var(--color-surface)] select-none"
                  style={{
                    fontSize: "clamp(12rem, 22vw, 22rem)",
                  }}
                >
                  {step.num}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
