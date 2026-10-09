import type { Metadata } from "next";
import Image from "next/image";
import { CustomRequestForm } from "@/components/forms/CustomRequestForm";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { availabilityOf, getPublicProductBySlug, listPublicProducts } from "@/lib/repo/catalog";
import { getContent, getSettings } from "@/lib/repo/settings";
import { imageAlt, imageSrc } from "@/lib/data/images";

export const metadata: Metadata = {
  title: "Personnalisation",
  description: "Gravure d'un prénom, d'une date, d'un message ou d'un motif : imaginez votre création sur mesure.",
};

const POSSIBLE = [
  { t: "Un prénom, des initiales", d: "Sur les pièces personnalisables en ligne, dans la limite de caractères indiquée." },
  { t: "Une date", d: "Mariage, naissance, anniversaire — gravée dans le format de votre choix." },
  { t: "Un message court", d: "Quelques mots, une citation : la surface disponible fixe la longueur." },
  { t: "Un motif", d: "Parmi les motifs proposés, ou à partir de votre dessin après étude." },
  { t: "Un projet complet", d: "Cadeaux d'entreprise, séries, objets d'événement : sur devis." },
];

const STEPS = [
  { t: "Vous décrivez", d: "Votre idée, l'occasion, le texte et le délai souhaité." },
  { t: "Nous étudions", d: "Faisabilité technique, choix de la pièce, proposition et devis." },
  { t: "Vous validez", d: "Un aperçu de la gravure vous est soumis avant fabrication." },
  { t: "Nous réalisons", d: "La pièce est préparée, gravée puis expédiée avec soin." },
];

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function PersonalizationPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const slug = typeof sp.produit === "string" ? sp.produit.slice(0, 80) : "";
  const [content, settings, products, prefill] = await Promise.all([
    getContent(),
    getSettings(),
    listPublicProducts({ availability: "personalizable" }),
    slug ? getPublicProductBySlug(slug) : Promise.resolve(null),
  ]);

  return (
    <>
      <section className="container-x grid gap-10 pt-10 pb-20 lg:grid-cols-12 lg:pt-16 lg:pb-28">
        <div className="flex flex-col justify-end lg:col-span-6">
          <p className="eyebrow anim-hero">{content.personalization.label}</p>
          <h1 className="display-xl anim-hero mt-6 [animation-delay:80ms]">
            Votre idée.
            <span className="block text-wood italic">Notre savoir-faire.</span>
          </h1>
          <p className="anim-hero mt-8 max-w-lg text-[1.05rem] leading-relaxed text-charcoal-soft [animation-delay:160ms]">{content.personalization.text}</p>
          <div className="anim-hero mt-10 flex flex-wrap gap-3 [animation-delay:240ms]">
            <a href="#demande" className="btn btn-primary">Décrire mon projet</a>
            <a href="#pieces" className="btn btn-outline">Pièces personnalisables en ligne</a>
          </div>
        </div>
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[4/3] lg:aspect-[5/6]">
            <Image src={imageSrc("workshop.trace", 1800)} alt={imageAlt("workshop.trace")} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="anim-hero-img object-cover" />
          </div>
        </div>
      </section>

      <section aria-labelledby="possible-title" className="border-y border-line bg-paper py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Possibilités</p>
            <h2 id="possible-title" className="display-md mt-5">Ce que nous pouvons graver</h2>
            <p className="mt-6 text-sm text-ink-muted">
              Chaque matière a ses limites : la taille du texte, le nombre de caractères et la finesse d&apos;un motif dépendent de la pièce.
              Les options proposées en ligne sont celles que nous savons réaliser de façon fiable ; pour le reste, nous étudions votre demande avant de nous engager.
            </p>
          </Reveal>
          <ul className="lg:col-span-7 lg:col-start-6">
            {POSSIBLE.map((p, i) => (
              <Reveal as="li" key={p.t} delay={i * 60} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-line py-6 last:border-b">
                <span className="font-display text-xl text-wood italic">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-[1.7rem] leading-tight">{p.t}</h3>
                  <p className="mt-1.5 text-sm text-charcoal-soft">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="steps-title" className="container-x py-20 lg:py-28">
        <h2 id="steps-title" className="display-md max-w-xl">Un projet sur mesure, étape par étape</h2>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 90} className="rounded-[1.5rem] bg-ivory-deep p-7">
              <span className="font-display text-5xl font-light text-wood">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 font-display text-2xl">{s.t}</h3>
              <p className="mt-2 text-sm text-charcoal-soft">{s.d}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {products.length > 0 && (
        <section id="pieces" aria-labelledby="pieces-title" className="container-x pb-20 lg:pb-28">
          <div className="flex flex-col justify-between gap-4 border-t border-line pt-14 lg:flex-row lg:items-end">
            <h2 id="pieces-title" className="display-md">Personnalisables en ligne</h2>
            <p className="max-w-md text-sm text-ink-muted">Choisissez le texte, la police ou le motif directement sur la fiche produit, avec un aperçu indicatif.</p>
          </div>
          <ul className="mt-10 -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
            {products.slice(0, 8).map((p) => (
              <li key={p.id} className="w-[70vw] shrink-0 snap-start sm:w-auto"><ProductCard product={p} availability={availabilityOf(p, settings)} /></li>
            ))}
          </ul>
        </section>
      )}

      <section id="demande" aria-labelledby="demande-title" className="scroll-mt-28 bg-ivory-deep/70 py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Demande sur mesure</p>
            <h2 id="demande-title" className="display-md mt-5">Parlez-nous de votre projet</h2>
            <p className="mt-6 text-charcoal-soft">
              Plus votre description est précise, plus notre réponse le sera. Nous vous recontactons par e-mail avec une proposition et, si besoin, quelques questions.
            </p>
            {prefill && (
              <p className="mt-6 rounded-xl border border-line bg-paper px-4 py-3 text-sm">
                Pièce concernée : <strong className="font-medium">{prefill.name}</strong>
              </p>
            )}
          </div>
          <div className="lg:col-span-8">
            <CustomRequestForm defaultObject={prefill ? prefill.name : ""} />
          </div>
        </div>
      </section>
    </>
  );
}
