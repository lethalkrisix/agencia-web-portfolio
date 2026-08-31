"use client";

import { useId, useState } from "react";

const CONTACT_EMAIL = "hola@anclora.dev";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const formId = useId();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nombre = String(form.get("nombre") ?? "");
    const email = String(form.get("email") ?? "");
    const web = String(form.get("web") ?? "");
    const mensaje = String(form.get("mensaje") ?? "");

    const subject = `Diagnóstico gratuito — ${nombre || "nueva consulta"}`;
    const body = [
      `Nombre: ${nombre}`,
      `Email: ${email}`,
      web ? `Web actual: ${web}` : null,
      "",
      mensaje,
    ]
      .filter((line) => line !== null)
      .join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  }

  return (
    <section id="contacto" className="relative border-t border-border-subtle py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-24">
        <div>
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-accent uppercase">
            Contacto
          </p>
          <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            Cuéntanos en qué estado está tu web.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-foreground-muted">
            Respondemos en menos de 24h laborables con un primer diagnóstico, sin compromiso.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background-elevated px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor={`${formId}-nombre`} className="text-sm font-medium text-foreground">
                Nombre
              </label>
              <input
                id={`${formId}-nombre`}
                name="nombre"
                type="text"
                required
                autoComplete="name"
                className="rounded-lg border border-border-subtle bg-background-elevated px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/50 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor={`${formId}-email`} className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                required
                autoComplete="email"
                className="rounded-lg border border-border-subtle bg-background-elevated px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/50 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-web`} className="text-sm font-medium text-foreground">
              Web actual <span className="font-normal text-foreground-muted">(opcional)</span>
            </label>
            <input
              id={`${formId}-web`}
              name="web"
              type="text"
              placeholder="tuweb.com"
              autoComplete="url"
              className="rounded-lg border border-border-subtle bg-background-elevated px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/50 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-mensaje`} className="text-sm font-medium text-foreground">
              Mensaje
            </label>
            <textarea
              id={`${formId}-mensaje`}
              name="mensaje"
              required
              rows={4}
              className="resize-none rounded-lg border border-border-subtle bg-background-elevated px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/50 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
            />
          </div>

          <button
            type="submit"
            className="mt-2 self-start rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-[#0a0a0f] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Enviar mensaje
          </button>
          <p className="text-xs text-foreground-muted" role="status" aria-live="polite">
            {status === "sent"
              ? "Abriendo tu gestor de correo con el mensaje ya redactado…"
              : "Se abrirá tu gestor de correo con el mensaje ya redactado."}
          </p>
        </form>
      </div>
    </section>
  );
}
