import Link from "next/link";

export default function Nav() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border-subtle bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <span className="font-display text-foreground text-lg font-semibold tracking-tight">
          Anclora
        </span>
        <nav className="text-foreground-muted hidden items-center gap-8 text-sm sm:flex">
          <Link
            href="#servicios"
            className="hover:text-foreground focus-visible:text-foreground rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Servicios
          </Link>
          <Link
            href="#proceso"
            className="hover:text-foreground focus-visible:text-foreground rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Cómo trabajamos
          </Link>
          <Link
            href="#contacto"
            className="hover:text-foreground focus-visible:text-foreground rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Contacto
          </Link>
        </nav>
        <Link
          href="#contacto"
          className="border-border-subtle bg-background-elevated text-foreground hover:border-accent hover:text-accent focus-visible:outline-accent rounded-full border px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Hablemos
        </Link>
      </div>
    </header>
  );
}
