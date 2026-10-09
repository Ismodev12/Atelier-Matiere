import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/shop/ProductCard";
import type { Availability, Category, Product, PublicReview, SiteContent } from "@/lib/types";
import { cn, formatDate, safeHref } from "@/lib/utils";

/* ───────────────────────── Catégories ───────────────────────── */

export function CategoriesSection({ intro, categories }: { intro: SiteContent["categoriesIntro"]; categories: Category[] }) {
  const list = categories.filter((c) => c.isVisible).slice(0, 4);
  if (!list.length) return null;
  const layout = [
    "sm:col-span-2 lg:col-span-7 lg:row-span-2 aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto",
    "lg:col-span-5 aspect-[4/3]",
    "lg:col-span-5 aspect-[4/3]",
    "lg:col-span-12 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/8]",
  ];
  return (
    <section aria-labelledby="cat-title" className="container-x py-24 lg:py-36">
      <Reveal className="mb-12 flex flex-col justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">{intro.label}</p>
          <h2 id="cat-title" className="display-lg mt-5 max-w-2xl">{intro.title}</h2>
        </div>
        <Link href="/boutique" className="link-u self-start text-sm tracking-wide lg:self-auto">
          Voir toute la boutique <ArrowRight size={15} aria-hidden />
        </Link>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {list.map((c, i) => (
          <Reveal key={c.id} delay={i * 90} className={cn("relative", i === 3 && "sm:col-span-2", layout[i])}>
            <Link href={`/boutique?categorie=${c.slug}`} className="group img-zoom absolute inset-0 block overflow-hidden rounded-[1.5rem]">
              <Image src={c.image} alt="" fill sizes={i === 0 ? "(min-width:1024px) 58vw, 100vw" : "(min-width:1024px) 42vw, 100vw"} className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-ivory sm:p-8">
                <div>
                  <p className="font-display text-sm italic opacity-80">N° {String(i + 1).padStart(2, "0")}</p>
                  <h3 className={cn("mt-1 font-display leading-none", i === 0 || i === 3 ? "text-[2.4rem] sm:text-5xl" : "text-[2rem] sm:text-4xl")}>{c.name}</h3>
                  <p className="mt-3 hidden max-w-sm text-sm text-ivory/80 sm:block">{c.description}</p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ivory/50 transition-colors duration-500 group-hover:bg-ivory group-hover:text-charcoal">
                  <ArrowUpRight size={18} aria-hidden />
                  <span className="sr-only">Voir la collection {c.name}</span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Sélection produits ───────────────────────── */

export function FeaturedSection({
  content,
  products,
}: {
  content: SiteContent["featured"];
  products: { product: Product; availability: Availability }[];
}) {
  if (!products.length) return null;
  return (
    <section aria-labelledby="featured-title" className="border-y border-line bg-paper py-24 lg:py-36">
      <div className="container-x">
        <Reveal className="mb-14 grid gap-6 lg:mb-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">{content.label}</p>
            <h2 id="featured-title" className="display-lg mt-5">{content.title}</h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-charcoal-soft">{content.text}</p>
            <Link href="/boutique" className="link-u mt-5 text-sm tracking-wide">
              Toute la collection <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
        </Reveal>
        <ul className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-x-10 [&::-webkit-scrollbar]:hidden">
          {products.map(({ product, availability }, i) => (
            <Reveal as="li" key={product.id} delay={(i % 3) * 110} className={cn("w-[78vw] shrink-0 snap-start sm:w-auto", i % 3 === 1 && "lg:translate-y-16")}>
              <ProductCard product={product} availability={availability} index={i} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── Personnalisation ───────────────────────── */

export function PersonalizationSection({ content }: { content: SiteContent["personalization"] }) {
  const examples = content.examples.split("·").map((s) => s.trim()).filter(Boolean);
  return (
    <section aria-labelledby="perso-title" className="paper-grain relative overflow-hidden bg-charcoal text-ivory">
      <div className="container-x relative grid gap-14 py-24 lg:grid-cols-12 lg:gap-10 lg:py-36">
        <Reveal className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] lg:aspect-[5/6]">
            <Image src={content.image} alt={content.imageAlt} fill sizes="(min-width:1024px) 48vw, 100vw" className="object-cover opacity-90" />
          </div>
          {/* Aperçu d'une gravure */}
          <div className="absolute -bottom-8 left-6 right-6 rounded-2xl border border-ivory/15 bg-[#2d2c27]/95 p-5 backdrop-blur sm:right-auto sm:w-80 lg:-right-10 lg:left-auto">
            <p className="text-[0.62rem] tracking-[0.22em] text-wood-light uppercase">Exemple de gravure</p>
            <p className="mt-3 font-display text-3xl text-ivory italic">Claire &amp; Hugo</p>
            <p className="mt-1 font-sans text-[0.7rem] tracking-[0.4em] text-ivory/70 uppercase">14 · 06 · 2026</p>
          </div>
        </Reveal>
        <Reveal delay={120} className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
          <p className="eyebrow !text-wood-light">{content.label}</p>
          <h2 id="perso-title" className="display-lg mt-6">{content.title}</h2>
          <p className="mt-7 text-[1.05rem] leading-relaxed text-ivory/75">{content.text}</p>
          <ul className="mt-10 border-t border-ivory/15">
            {examples.map((e, i) => (
              <li key={e} className="flex items-baseline justify-between border-b border-ivory/15 py-3.5">
                <span className="font-display text-2xl">{e}</span>
                <span className="font-display text-sm text-ivory/45 italic">{String(i + 1).padStart(2, "0")}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link href={safeHref(content.href)} className="btn btn-light">
              {content.cta} <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Savoir-faire ───────────────────────── */

export function CraftSection({ content }: { content: SiteContent["craft"] }) {
  const items = [
    { k: "Le bois", v: content.wood },
    { k: "Le verre", v: content.glass },
    { k: "La gravure", v: content.engraving },
  ];
  return (
    <section aria-labelledby="craft-title" className="container-x py-24 lg:py-36">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="relative lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] lg:aspect-[6/5]">
            <Image src={content.image} alt={content.imageAlt} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
          </div>
          {content.secondaryImage && (
            <div className="absolute -bottom-10 -right-2 hidden aspect-square w-[36%] overflow-hidden rounded-[1.5rem] border-[8px] border-ivory sm:block lg:-right-12">
              <Image src={content.secondaryImage} alt={content.secondaryImageAlt} fill sizes="25vw" className="object-cover" />
            </div>
          )}
        </Reveal>
        <Reveal delay={120} className="flex flex-col justify-center lg:col-span-4 lg:col-start-9">
          <p className="eyebrow">{content.label}</p>
          <h2 id="craft-title" className="display-md mt-5">{content.title}</h2>
          <p className="mt-6 text-charcoal-soft">{content.text}</p>
          <dl className="mt-10 space-y-6">
            {items.map((it, i) => (
              <div key={it.k} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-t border-line pt-5">
                <dt className="contents">
                  <span className="font-display text-lg text-wood italic">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl">{it.k}</span>
                </dt>
                <dd className="col-start-2 mt-1.5 text-sm text-ink-muted">{it.v}</dd>
              </div>
            ))}
          </dl>
          <Link href="/a-propos" className="link-u mt-10 self-start text-sm tracking-wide">
            Découvrir l&apos;atelier <ArrowRight size={15} aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Processus ───────────────────────── */

export function ProcessSection({ content }: { content: SiteContent["process"] }) {
  return (
    <section aria-labelledby="process-title" className="border-t border-line bg-ivory-deep/60 py-24 lg:py-32">
      <div className="container-x">
        <Reveal className="mb-14 max-w-2xl">
          <p className="eyebrow">{content.label}</p>
          <h2 id="process-title" className="display-md mt-5">{content.title}</h2>
        </Reveal>
        <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {content.steps.map((s, i) => (
            <Reveal as="li" key={i} delay={i * 100} className="border-t border-charcoal/70 pt-6">
              <span className="font-display text-6xl leading-none font-light text-wood">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 font-display text-[1.65rem] leading-tight">{s.title}</h3>
              <p className="mt-3 text-sm text-ink-muted">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── Avis ───────────────────────── */

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5 text-wood" role="img" aria-label={`Note : ${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} aria-hidden fill={n <= rating ? "currentColor" : "none"} strokeWidth={1.4} />
      ))}
    </span>
  );
}

export function ReviewsSection({ intro, reviews }: { intro: SiteContent["reviewsIntro"]; reviews: PublicReview[] }) {
  return (
    <section aria-labelledby="reviews-title" className="container-x py-24 lg:py-32">
      <Reveal className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">{intro.label}</p>
          <h2 id="reviews-title" className="display-md mt-5">{intro.title}</h2>
        </div>
        <Link href="/avis" className="link-u self-start text-sm tracking-wide lg:self-auto">
          Laisser un avis <ArrowRight size={15} aria-hidden />
        </Link>
      </Reveal>
      {reviews.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line-strong p-10 text-center text-charcoal-soft">
          Aucun avis publié pour le moment. Vous avez commandé une création ?{" "}
          <Link href="/avis" className="underline underline-offset-4">Partagez votre expérience.</Link>
        </p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-3">
          {reviews.slice(0, 3).map((r, i) => (
            <Reveal as="li" key={r.id} delay={i * 100} className="flex flex-col rounded-[1.5rem] border border-line bg-paper p-7 lg:p-9">
              {r.isDemo && (
                <span className="mb-5 self-start rounded-full bg-wood/10 px-2.5 py-1 text-[0.62rem] tracking-[0.16em] text-wood uppercase">
                  Avis d&apos;exemple — prototype
                </span>
              )}
              <Stars rating={r.rating} />
              <blockquote className="mt-5 flex-1 font-display text-[1.45rem] leading-snug">« {r.body} »</blockquote>
              <footer className="mt-7 border-t border-line pt-4 text-sm">
                <p className="font-medium">{r.authorName}</p>
                <p className="text-ink-muted">
                  {r.productName ? `${r.productName} · ` : ""}
                  {formatDate(r.createdAt)}
                </p>
              </footer>
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ───────────────────────── Appel final ───────────────────────── */

export function FinalCtaSection({ content }: { content: SiteContent["finalCta"] }) {
  return (
    <section aria-labelledby="final-title" className="px-3 pb-24 sm:px-6 lg:pb-32">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[2rem] lg:rounded-[2.5rem]">
        <Image src={content.image} alt={content.imageAlt} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-charcoal/60" aria-hidden />
        <Reveal className="relative flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center text-ivory lg:min-h-[70vh]">
          <p className="eyebrow eyebrow-plain !text-ivory/75">Sur mesure</p>
          <h2 id="final-title" className="display-xl mt-6 italic">{content.title}</h2>
          <p className="mt-6 max-w-lg text-[1.05rem] text-ivory/85">{content.text}</p>
          <Link href={safeHref(content.href)} className="btn btn-light mt-10">
            {content.cta} <ArrowUpRight size={16} aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
