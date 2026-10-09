import { z } from "zod";
import { getProductsByIds } from "@/lib/repo/catalog";
import { getSettings } from "@/lib/repo/settings";
import { cartInputSchema } from "@/lib/validation";
import { validatePersonalization } from "./personalization";
import type { PersonalizationChoice, Product, SiteSettings } from "@/lib/types";

export type PricedLine = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  personalization: PersonalizationChoice | null;
  error?: string;
  maxQuantity: number;
};

export type PricedCart = {
  lines: PricedLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  errors: string[];
  canCheckout: boolean;
};

export function shippingFor(subtotal: number, settings: SiteSettings) {
  if (subtotal === 0) return 0;
  const { flatFeeCents, freeThresholdCents } = settings.shipping;
  return freeThresholdCents > 0 && subtotal >= freeThresholdCents ? 0 : flatFeeCents;
}

/**
 * Recalcule un panier À PARTIR DE LA BASE : prix, disponibilité, stock et personnalisation.
 * Les montants envoyés par le navigateur ne sont jamais utilisés.
 */
export function priceLines(
  input: z.infer<typeof cartInputSchema>,
  products: Product[],
  settings: SiteSettings,
): PricedCart {
  const errors: string[] = [];
  const requested = new Map<string, number>();
  for (const l of input) requested.set(l.productId, (requested.get(l.productId) ?? 0) + l.quantity);

  const lines: PricedLine[] = input.map((l) => {
    const p = products.find((x) => x.id === l.productId);
    if (!p || p.status !== "published") {
      const msg = "Ce produit n'est plus disponible.";
      errors.push(msg);
      return { productId: l.productId, name: "Produit indisponible", slug: "", image: "", quantity: l.quantity, unitPriceCents: 0, lineTotalCents: 0, personalization: null, error: msg, maxQuantity: 0 };
    }
    const pers = validatePersonalization(p, l.personalization ?? null);
    const unit = p.priceCents + (pers.value ? p.personalization.extraPriceCents : 0);
    let error = pers.error;
    if (p.stock <= 0) error = "Rupture de stock : retirez ce produit pour continuer.";
    else if ((requested.get(p.id) ?? 0) > p.stock)
      error = `Stock insuffisant : ${p.stock} pièce(s) disponible(s) au total pour ce produit.`;
    if (error) errors.push(`${p.name} — ${error}`);
    return {
      productId: p.id,
      name: p.name,
      slug: p.slug,
      image: p.images[0]?.src ?? "",
      quantity: l.quantity,
      unitPriceCents: unit,
      lineTotalCents: unit * l.quantity,
      personalization: pers.value,
      error,
      maxQuantity: Math.min(20, p.stock),
    };
  });

  const subtotalCents = lines.reduce((s, l) => s + (l.error ? 0 : l.lineTotalCents), 0);
  const shippingCents = shippingFor(subtotalCents, settings);
  return {
    lines,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    errors,
    canCheckout: errors.length === 0 && lines.length > 0,
  };
}

export async function priceCart(rawInput: unknown): Promise<PricedCart | { invalid: string }> {
  const parsed = cartInputSchema.safeParse(rawInput);
  if (!parsed.success) return { invalid: parsed.error.issues[0]?.message ?? "Panier invalide." };
  const [products, settings] = await Promise.all([
    getProductsByIds([...new Set(parsed.data.map((l) => l.productId))]),
    getSettings(),
  ]);
  return priceLines(parsed.data, products, settings);
}
