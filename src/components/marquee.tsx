const ITEMS = [
  "Mantenimiento continuo",
  "Agentes de IA",
  "Rendimiento",
  "SEO técnico",
  "Seguridad",
  "Soporte 24h",
];

function MarqueeGroup() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="font-display px-6 text-2xl font-semibold tracking-tight text-foreground-muted/40 sm:text-3xl">
            {item}
          </span>
          <span aria-hidden="true" className="text-accent/60">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-border-subtle py-6" aria-hidden="true">
      <div className="marquee-track flex w-max">
        <MarqueeGroup />
        <MarqueeGroup />
      </div>
    </div>
  );
}
