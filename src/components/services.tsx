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

  function handleMouseLeave() {
    // Without this the gradient's last position sticks around: opacity
    // fades to 0 on leave, but --mx/--my keep their last value, so the next
    // hover-in starts from wherever the pointer happened to leave instead
    // of fading in from the fresh entry point.
    cardRef.current?.style.removeProperty("--mx");
    cardRef.current?.style.removeProperty("--my");
  }

  return (
    <motion.div
      ref={cardRef}
      variants={item}
      tabIndex={0}
      role="group"
      aria-label={service.title}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group bg-background hover:bg-background-elevated focus-visible:bg-background-elevated focus-visible:outline-accent relative overflow-hidden p-8 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 sm:p-10 ${service.span}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 70%)",
        }}
      />
      <span className="font-display text-foreground-muted text-sm tabular-nums">
        {service.index}
      </span>
      <h3 className="font-display text-foreground mt-4 text-xl font-semibold tracking-tight">
        {service.title}
      </h3>
      <p className="text-foreground-muted mt-3 max-w-sm text-sm leading-relaxed">
        {service.description}
      </p>
      <div className="bg-accent pointer-events-none absolute inset-x-8 bottom-0 h-px scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100 sm:inset-x-10" />
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="servicios" className="border-border-subtle relative border-t py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={item}
          className="max-w-xl"
        >
          <p className="text-accent mb-4 text-xs font-medium tracking-[0.2em] uppercase">
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
          className="border-border-subtle bg-border-subtle mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.index} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
