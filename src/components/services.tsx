"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";

const SERVICES = [
  {
    index: "01",
    title: "Mantenimiento continuo",
    description:
      "Actualizaciones, backups y parches de seguridad gestionados cada semana, no cuando ya es tarde.",
    span: "lg:col-span-2",
  },
  {
    index: "02",
    title: "Mejoras con IA",
    description:
      "Un equipo de agentes detecta fricciones reales en tu web y propone mejoras de UX, copy y rendimiento cada mes.",
    span: "lg:col-span-1",
  },
  {
    index: "03",
    title: "Rendimiento y SEO técnico",
    description:
      "Vigilancia constante de Core Web Vitals, velocidad de carga y señales de posicionamiento.",
    span: "lg:col-span-1",
  },
  {
    index: "04",
    title: "Nuevas funcionalidades",
    description:
      "De formularios a integraciones a medida: ampliamos tu web sin necesidad de rehacerla desde cero.",
    span: "lg:col-span-2",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

function ServiceCard({ service }: { service: (typeof SERVICES)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    cardRef.current!.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    cardRef.current!.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <motion.div
      ref={cardRef}
      variants={item}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden bg-background p-8 transition-colors hover:bg-background-elevated sm:p-10 ${service.span}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 70%)",
        }}
      />
      <span className="font-display text-sm text-foreground-muted/60 tabular-nums">
        {service.index}
      </span>
      <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-foreground">
        {service.title}
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground-muted">
        {service.description}
      </p>
      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 sm:inset-x-10" />
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="servicios" className="relative border-t border-border-subtle py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={item}
          className="max-w-xl"
        >
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-accent uppercase">
            Servicios
          </p>
          <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            Todo lo que tu web necesita, sin que tengas que pensarlo.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border-subtle bg-border-subtle lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.index} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
