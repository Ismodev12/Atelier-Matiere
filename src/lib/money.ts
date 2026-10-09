export function formatPrice(cents: number, currency = process.env.NEXT_PUBLIC_SHOP_CURRENCY ?? "eur") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

/** "12,50" → 1250 ; renvoie NaN si invalide. */
export function parsePriceToCents(input: string): number {
  const n = Number(String(input).replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return NaN;
  return Math.round(n * 100);
}
