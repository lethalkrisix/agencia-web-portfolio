"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

const STATS = [
  { value: 24, suffix: "h", label: "Tiempo máximo de primera respuesta" },
  { value: 100, suffix: "%", label: "Cambios supervisados por personas" },
  { value: 7, suffix: "/7", label: "Vigilancia de la web, todos los días" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
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
    <span
      ref={ref}
      className="font-display text-5xl font-semibold tracking-tight text-accent sm:text-6xl"
    >
      0{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="border-b border-border-subtle">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-3 sm:px-10">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <Counter value={stat.value} suffix={stat.suffix} />
            <p className="mt-2 max-w-[22ch] text-sm leading-relaxed text-foreground-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
