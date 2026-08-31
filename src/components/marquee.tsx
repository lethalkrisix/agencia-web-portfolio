const ITEMS = [
  "Mantenimiento continuo",
  "Agentes de IA",
  "Rendimiento",
  "SEO técnico",
  "Seguridad",
  "Soporte 24h",
];

function PulseMark() {
  return (
    <span
      aria-hidden="true"
      className="relative mx-6 flex h-1.5 w-1.5 shrink-0 items-center justify-center sm:mx-8"
    >
      <span className="bg-accent/50 absolute h-full w-full animate-ping rounded-full" />
      <span className="bg-accent relative h-1.5 w-1.5 rounded-full" />
    </span>
  );
}

function MarqueeItem({ label, index }: { label: string; index: number }) {
  return (
    <span className="flex items-center">
      <span className="font-display flex items-baseline gap-2.5 px-1 text-2xl font-semibold tracking-tight sm:text-3xl">
        <span className="text-accent text-xs font-medium tabular-nums sm:text-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-foreground-muted hover:text-foreground transition-colors duration-300">
          {label}
        </span>
      </span>
      <PulseMark />
    </span>
  );
}

export default function Marquee() {
  return (
    <div className="border-border-subtle overflow-hidden border-y py-6">
      <div className="marquee-track flex w-max">
        <ul
          role="list"
          aria-label="Áreas que Anclora vigila de forma continua"
          className="flex shrink-0 items-center"
        >
          {ITEMS.map((item, i) => (
            <li key={item} role="listitem" className="flex items-center">
              <MarqueeItem label={item} index={i} />
            </li>
          ))}
        </ul>
        <div aria-hidden="true" className="flex shrink-0 items-center">
          {ITEMS.map((item, i) => (
            <MarqueeItem key={item} label={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
