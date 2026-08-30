"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

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
          variants={item}
          className="font-display max-w-2xl text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
        >
          Tu web, siempre <span className="text-accent">al día</span>.
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
          <a
            href="#contacto"
            className="bg-accent rounded-full px-7 py-3.5 text-sm font-semibold text-[#0a0a0f] transition-transform hover:scale-[1.03]"
          >
            Pide un diagnóstico gratuito
          </a>
          <a
            href="#servicios"
            className="text-foreground-muted hover:text-foreground text-sm font-medium transition-colors"
          >
            Ver servicios ↓
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
