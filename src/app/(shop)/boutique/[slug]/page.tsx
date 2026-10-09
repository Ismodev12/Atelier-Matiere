import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductPurchase } from "@/components/shop/ProductPurchase";
import { AvailabilityDot, ProductCard } from "@/components/shop/ProductCard";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { Stars } from "@/components/home/Sections";
import { availabilityOf, getPublicProductBySlug, getRelatedProducts, listCategories } from "@/lib/repo/catalog";
import { getApprovedReviews } from "@/lib/repo/reviews";
import { getSettings } from "@/lib/repo/settings";
import { formatPrice } from "@/lib/money";
import { formatDate } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getPublicProductBySlug((await params).slug);
  if (!p) return { title: "Produit introuvable" };
  return { title: p.name, description: p.shortDescription, openGraph: { images: p.images[0] ? [p.images[0].src] : [] } };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  if (!product) notFound();
  const [settings, categories, related, reviews] = await Promise.all([
    getSettings(),
    listCategories(),
    getRelatedProducts(product),
    getApprovedReviews({ productId: product.id, limit: 10 }),
  ]);
  const availability = availabilityOf(product, settings);
  const category = categories.find((c) => c.id === product.categoryId);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const details = [
    { k: "Matériau", v: product.materials.join(", ") },
    { k: "Dimensions", v: product.dimensions },
    { k: "Entretien", v: product.care },
  ].filter((d) => d.v);

  return (
    <div className="pb-24 lg:pb-36">
      <div className="container-x pt-6 lg:pt-10">
        <nav aria-label="Fil d'Ariane" className="text-xs text-ink-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/boutique" className="inline-flex items-center gap-1 hover:text-charcoal"><ArrowLeft size={13} aria-hidden /> Boutique</Link></li>
            {category && (<><li aria-hidden>/</li><li><Link href={`/boutique?categorie=${category.slug}`} className="hover:text-charcoal">{category.name}</Link></li></>)}
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-charcoal">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          <div className="lg:col-span-5">
            {category && <p className="eyebrow">{category.name}</p>}
            <h1 className="mt-4 font-display text-[clamp(2.6rem,4.6vw,4.4rem)] leading-[0.98] font-light">{product.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              <p className="text-2xl tabular-nums">{formatPrice(product.priceCents)}</p>
              <AvailabilityDot availability={availability} stock={product.stock} showStock={product.showStock} threshold={product.lowStockThreshold} />
              {reviews.length > 0 && (
                <a href="#avis" className="inline-flex items-center gap-2 text-sm text-ink-muted">
                  <Stars rating={Math.round(avg)} /> {reviews.length} avis
                </a>
              )}
            </div>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-charcoal-soft">{product.shortDescription}</p>

            <div className="mt-8">
              <ProductPurchase
                demo
                availability={availability}
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  priceCents: product.priceCents,
                  image: product.images[0]?.src ?? "",
                  materials: product.materials,
                  personalization: product.personalization,
                  stock: product.stock,
                }}
              />
            </div>

            <div className="mt-10 border-t border-line">
              <details className="group border-b border-line" open>
                <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-display text-xl [&::-webkit-details-marker]:hidden">
                  Description <span className="text-2xl transition-transform duration-300 group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="pb-6 leading-relaxed whitespace-pre-line text-charcoal-soft">{product.description}</p>
              </details>
              <details className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-display text-xl [&::-webkit-details-marker]:hidden">
                  Caractéristiques &amp; entretien <span className="text-2xl transition-transform duration-300 group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <dl className="grid gap-4 pb-6 text-sm">
                  {details.map((d) => (
                    <div key={d.k} className="grid grid-cols-[8rem_1fr] gap-4">
                      <dt className="text-ink-muted">{d.k}</dt>
                      <dd>{d.v}</dd>
                    </div>
                  ))}
                  {product.showStock && product.stock > 0 && (
                    <div className="grid grid-cols-[8rem_1fr] gap-4"><dt className="text-ink-muted">Quantité</dt><dd>{product.stock} disponible(s)</dd></div>
                  )}
                </dl>
              </details>
              <details className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-display text-xl [&::-webkit-details-marker]:hidden">
                  Livraison <span className="text-2xl transition-transform duration-300 group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="pb-6 text-sm text-charcoal-soft">
                  {settings.shipping.info}{" "}
                  {settings.shipping.freeThresholdCents > 0 && `Livraison offerte dès ${formatPrice(settings.shipping.freeThresholdCents)}.`}
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>

      {settings.reviews.productReviewsEnabled && (
        <section id="avis" aria-labelledby="avis-title" className="container-x mt-24 grid gap-10 lg:mt-32 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Avis</p>
            <h2 id="avis-title" className="display-md mt-4">Ce qu&apos;en disent nos clients</h2>
            {reviews.length === 0 ? (
              <p className="mt-6 text-charcoal-soft">Pas encore d&apos;avis publié sur cette pièce.</p>
            ) : (
              <ul className="mt-8 space-y-6">
                {reviews.map((r) => (
                  <li key={r.id} className="border-t border-line pt-5">
                    <Stars rating={r.rating} />
                    <p className="mt-3 font-display text-xl leading-snug">« {r.body} »</p>
                    <p className="mt-3 text-sm text-ink-muted">{r.authorName} · {formatDate(r.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ReviewForm productId={product.id} productName={product.name} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="container-x mt-24 border-t border-line pt-16 lg:mt-32">
          <h2 id="related-title" className="display-md">Vous aimerez aussi</h2>
          <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}><ProductCard product={p} availability={availabilityOf(p, settings)} /></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
