import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { Reveal } from "@/components/site/Reveal";
import { availabilityOf, listCategories, listMaterials, listPublicProducts, type ShopQuery } from "@/lib/repo/catalog";
import { getSettings } from "@/lib/repo/settings";

export const metadata: Metadata = { title: "Boutique", description: "Créations en bois et en verre, personnalisables par gravure." };

const SORTS: Record<string, ShopQuery["sort"]> = {
  nouveautes: "newest",
  "prix-croissant": "price-asc",
  "prix-decroissant": "price-desc",
};

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v ?? "").slice(0, 80);

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const current = { q: one(sp.q), categorie: one(sp.categorie), matiere: one(sp.matiere), dispo: one(sp.dispo), tri: one(sp.tri) };
  const [categories, materials, settings] = await Promise.all([listCategories({ visibleOnly: true }), listMaterials(), getSettings()]);
  const products = await listPublicProducts({
    q: current.q,
    category: current.categorie,
    material: current.matiere,
    availability: current.dispo === "disponible" ? "available" : current.dispo === "personnalisable" ? "personalizable" : "",
    sort: SORTS[current.tri] ?? "featured",
  });
  const activeCategory = categories.find((c) => c.slug === current.categorie);

  return (
    <div className="container-x pt-10 pb-24 lg:pt-16 lg:pb-36">
      <header className="grid gap-6 pb-10 lg:grid-cols-12 lg:items-end lg:pb-14">
        <div className="lg:col-span-8">
          <p className="eyebrow">{activeCategory ? "Collection" : "La boutique"}</p>
          <h1 className="display-xl mt-5">{activeCategory ? activeCategory.name : "Toutes les créations"}</h1>
        </div>
        <p className="text-charcoal-soft lg:col-span-4">
          {activeCategory?.description ??
            "Objets en bois et en verre, préparés à l'atelier. Certaines pièces peuvent être gravées à votre demande."}
        </p>
      </header>

      <ShopFilters
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
        materials={materials}
        current={current}
        total={products.length}
      />

      {products.length === 0 ? (
        <div className="mt-16 rounded-[1.5rem] border border-dashed border-line-strong px-6 py-20 text-center">
          <p className="font-display text-3xl">Aucune création ne correspond à votre recherche.</p>
          <p className="mt-3 text-ink-muted">Essayez d&apos;autres filtres, ou décrivez-nous l&apos;objet que vous imaginez.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/boutique" className="btn btn-outline">Voir toute la boutique</Link>
            <Link href="/personnalisation#demande" className="btn btn-primary">Demande sur mesure</Link>
          </div>
        </div>
      ) : (
        <ul className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
          {products.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 3) * 80}>
              <ProductCard product={p} availability={availabilityOf(p, settings)} priority={i < 3} />
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}
