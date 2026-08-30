import Link from "next/link";

export default function Nav() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <span className="font-display text-foreground text-lg font-semibold tracking-tight">
          Anclora
        </span>
        <nav className="text-foreground-muted hidden items-center gap-8 text-sm sm:flex">
          <Link href="#servicios" className="hover:text-foreground transition-colors">
            Servicios
          </Link>
          <Link href="#proceso" className="hover:text-foreground transition-colors">
            Cómo trabajamos
          </Link>
          <Link href="#contacto" className="hover:text-foreground transition-colors">
            Contacto
          </Link>
        </nav>
        <Link
          href="#contacto"
          className="border-border-subtle bg-background-elevated text-foreground hover:border-accent hover:text-accent rounded-full border px-5 py-2 text-sm font-medium transition-colors"
        >
          Hablemos
        </Link>
      </div>
    </header>
  );
}
