import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <span className="font-display text-base font-semibold tracking-tight text-foreground">
            Anclora
          </span>
          <p className="mt-1 text-xs text-foreground-muted">
            Mantenimiento y mejora web con IA.
          </p>
        </div>
        <nav className="flex gap-6 text-sm text-foreground-muted" aria-label="Enlaces del pie de página">
          <Link href="#servicios" className="transition-colors hover:text-foreground">
            Servicios
          </Link>
          <Link href="#proceso" className="transition-colors hover:text-foreground">
            Cómo trabajamos
          </Link>
          <Link href="#contacto" className="transition-colors hover:text-foreground">
            Contacto
          </Link>
        </nav>
        <p className="text-xs text-foreground-muted">
          © {new Date().getFullYear()} Anclora. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
