"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Cómo trabajamos" },
  { href: "#contacto", label: "Contacto" },
];

const LINK_CLASS =
  "hover:text-foreground focus-visible:text-foreground rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    firstLinkRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <header className="border-border-subtle bg-background/70 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <span className="font-display text-foreground text-lg font-semibold tracking-tight">
          Anclora
        </span>
        <nav
          aria-label="Navegación principal"
          className="text-foreground-muted hidden items-center gap-8 text-sm sm:flex"
        >
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={LINK_CLASS}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="#contacto"
            className="border-border-subtle bg-background-elevated text-foreground hover:border-accent hover:text-accent focus-visible:outline-accent rounded-full border px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Hablemos
          </Link>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            onClick={() => setOpen((value) => !value)}
            className="border-border-subtle bg-background-elevated text-foreground hover:border-accent hover:text-accent focus-visible:outline-accent flex size-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:hidden"
          >
            <span className="sr-only">Menú</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="size-5"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      <nav
        id={panelId}
        aria-label="Navegación móvil"
        hidden={!open}
        className="border-border-subtle bg-background/95 border-t backdrop-blur-md sm:hidden"
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
          {LINKS.map((link, index) => (
            <li key={link.href}>
              <Link
                ref={index === 0 ? firstLinkRef : undefined}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`${LINK_CLASS} text-foreground block rounded-md px-2 py-3 text-base`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
