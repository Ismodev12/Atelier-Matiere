import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { SiteContent } from "@/lib/types";
import { safeHref } from "@/lib/utils";

export function Hero({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* ───── Mobile & tablette : photographie pleine largeur, texte en dessous ───── */}
      <div className="lg:hidden">
        <div className="relative mx-3 h-[54svh] min-h-[340px] overflow-hidden rounded-[1.75rem] sm:mx-6 sm:h-[62svh]">
          <Image src={hero.image} alt={hero.imageAlt} fill priority sizes="100vw" className="anim-hero-img object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/0 to-charcoal/10" aria-hidden />
          <p className="absolute top-5 left-5 rounded-full bg-ivory/90 px-3 py-1.5 text-[0.64rem] font-medium tracking-[0.22em] uppercase backdrop-blur">
            {hero.label}
          </p>
          {hero.secondaryImage && (
            <div className="absolute right-4 bottom-4 hidden aspect-[3/4] w-[28%] overflow-hidden rounded-2xl border-[5px] border-ivory xs:block">
              <Image src={hero.secondaryImage} alt={hero.secondaryImageAlt} fill sizes="30vw" className="object-cover" />
            </div>
          )}
          <p className="absolute bottom-5 left-5 font-display text-sm text-ivory italic">Bois · Verre · Gravure</p>
        </div>
        <div className="container-x pt-7 pb-14 sm:pt-12">
          <h1 id="hero-title" className="anim-hero font-display text-[clamp(2.6rem,11vw,4.6rem)] leading-[0.98] font-light tracking-[-0.02em]">
            <span className="block">{hero.titleLine1}</span>
            <span className="block text-wood italic">{hero.titleLine2}</span>
          </h1>
          <p className="anim-hero mt-6 max-w-md text-[1.02rem] leading-relaxed text-charcoal-soft [animation-delay:120ms]">{hero.text}</p>
          <div className="anim-hero mt-8 flex flex-col gap-3 [animation-delay:220ms] sm:flex-row">
            <Link href={safeHref(hero.primaryHref)} className="btn btn-primary w-full sm:w-auto">
              {hero.primaryCta} <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href={safeHref(hero.secondaryHref)} className="btn btn-outline w-full sm:w-auto">
              {hero.secondaryCta} <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      {/* ───── Desktop : composition éditoriale asymétrique ───── */}
      <div className="container-x hidden lg:block">
        <div className="relative grid h-[calc(100svh-7.5rem)] max-h-[960px] min-h-[640px] grid-cols-12 gap-x-8 pt-4 pb-10">
          <div className="relative z-10 col-span-5 flex flex-col justify-between pt-10 pb-2">
            <div>
              <p className="eyebrow anim-hero">{hero.label}</p>
              <h1 id="hero-title" className="anim-hero mt-8 font-display text-[clamp(3.6rem,5.7vw,6.4rem)] leading-[0.94] font-light tracking-[-0.025em] [animation-delay:80ms]">
                <span className="block">{hero.titleLine1}</span>
                <span className="mt-2 block text-wood italic">{hero.titleLine2}</span>
              </h1>
            </div>
            <div className="anim-hero max-w-[26rem] [animation-delay:200ms]">
              <p className="text-[1.05rem] leading-relaxed text-charcoal-soft">{hero.text}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href={safeHref(hero.primaryHref)} className="btn btn-primary">
                  {hero.primaryCta} <ArrowRight size={16} aria-hidden />
                </Link>
                <Link href={safeHref(hero.secondaryHref)} className="btn btn-outline">
                  {hero.secondaryCta} <ArrowUpRight size={16} aria-hidden />
                </Link>
              </div>
              <dl className="mt-12 grid grid-cols-3 border-t border-line pt-5 text-[0.7rem] tracking-[0.16em] text-ink-muted uppercase">
                <div><dt className="sr-only">Matière</dt><dd>Bois</dd></div>
                <div><dt className="sr-only">Matière</dt><dd>Verre</dd></div>
                <div><dt className="sr-only">Savoir-faire</dt><dd>Gravure</dd></div>
              </dl>
            </div>
          </div>

          <div className="relative col-span-7">
            <div className="absolute inset-0 overflow-hidden rounded-[2.25rem]">
              <Image src={hero.image} alt={hero.imageAlt} fill priority sizes="60vw" className="anim-hero-img object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/25 via-transparent to-transparent" aria-hidden />
            </div>
            {/* Badge circulaire */}
            <div className="absolute top-8 right-8 hidden h-32 w-32 xl:block" aria-hidden>
              <svg viewBox="0 0 120 120" className="h-full w-full animate-[spin_38s_linear_infinite] text-ivory motion-reduce:animate-none">
                <defs>
                  <path id="circlePath" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
                </defs>
                <text fontSize="9.5" letterSpacing="3.2" fill="currentColor" style={{ textTransform: "uppercase", fontFamily: "var(--font-sans)" }}>
                  <textPath href="#circlePath">Bois · Verre · Gravure · Sur mesure ·</textPath>
                </text>
              </svg>
              <span className="absolute inset-0 grid place-items-center font-display text-3xl text-ivory italic">&amp;</span>
            </div>
            {/* Second visuel, en chevauchement */}
            {hero.secondaryImage && (
              <figure className="anim-hero absolute -left-24 bottom-10 w-[34%] max-w-[260px] [animation-delay:450ms]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.4rem] border-[7px] border-ivory shadow-[0_30px_60px_-30px_rgb(36_36_31/0.55)]">
                  <Image src={hero.secondaryImage} alt={hero.secondaryImageAlt} fill sizes="260px" className="object-cover" />
                </div>
                <figcaption className="mt-3 pl-1 font-display text-[0.95rem] text-ink-muted italic">Fig. 02 — La transparence du verre</figcaption>
              </figure>
            )}
            <p className="absolute right-8 bottom-7 font-display text-lg text-ivory italic drop-shadow">Fig. 01 — Bois gravé</p>
          </div>
        </div>
      </div>
    </section>
  );
}
