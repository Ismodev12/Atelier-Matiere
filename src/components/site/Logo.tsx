/* eslint-disable @next/next/no-img-element */
export function Logo({ name, logoUrl, light = false }: { name: string; logoUrl?: string; light?: boolean }) {
  if (logoUrl) return <img src={logoUrl} alt={name} className="h-9 w-auto max-w-[180px] object-contain" />;
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return (
    <span className={`inline-flex items-center gap-3 ${light ? "text-ivory" : "text-charcoal"}`}>
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-full border border-current font-display text-[0.95rem] italic tracking-wide"
      >
        {initials}
      </span>
      <span className="font-display text-[1.45rem] leading-none tracking-[0.02em]">{name}</span>
    </span>
  );
}
