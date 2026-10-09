import type { PersonalizationChoice, Product } from "@/lib/types";

const ALLOWED = /^[\p{L}\p{N} '’\-.,&!?:/()\n]*$/u;

export function hasPersonalization(c: PersonalizationChoice | null | undefined) {
  return Boolean(c && (c.text || c.date || (c.motif && c.motif !== "Aucun") || c.notes || c.referenceMediaId));
}

/** Validation STRICTE côté serveur des options de gravure, selon la configuration du produit. */
export function validatePersonalization(
  product: Product,
  choice: PersonalizationChoice | null | undefined,
): { value: PersonalizationChoice | null; error?: string } {
  if (!choice || !hasPersonalization(choice)) return { value: null };
  const cfg = product.personalization;
  if (!cfg.enabled) return { value: null, error: `« ${product.name} » n'est pas personnalisable en ligne.` };
  if (cfg.mode === "request")
    return { value: null, error: `« ${product.name} » nécessite une demande de personnalisation préalable.` };

  const out: PersonalizationChoice = {};
  if (choice.text) {
    const text = choice.text.replace(/\r/g, "").trim();
    const lines = text.split("\n");
    if (lines.length > cfg.textLines) return { value: null, error: `${cfg.textLines} ligne(s) maximum.` };
    if (lines.some((l) => [...l].length > cfg.textMaxLength))
      return { value: null, error: `${cfg.textMaxLength} caractères maximum par ligne.` };
    if (!ALLOWED.test(text)) return { value: null, error: "Le texte contient des caractères non gravables (emojis, symboles)." };
    out.text = text;
  }
  if (choice.date) {
    if (!cfg.allowDate) return { value: null, error: "La gravure d'une date n'est pas proposée pour ce produit." };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(choice.date) || Number.isNaN(Date.parse(choice.date)))
      return { value: null, error: "Date invalide." };
    out.date = choice.date;
  }
  if (choice.font) {
    if (!cfg.fonts.includes(choice.font)) return { value: null, error: "Police de gravure non disponible." };
    out.font = choice.font;
  } else if (out.text && cfg.fonts.length) {
    out.font = cfg.fonts[0];
  }
  if (choice.motif) {
    if (!cfg.motifs.includes(choice.motif)) return { value: null, error: "Motif non disponible." };
    if (choice.motif !== "Aucun") out.motif = choice.motif;
  }
  if (choice.notes) {
    if (!cfg.allowNotes) return { value: null, error: "Les instructions ne sont pas proposées pour ce produit." };
    out.notes = choice.notes.slice(0, 400);
  }
  if (choice.referenceMediaId) {
    if (!cfg.allowImage) return { value: null, error: "L'ajout d'image n'est pas proposé pour ce produit." };
    out.referenceMediaId = choice.referenceMediaId;
  }
  return { value: hasPersonalization(out) ? out : null };
}
