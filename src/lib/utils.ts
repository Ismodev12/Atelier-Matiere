export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function formatDate(d: Date | string, withTime = false) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

export function formatDateShort(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

/** N'accepte que des liens internes ("/…") ou http(s) — bloque javascript:, data:, etc. */
export function safeHref(href: string, fallback = "/") {
  const h = (href ?? "").trim();
  if (h.startsWith("/") && !h.startsWith("//")) return h;
  if (/^https?:\/\//i.test(h)) return h;
  if (/^mailto:/i.test(h) || /^tel:/i.test(h)) return h;
  if (h.startsWith("#")) return h;
  return fallback;
}
