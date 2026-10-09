import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { getContent } from "@/lib/repo/settings";
import { imageAlt, imageSrc } from "@/lib/data/images";

export const metadata: Metadata = { title: "À propos" };

export default async function AboutPage() {
  const c = await getContent();
  const blocks = [
    { k: "Notre histoire", v: c.about.story },
    { k: "Nos méthodes", v: c.about.methods },
    { k: "Nos engagements", v: c.about.commitments },
  ];
  return (
    <>
      <section className="container-x pt-10 pb-16 lg:pt-16 lg:pb-24">
        <p className="eyebrow anim-hero">À propos</p>
        <h1 className="display-xl anim-hero mt-6 max-w-5xl [animation-delay:80ms]">{c.about.title}</h1>
        <p className="anim-hero mt-8 max-w-2xl text-lg leading-relaxed text-charcoal-soft [animation-delay:160ms]">{c.about.intro}</p>
      </section>
      <div className="px-3 sm:px-6">
        <div className="relative mx-auto aspect-[4/5] max-w-[96rem] overflow-hidden rounded-[2rem] sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image src={c.about.image} alt={c.about.imageAlt} fill priority sizes="100vw" className="anim-hero-img object-cover" />
        </div>
      </div>
      <section className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-32">
        <div className="space-y-14 lg:col-span-7">
          {blocks.map((b, i) => (
            <Reveal key={b.k} delay={i * 80} className="grid gap-4 border-t border-line pt-8 sm:grid-cols-[12rem_1fr]">
              <h2 className="font-display text-3xl">{b.k}</h2>
              <p className="leading-relaxed whitespace-pre-line text-charcoal-soft">{b.v}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={150} className="lg:col-span-4 lg:col-start-9">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem]">
            <Image src={imageSrc("workshop.emballage", 1200)} alt={imageAlt("workshop.emballage")} fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" />
          </div>
          <p className="mt-3 font-display text-ink-muted italic">Chaque pièce est préparée et emballée avec attention.</p>
          <Link href="/personnalisation#demande" className="btn btn-primary mt-8">
            Parler de mon projet <ArrowUpRight size={16} aria-hidden />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
