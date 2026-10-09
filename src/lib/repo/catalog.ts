import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@/lib/data/demo-catalog";
import type { Availability, Category, Product, SiteSettings } from "@/lib/types";

export function availabilityOf(p: Product, settings?: SiteSettings): Availability {
  if (p.stock > 0) return "available";
  if (p.comingSoon && (settings?.commerce.comingSoonEnabled ?? true)) return "coming_soon";
  return "out_of_stock";
}

/** Un produit n'est achetable que publié, avec du stock, et hors mode « étude préalable ». */
export function isPurchasable(p: Product) {
  return p.status === "published" && p.stock > 0;
}

export async function listCategories(opts: { visibleOnly?: boolean } = {}): Promise<Category[]> {
  return DEMO_CATEGORIES.filter((c) => !opts.visibleOnly || c.isVisible).sort((a, b) => a.sortOrder - b.sortOrder);
}

async function allPublished(): Promise<Product[]> {
  return DEMO_PRODUCTS.filter((p) => p.status === "published");
}

export type ShopQuery = {
  q?: string;
  category?: string;
  material?: string;
  availability?: "available" | "personalizable" | "";
  sort?: "featured" | "newest" | "price-asc" | "price-desc";
};

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export async function listPublicProducts(query: ShopQuery = {}) {
  const [products, categories] = await Promise.all([allPublished(), listCategories({ visibleOnly: false })]);
  let list = [...products];
  if (query.category) {
    const c = categories.find((x) => x.slug === query.category);
    list = c ? list.filter((p) => p.categoryId === c.id) : [];
  }
  if (query.material) list = list.filter((p) => p.materials.some((m) => normalize(m) === normalize(query.material!)));
  if (query.availability === "available") list = list.filter((p) => p.stock > 0);
  if (query.availability === "personalizable") list = list.filter((p) => p.personalization.enabled);
  if (query.q && query.q.trim()) {
    const terms = normalize(query.q.trim()).split(/\s+/).slice(0, 6);
    list = list.filter((p) => {
      const hay = normalize([p.name, p.shortDescription, p.description, p.materials.join(" ")].join(" "));
      return terms.every((t) => hay.includes(t));
    });
  }
  switch (query.sort) {
    case "price-asc":
      list.sort((a, b) => a.priceCents - b.priceCents);
      break;
    case "price-desc":
      list.sort((a, b) => b.priceCents - a.priceCents);
      break;
    case "newest":
      list.sort((a, b) => +b.createdAt - +a.createdAt);
      break;
    default:
      // En avant d'abord, puis disponibles, puis nouveautés
      list.sort(
        (a, b) =>
          Number(b.isFeatured) - Number(a.isFeatured) ||
          a.featuredOrder - b.featuredOrder ||
          Number(b.stock > 0) - Number(a.stock > 0) ||
          +b.createdAt - +a.createdAt,
      );
  }
  return list;
}

export async function listMaterials() {
  const products = await allPublished();
  return [...new Set(products.flatMap((p) => p.materials))].sort();
}

export async function getFeaturedProducts(limit = 6) {
  const products = await allPublished();
  return products
    .filter((p) => p.isFeatured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
    .slice(0, limit);
}

export async function getPublicProductBySlug(slug: string) {
  const products = await allPublished();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(p: Product, limit = 4) {
  const products = await allPublished();
  const others = products.filter((x) => x.id !== p.id);
  const same = others.filter((x) => x.categoryId === p.categoryId);
  const rest = others.filter((x) => x.categoryId !== p.categoryId && x.materials.some((m) => p.materials.includes(m)));
  return [...same, ...rest].slice(0, limit);
}

/** Lecture faisant foi pour le panier (prix, stock, personnalisation). */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  return DEMO_PRODUCTS.filter((p) => ids.includes(p.id));
}
