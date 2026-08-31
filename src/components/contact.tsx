"use client";

import { useId, useState } from "react";

const CONTACT_EMAIL = "hola@anclora.dev";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldName = "nombre" | "email" | "mensaje";
type FieldErrors = Partial<Record<FieldName, string>>;

function validate(form: FormData): FieldErrors {
  const nombre = String(form.get("nombre") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const mensaje = String(form.get("mensaje") ?? "").trim();

  const errors: FieldErrors = {};
  if (!nombre) errors.nombre = "Introduce tu nombre.";
  if (!email) errors.email = "Introduce tu email.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Introduce un email válido.";
  if (!mensaje) errors.mensaje = "Cuéntanos brevemente qué necesitas.";
  return errors;
}

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const formId = useId();

  function clearError(field: FieldName) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const nextErrors = validate(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("idle");
      const firstInvalid = formElement.elements.namedItem(
        (Object.keys(nextErrors) as FieldName[])[0],
      ) as HTMLElement | null;
      firstInvalid?.focus();
      return;
    }

    setErrors({});
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

  const nombreErrorId = `${formId}-nombre-error`;
  const emailErrorId = `${formId}-email-error`;
  const mensajeErrorId = `${formId}-mensaje-error`;

  return (
    <section id="contacto" className="border-border-subtle relative border-t py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-24">
        <div>
          <p className="text-accent mb-4 text-xs font-medium tracking-[0.2em] uppercase">
            Contacto
          </p>
          <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            Cuéntanos en qué estado está tu web.
          </h2>
          <p className="text-foreground-muted mt-6 max-w-sm text-sm leading-relaxed">
            Respondemos en menos de 24h laborables con un primer diagnóstico, sin compromiso.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="border-border-subtle bg-background-elevated text-foreground hover:border-accent hover:text-accent focus-visible:outline-accent mt-8 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor={`${formId}-nombre`} className="text-foreground text-sm font-medium">
                Nombre
              </label>
              <input
                id={`${formId}-nombre`}
                name="nombre"
                type="text"
                required
                autoComplete="name"
                aria-invalid={errors.nombre ? "true" : undefined}
                aria-describedby={errors.nombre ? nombreErrorId : undefined}
                onChange={() => clearError("nombre")}
                className="border-border-subtle bg-background-elevated text-foreground placeholder:text-foreground-muted/50 focus-visible:border-accent focus-visible:ring-accent/40 rounded-lg border px-4 py-2.5 text-sm outline-none focus-visible:ring-2 aria-[invalid=true]:border-red-400"
              />
              {errors.nombre ? (
                <p id={nombreErrorId} className="text-xs text-red-400">
                  {errors.nombre}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor={`${formId}-email`} className="text-foreground text-sm font-medium">
                Email
              </label>
              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                required
                autoComplete="email"
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={errors.email ? emailErrorId : undefined}
                onChange={() => clearError("email")}
                className="border-border-subtle bg-background-elevated text-foreground placeholder:text-foreground-muted/50 focus-visible:border-accent focus-visible:ring-accent/40 rounded-lg border px-4 py-2.5 text-sm outline-none focus-visible:ring-2 aria-[invalid=true]:border-red-400"
              />
              {errors.email ? (
                <p id={emailErrorId} className="text-xs text-red-400">
                  {errors.email}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-web`} className="text-foreground text-sm font-medium">
              Web actual <span className="text-foreground-muted font-normal">(opcional)</span>
            </label>
            <input
              id={`${formId}-web`}
              name="web"
              type="text"
              placeholder="tuweb.com"
              autoComplete="url"
              className="border-border-subtle bg-background-elevated text-foreground placeholder:text-foreground-muted/50 focus-visible:border-accent focus-visible:ring-accent/40 rounded-lg border px-4 py-2.5 text-sm outline-none focus-visible:ring-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-mensaje`} className="text-foreground text-sm font-medium">
              Mensaje
            </label>
            <textarea
              id={`${formId}-mensaje`}
              name="mensaje"
              required
              rows={4}
              aria-invalid={errors.mensaje ? "true" : undefined}
              aria-describedby={errors.mensaje ? mensajeErrorId : undefined}
              onChange={() => clearError("mensaje")}
              className="border-border-subtle bg-background-elevated text-foreground placeholder:text-foreground-muted/50 focus-visible:border-accent focus-visible:ring-accent/40 resize-none rounded-lg border px-4 py-2.5 text-sm outline-none focus-visible:ring-2 aria-[invalid=true]:border-red-400"
            />
            {errors.mensaje ? (
              <p id={mensajeErrorId} className="text-xs text-red-400">
                {errors.mensaje}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="bg-accent focus-visible:outline-accent mt-2 self-start rounded-full px-7 py-3.5 text-sm font-semibold text-[#0a0a0f] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Enviar mensaje
          </button>
          <p className="text-foreground-muted text-xs">
            Se abrirá tu gestor de correo con el mensaje ya redactado.
          </p>
          <p role="status" aria-live="polite" className="sr-only">
            {status === "sent"
              ? "Abriendo tu gestor de correo con el mensaje ya redactado…"
              : Object.keys(errors).length > 0
                ? "Revisa los campos marcados en rojo antes de enviar."
                : ""}
          </p>
        </form>
      </div>
    </section>
  );
}
