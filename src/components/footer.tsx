"use client";

import Link from "next/link";

const FOUNDING_YEAR = 2026;

function CopyrightYear() {
  // This page is statically prerendered, so `new Date().getFullYear()` read
  // at module/render time on the server would freeze at build time and go
  // stale. Recomputing it here still runs once on the server (producing the
  // build-time year in the prerendered HTML), but this is a Client
  // Component, so the same expression also reruns in the browser during
  // hydration — using the visitor's real current date. suppressHydrationWarning
  // scopes the (rare, boundary-crossing) text mismatch to just this node
  // instead of a mounted-flag + effect, which the React Compiler lint flags
  // as an unnecessary cascading render for what is really just reading an
  // external value (the clock).
  const year = new Date().getFullYear();
  return (
    <span suppressHydrationWarning>{year > FOUNDING_YEAR ? `${FOUNDING_YEAR}–${year}` : year}</span>
  );
}

export default function Footer() {
  return (
    <footer className="border-border-subtle border-t">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-display text-foreground text-2xl font-semibold tracking-tight">
              Anclora
            </span>
            <p className="text-foreground-muted mt-2 max-w-xs text-sm leading-relaxed">
              Mantenimiento y mejora web con IA: siempre al día, siempre rindiendo.
            </p>
          </div>
          <nav
            className="text-foreground-muted flex flex-wrap gap-x-6 gap-y-2 text-sm"
            aria-label="Enlaces del pie de página"
          >
            <Link
              href="#servicios"
              className="hover:text-accent focus-visible:text-accent focus-visible:outline-accent rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Servicios
            </Link>
            <Link
              href="#proceso"
              className="hover:text-accent focus-visible:text-accent focus-visible:outline-accent rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Cómo trabajamos
            </Link>
            <Link
              href="#contacto"
              className="hover:text-accent focus-visible:text-accent focus-visible:outline-accent rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Contacto
            </Link>
          </nav>
        </div>
        <div className="border-border-subtle text-foreground-muted mt-10 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> Anclora. Todos los derechos reservados.
          </p>
          <p className="font-display text-foreground-muted tracking-[0.2em] uppercase">
            Hecho con IA, revisado por personas
          </p>
        </div>
      </div>
    </footer>
  );
}
