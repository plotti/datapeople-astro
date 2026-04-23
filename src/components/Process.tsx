import type { ProcessStep } from "../data/site";

interface Props {
  kicker: string;
  title: string;
  steps: ProcessStep[];
}

// Per-step styling — backgrounds alternate ink / cream / ink, with text
// colors flipped for contrast. Giant decorative numeral picks a brand
// tone that reads subtly against its own background.
type StepStyle = {
  bg: string;
  kicker: string;
  title: string;
  desc: string;
  num: string;
};

const darkBgMutedCream = "oklch(0.975 0.010 70 / 0.62)"; // cream @ 62% for body copy on ink

const stepStyles: StepStyle[] = [
  {
    bg: "var(--color-ink)",
    kicker: "var(--color-accent)",
    title: "var(--color-background)",
    desc: darkBgMutedCream,
    num: "oklch(0.30 0.015 55)", // warm dark grey — barely-there watermark on ink
  },
  {
    bg: "var(--color-background)",
    kicker: "var(--color-accent)",
    title: "var(--color-ink)",
    desc: "var(--color-ink-muted)",
    num: "var(--color-surface)",
  },
  {
    bg: "var(--color-ink)",
    kicker: "var(--color-accent)",
    title: "var(--color-background)",
    desc: darkBgMutedCream,
    num: "var(--color-accent)", // terracotta climax on the hand-off step
  },
];

export default function Process({ kicker, title, steps }: Props) {
  return (
    <section
      id="how-it-works"
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
      {steps.map((step, i) => {
        const s = stepStyles[i % stepStyles.length];
        return (
          <div
            key={step.num}
            data-fade={i === 0 ? "" : undefined}
            className="process-card sticky top-0 flex min-h-[100dvh] items-center"
            style={{ zIndex: i + 1, background: s.bg }}
          >
            <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:grid-cols-2 md:gap-20">
              <div>
                <p
                  className="mb-6 font-sans text-sm tracking-[0.18em]"
                  style={{ color: s.kicker }}
                >
                  {step.num} // Schritt
                </p>
                <h3
                  className="mb-6 font-serif leading-[1.05]"
                  style={{ fontSize: "var(--text-display-md)", color: s.title }}
                >
                  {step.title}
                </h3>
                <p
                  className="font-sans text-lg leading-relaxed"
                  style={{ color: s.desc }}
                >
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
                    className="font-serif leading-[0.75] select-none"
                    style={{
                      fontSize: "clamp(12rem, 22vw, 22rem)",
                      color: s.num,
                    }}
                  >
                    {step.num}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
