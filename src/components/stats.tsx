"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

const STATS = [
  {
    value: 24,
    suffix: "h",
    accessibleValue: "24h",
    eyebrow: "01",
    label: "Tiempo máximo de primera respuesta",
  },
  {
    value: 100,
    suffix: "%",
    accessibleValue: "100%",
    eyebrow: "02",
    label: "Cambios supervisados por personas",
  },
  {
    value: 7,
    suffix: "/7",
    accessibleValue: "7/7",
    eyebrow: "03",
    label: "Vigilancia de la web, todos los días",
  },
];

function Counter({
  value,
  suffix,
  accessibleValue,
}: {
  value: number;
  suffix: string;
  accessibleValue: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (!inView) return;
    motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(
    () =>
      spring.on("change", (latest) => {
        if (ref.current) ref.current.textContent = `${Math.round(latest)}${suffix}`;
      }),
    [spring, suffix],
  );

  return (
    <span className="relative inline-flex items-baseline">
      {/* Animated for sighted users; the number sweeps up on scroll-into-view. */}
      <span
        ref={ref}
        aria-hidden="true"
        className="font-display text-accent text-5xl font-semibold tracking-tight sm:text-6xl"
      >
        0{suffix}
      </span>
      {/* Static final value for screen readers and no-JS: the animated span
          above is only ever correct once the spring settles, and its text
          is written imperatively so React never gets a chance to update it
          for assistive tech. */}
      <span className="sr-only">{accessibleValue}</span>
    </span>
  );
}

// Staircase offset per column so the row reads as one deliberate composition
// instead of three identical cards repeated sideways — index 0 stays flush
// with the eyebrow, then each column steps down.
const OFFSET_CLASS = ["sm:pt-0", "sm:pt-10", "sm:pt-20"];

export default function Stats() {
  return (
    <section className="border-border-subtle bg-background-elevated/30 border-b">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
        <p className="text-accent mb-10 text-xs font-medium tracking-[0.2em] uppercase sm:mb-16">
          Por qué confiar en Anclora
        </p>
        <div className="divide-border-subtle grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-5 py-8 first:pt-0 sm:px-8 sm:pb-0 sm:first:pl-0 sm:last:pr-0 ${OFFSET_CLASS[index]}`}
            >
              <span className="relative inline-flex w-fit px-1.5 py-1">
                <span
                  aria-hidden="true"
                  className="border-accent/40 absolute top-0 left-0 h-2.5 w-2.5 border-t border-l"
                />
                <span className="font-display text-foreground-muted text-xs font-medium tracking-[0.3em] tabular-nums">
                  {stat.eyebrow}
                </span>
                <span
                  aria-hidden="true"
                  className="border-accent/40 absolute right-0 bottom-0 h-2.5 w-2.5 border-r border-b"
                />
              </span>
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                accessibleValue={stat.accessibleValue}
              />
              <p className="text-foreground-muted max-w-[22ch] text-sm leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
