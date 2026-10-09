/**
 * Contenus et paramètres du site.
 * Version frontend : tout est dans src/lib/data/defaults.ts — modifiez ce fichier pour changer
 * les textes, images, liens sociaux, frais de livraison et documents légaux.
 */
import { DEFAULT_CONTENT, DEFAULT_LEGAL, DEFAULT_SETTINGS, LEGAL_SLUGS, type LegalSlug } from "@/lib/data/defaults";
import type { SiteContent, SiteSettings } from "@/lib/types";

export async function getSettings(): Promise<SiteSettings> {
  return DEFAULT_SETTINGS;
}

export async function getContent(): Promise<SiteContent> {
  return DEFAULT_CONTENT;
}

export type LegalDoc = { slug: LegalSlug; title: string; content: string; updatedAt: Date | null };

export async function getLegalDocs(): Promise<LegalDoc[]> {
  return LEGAL_SLUGS.map((slug) => ({ slug, ...DEFAULT_LEGAL[slug], updatedAt: null }));
}
