"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import MagneticButton from "./magnetic-button";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

const HEADLINE_WORDS = [
  { text: "Tu" },
  { text: "web," },
  { text: "siempre" },
  { text: "al", accent: true },
  { text: "día.", accent: true },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const headlineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const wordItem = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-80 sm:right-[-10%] sm:left-[28%]">
        <HeroScene />
      </div>

      <div className="from-background via-background/70 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-6 pt-32 pb-24 sm:px-10"
      >
        <motion.p
          variants={item}
          className="border-border-subtle bg-background-elevated text-accent mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide uppercase"
        >
          Mantenimiento web impulsado por IA
        </motion.p>

        <motion.h1
          variants={headlineContainer}
          className="font-display max-w-2xl text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-7xl"
        >
          {HEADLINE_WORDS.map((word, i) => (
            <span key={i} className="mr-3 inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                variants={wordItem}
                className={`inline-block ${word.accent ? "text-accent" : ""}`}
              >
                {word.text}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          variants={item}
          className="text-foreground-muted mt-6 max-w-md text-lg leading-relaxed"
        >
          Anclora mantiene, mejora y hace crecer sitios web con un equipo de agentes de IA
          especializados — sin sustos, sin facturas sorpresa, con reportes reales de lo que cambia
          cada mes.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton
            href="#contacto"
            className="bg-accent inline-block rounded-full px-7 py-3.5 text-sm font-semibold text-[#0a0a0f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Pide un diagnóstico gratuito
          </MagneticButton>
          <a
            href="#servicios"
            className="text-foreground-muted hover:text-foreground rounded text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Ver servicios ↓
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
