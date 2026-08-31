"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const STEPS = [
  {
    number: "1",
    title: "Diagnóstico gratuito",
    description:
      "Auditamos tu web actual: rendimiento, seguridad, SEO técnico y experiencia de usuario.",
  },
  {
    number: "2",
    title: "Plan a medida",
    description:
      "Te proponemos un plan de mantenimiento mensual ajustado a tu web y tus objetivos, sin letra pequeña.",
  },
  {
    number: "3",
    title: "Ejecución continua",
    description:
      "Nuestros agentes de IA trabajan cada semana en parches, mejoras y contenido, siempre supervisados por personas.",
  },
  {
    number: "4",
    title: "Reporte mensual",
    description: "Recibes un informe claro de qué cambió, qué mejoró y qué viene después.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const lineHeight = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section id="proceso" className="relative border-t border-border-subtle py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={item}
          className="max-w-xl"
        >
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-accent uppercase">
            Cómo trabajamos
          </p>
          <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            Un proceso claro, pensado para que no tengas que gestionarlo tú.
          </h2>
        </motion.div>

        <motion.ol
          ref={listRef}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="relative mt-16 flex flex-col"
        >
          <span
            aria-hidden="true"
            className="absolute top-5 bottom-5 left-[19px] w-px bg-border-subtle sm:left-[27px]"
          />
          <motion.span
            aria-hidden="true"
            className="absolute top-5 left-[19px] w-px origin-top bg-accent sm:left-[27px]"
            style={{ scaleY: lineHeight, height: "calc(100% - 2.5rem)" }}
          />

          {STEPS.map((step) => (
            <motion.li
              key={step.number}
              variants={item}
              className="relative flex gap-6 pb-12 last:pb-0 sm:gap-10"
            >
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-background-elevated font-display text-sm font-semibold text-accent sm:h-14 sm:w-14 sm:text-base">
                {step.number}
              </span>
              <div className="pt-1.5 sm:pt-3">
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground-muted">
                  {step.description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
